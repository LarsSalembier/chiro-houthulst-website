import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IGroupsRepository } from "~/application/repositories/groups.repository.interface";
import { Group, GroupInsert, GroupUpdate } from "~/domain/entities/group";
import {
  GroupNotFoundError,
  GroupStillReferencedError,
  GroupWithThatNameAlreadyExistsError,
} from "~/domain/errors/groups";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockGroupsRepository implements IGroupsRepository {
  private groups: Group[] = mockData.groups;
  private autoIncrementId: number =
    this.groups.reduce((maxId, group) => {
      return group.id > maxId ? group.id : maxId;
    }, 0) + 1;

  private isGroupReferenced(groupId: number): boolean {
    const eventGroupWithGroupExists = mockData.eventGroups.some(
      (eg) => eg.groupId === groupId,
    );

    const yearlyMembershipWithGroupExists = mockData.yearlyMemberships.some(
      (ym) => ym.groupId === groupId,
    );

    return eventGroupWithGroupExists || yearlyMembershipWithGroupExists;
  }

  async createGroup(group: GroupInsert): Promise<Group> {
    return startSpan({ name: "MockGroupsRepository > createGroup" }, () => {
      const existingGroup = this.groups.find(
        (g) => g.name.toLowerCase() === group.name.toLowerCase(),
      );
      if (existingGroup) {
        throw new GroupWithThatNameAlreadyExistsError("Group already exists");
      }

      const newGroup: Group = {
        id: this.autoIncrementId++,
        ...group,
      };
      this.groups.push(newGroup);
      return newGroup;
    });
  }

  async getGroupById(id: number): Promise<Group | undefined> {
    return startSpan({ name: "MockGroupsRepository > getGroupById" }, () => {
      return this.groups.find((g) => g.id === id);
    });
  }

  async getGroupByName(name: string): Promise<Group | undefined> {
    return startSpan({ name: "MockGroupsRepository > getGroupByName" }, () => {
      return this.groups.find(
        (g) => g.name.toLowerCase() === name.toLowerCase(),
      );
    });
  }

  async getAllGroups(): Promise<Group[]> {
    return startSpan({ name: "MockGroupsRepository > getAllGroups" }, () => {
      return this.groups;
    });
  }

  async getGroupsByEventId(eventId: number): Promise<Group[]> {
    return startSpan(
      { name: "MockGroupsRepository > getGroupsByEventId" },
      () => {
        const eventGroupIds = mockData.eventGroups
          .filter((eg) => eg.eventId === eventId)
          .map((eg) => eg.groupId);
        return this.groups.filter((g) => eventGroupIds.includes(g.id));
      },
    );
  }

  async updateGroup(id: number, group: GroupUpdate): Promise<Group> {
    return startSpan({ name: "MockGroupsRepository > updateGroup" }, () => {
      const existingGroupIndex = this.groups.findIndex((g) => g.id === id);
      if (existingGroupIndex === -1) {
        throw new GroupNotFoundError("Group not found");
      }

      const existingGroupWithName = this.groups.find(
        (g) => g.name === group.name && g.id !== id,
      );
      if (existingGroupWithName) {
        throw new GroupWithThatNameAlreadyExistsError("Group already exists");
      }

      this.groups[existingGroupIndex] = {
        ...this.groups[existingGroupIndex]!,
        ...group,
      };
      return this.groups[existingGroupIndex];
    });
  }

  async deleteGroup(id: number): Promise<void> {
    return startSpan({ name: "MockGroupsRepository > deleteGroup" }, () => {
      if (this.isGroupReferenced(id)) {
        throw new GroupStillReferencedError("Group still referenced");
      }

      const groupIndex = this.groups.findIndex((g) => g.id === id);
      if (groupIndex === -1) {
        throw new GroupNotFoundError("Group not found");
      }

      this.groups.splice(groupIndex, 1);
    });
  }

  async deleteAllGroups(): Promise<void> {
    return startSpan({ name: "MockGroupsRepository > deleteAllGroups" }, () => {
      if (this.groups.some((group) => this.isGroupReferenced(group.id))) {
        throw new GroupStillReferencedError("Group still referenced");
      }

      this.groups = [];
    });
  }
}
