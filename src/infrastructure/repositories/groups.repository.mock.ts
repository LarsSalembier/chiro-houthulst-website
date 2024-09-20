import { injectable } from "inversify";
import { type IGroupsRepository } from "~/application/repositories/groups.repository.interface";
import {
  type Group,
  type GroupInsert,
  type GroupUpdate,
} from "~/domain/entities/group";
import { type Gender } from "~/domain/enums/gender";
import {
  GroupIsStillReferencedError,
  GroupNameAlreadyExistsError,
  GroupNotFoundError,
} from "~/domain/errors/groups";
import { differenceInDays } from "date-fns";

interface Membership {
  memberId: number;
  groupId: number;
  workYearId: number;
}

@injectable()
export class MockGroupsRepository implements IGroupsRepository {
  private _groups: Group[] = [];
  private _nextGroupId = 1;
  private _memberships: Membership[] = [];
  private _groupReferences = new Map<number, number>();

  /**
   * Creates a new group.
   *
   * @param group The group data to insert.
   * @returns The created group.
   * @throws {GroupNameAlreadyExistsError} If a group with the same name already exists.
   */
  async createGroup(group: GroupInsert): Promise<Group> {
    // Check if a group with the same name already exists
    const existingGroup = this._groups.find((g) => g.name === group.name);
    if (existingGroup) {
      throw new GroupNameAlreadyExistsError(
        `Group with name ${group.name} already exists`,
      );
    }

    const newGroup: Group = {
      ...group,
      id: this._nextGroupId++,
    };

    this._groups.push(newGroup);
    // Initialize reference count to zero
    this._groupReferences.set(newGroup.id, 0);

    return newGroup;
  }

  /**
   * Returns a group by id, or undefined if not found.
   *
   * @param id The group id.
   * @returns The group, or undefined if not found.
   */
  async getGroup(id: number): Promise<Group | undefined> {
    return this._groups.find((group) => group.id === id);
  }

  /**
   * Returns a group by name, or undefined if not found.
   *
   * @param groupName The group name.
   * @returns The group, or undefined if not found.
   */
  async getGroupByName(groupName: string): Promise<Group | undefined> {
    return this._groups.find((group) => group.name === groupName);
  }

  /**
   * Returns all groups.
   *
   * @returns All groups.
   */
  async getGroups(): Promise<Group[]> {
    return [...this._groups];
  }

  /**
   * Returns all active groups.
   *
   * @returns All active groups.
   */
  async getActiveGroups(): Promise<Group[]> {
    return this._groups.filter((group) => group.active);
  }

  /**
   * Returns all active groups a member can be registered in for the given birth date and gender.
   *
   * @param birthDate The member's birth date.
   * @param gender The member's gender.
   * @returns All groups for the given birth date.
   */
  async getActiveGroupsForBirthDateAndGender(
    birthDate: Date,
    gender: Gender,
  ): Promise<Group[]> {
    const ageInDays = differenceInDays(new Date(), birthDate);

    return this._groups.filter((group) => {
      if (!group.active) return false;

      // Gender check
      if (gender !== "X" && group.gender && group.gender !== gender) {
        return false;
      }

      // Age checks
      if (group.minimumAgeInDays && ageInDays < group.minimumAgeInDays) {
        return false;
      }

      if (group.maximumAgeInDays && ageInDays > group.maximumAgeInDays) {
        return false;
      }

      return true;
    });
  }

  /**
   * Updates a group by id.
   *
   * @param id The group id.
   * @param group The group data to update.
   * @returns The updated group.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupNameAlreadyExistsError} If a group with the same name already exists.
   */
  async updateGroup(id: number, group: GroupUpdate): Promise<Group> {
    const index = this._groups.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new GroupNotFoundError(`Group with id ${id} not found`);
    }

    // Check if the new name already exists (if name is being updated)
    if (group.name && group.name !== this._groups[index]!.name) {
      const existingGroup = this._groups.find((g) => g.name === group.name);
      if (existingGroup) {
        throw new GroupNameAlreadyExistsError(
          `Group with name ${group.name} already exists`,
        );
      }
    }

    const updatedGroup = {
      ...this._groups[index]!,
      ...group,
    };

    this._groups[index] = updatedGroup;
    return updatedGroup;
  }

  /**
   * Deletes a group by id.
   *
   * @param id The group id.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupIsStillReferencedError} If the group is still referenced.
   */
  async deleteGroup(id: number): Promise<void> {
    const index = this._groups.findIndex((group) => group.id === id);

    if (index === -1) {
      throw new GroupNotFoundError(`Group with id ${id} not found`);
    }

    const referenceCount = this._groupReferences.get(id) ?? 0;
    if (referenceCount > 0) {
      throw new GroupIsStillReferencedError(
        "Failed to delete group. The group is still referenced",
      );
    }

    // Check if there are memberships associated with the group
    const hasMemberships = this._memberships.some(
      (membership) => membership.groupId === id,
    );
    if (hasMemberships) {
      throw new GroupIsStillReferencedError(
        "Failed to delete group. The group is still referenced by memberships",
      );
    }

    this._groups.splice(index, 1);
    this._groupReferences.delete(id);
  }

  /**
   * Checks if a group is active.
   *
   * @param id The group id.
   * @returns True if the group is active, false otherwise.
   * @throws {GroupNotFoundError} If the group is not found.
   */
  async isGroupActive(id: number): Promise<boolean> {
    const group = await this.getGroup(id);
    if (!group) {
      throw new GroupNotFoundError(`Group with id ${id} not found`);
    }
    return group.active;
  }

  /**
   * Gets the amount of members in a group.
   *
   * @param groupId The group id.
   * @param workYearId The workyear id.
   * @returns The amount of members in the group.
   * @throws {GroupNotFoundError} If the group is not found.
   */
  async getMembersCount(groupId: number, workYearId: number): Promise<number> {
    const group = await this.getGroup(groupId);
    if (!group) {
      throw new GroupNotFoundError(`Group with id ${groupId} not found`);
    }

    const count = this._memberships.filter(
      (membership) =>
        membership.groupId === groupId && membership.workYearId === workYearId,
    ).length;

    return count;
  }

  /**
   * Adds a membership to the group.
   *
   * @param memberId The member id.
   * @param groupId The group id.
   * @param workYearId The work year id.
   * @throws {GroupNotFoundError} If the group is not found.
   */
  async addMembership(
    memberId: number,
    groupId: number,
    workYearId: number,
  ): Promise<void> {
    const group = await this.getGroup(groupId);
    if (!group) {
      throw new GroupNotFoundError(`Group with id ${groupId} not found`);
    }

    this._memberships.push({ memberId, groupId, workYearId });

    // Optionally increment reference count if needed for other entities
    const count = this._groupReferences.get(groupId) ?? 0;
    this._groupReferences.set(groupId, count + 1);
  }

  /**
   * Removes a membership from the group.
   *
   * @param memberId The member id.
   * @param groupId The group id.
   * @param workYearId The work year id.
   * @throws {GroupNotFoundError} If the group is not found.
   */
  async removeMembership(
    memberId: number,
    groupId: number,
    workYearId: number,
  ): Promise<void> {
    const index = this._memberships.findIndex(
      (membership) =>
        membership.memberId === memberId &&
        membership.groupId === groupId &&
        membership.workYearId === workYearId,
    );

    if (index !== -1) {
      this._memberships.splice(index, 1);

      // Optionally decrement reference count if needed for other entities
      const count = this._groupReferences.get(groupId) ?? 0;
      if (count > 0) {
        this._groupReferences.set(groupId, count - 1);
      }
    }
  }

  /**
   * Increments the reference count for a group.
   *
   * @param groupId The group id.
   * @throws {GroupNotFoundError} If the group is not found.
   */
  async incrementReference(groupId: number): Promise<void> {
    const group = await this.getGroup(groupId);
    if (!group) {
      throw new GroupNotFoundError(`Group with id ${groupId} not found`);
    }

    const count = this._groupReferences.get(groupId) ?? 0;
    this._groupReferences.set(groupId, count + 1);
  }

  /**
   * Decrements the reference count for a group.
   *
   * @param groupId The group id.
   * @throws {GroupNotFoundError} If the group is not found.
   */
  async decrementReference(groupId: number): Promise<void> {
    const group = await this.getGroup(groupId);
    if (!group) {
      throw new GroupNotFoundError(`Group with id ${groupId} not found`);
    }

    const count = this._groupReferences.get(groupId) ?? 0;
    if (count > 0) {
      this._groupReferences.set(groupId, count - 1);
    }
  }
}
