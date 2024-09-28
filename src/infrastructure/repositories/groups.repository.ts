import { captureException, startSpan } from "@sentry/nextjs";
import { eq, inArray } from "drizzle-orm";
import { injectable } from "inversify";
import { IGroupsRepository } from "~/application/repositories/groups.repository.interface";
import { Group, GroupInsert, GroupUpdate } from "~/domain/entities/group";
import { DatabaseOperationError } from "~/domain/errors/common";
import { db } from "drizzle";
import {
  eventGroups as eventGroupsTable,
  groups as groupsTable,
} from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  GroupNotFoundError,
  GroupStillReferencedError,
  GroupWithThatNameAlreadyExistsError,
} from "~/domain/errors/groups";

@injectable()
export class GroupsRepository implements IGroupsRepository {
  async createGroup(group: GroupInsert): Promise<Group> {
    return await startSpan(
      { name: "GroupsRepository > createGroup" },
      async () => {
        try {
          const query = db.insert(groupsTable).values(group).returning();

          const [createdGroup] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdGroup) {
            throw new DatabaseOperationError("Failed to create group");
          }

          return createdGroup;
        } catch (error) {
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new GroupWithThatNameAlreadyExistsError(
              "Group already exists",
              {
                cause: error,
              },
            );
          }

          captureException(error, { data: group });
          throw new DatabaseOperationError("Failed to create group", {
            cause: error,
          });
        }
      },
    );
  }

  async getGroupById(id: number): Promise<Group | undefined> {
    return await startSpan(
      { name: "GroupsRepository > getGroupById" },
      async () => {
        try {
          const query = db.query.groups.findFirst({
            where: eq(groupsTable.id, id),
          });

          const group = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return group;
        } catch (error) {
          captureException(error, { data: { groupId: id } });
          throw new DatabaseOperationError("Failed to get group", {
            cause: error,
          });
        }
      },
    );
  }

  async getGroupByName(name: string): Promise<Group | undefined> {
    return await startSpan(
      { name: "GroupsRepository > getGroupByName" },
      async () => {
        try {
          const query = db.query.groups.findFirst({
            where: eq(groupsTable.name, name),
          });

          const group = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return group;
        } catch (error) {
          captureException(error, { data: { groupName: name } });
          throw new DatabaseOperationError("Failed to get group", {
            cause: error,
          });
        }
      },
    );
  }

  async getAllGroups(): Promise<Group[]> {
    return await startSpan(
      { name: "GroupsRepository > getAllGroups" },
      async () => {
        try {
          const query = db.query.groups.findMany();

          const allGroups = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allGroups;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get all groups", {
            cause: error,
          });
        }
      },
    );
  }

  async getGroupsByEventId(eventId: number): Promise<Group[]> {
    return await startSpan(
      { name: "GroupsRepository > getGroupsByEventId" },
      async () => {
        try {
          const query = db.query.groups.findMany({
            where: inArray(
              groupsTable.id,
              db
                .select()
                .from(eventGroupsTable)
                .where(eq(eventGroupsTable.eventId, eventId)),
            ),
          });

          const groups = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return groups;
        } catch (error) {
          captureException(error, { data: { eventId } });
          throw new DatabaseOperationError("Failed to get groups by event ID", {
            cause: error,
          });
        }
      },
    );
  }

  async updateGroup(id: number, group: GroupUpdate): Promise<Group> {
    return await startSpan(
      { name: "GroupsRepository > updateGroup" },
      async () => {
        try {
          const query = db
            .update(groupsTable)
            .set(group)
            .where(eq(groupsTable.id, id))
            .returning();

          const [updatedGroup] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedGroup) {
            throw new GroupNotFoundError("Group not found");
          }

          return updatedGroup;
        } catch (error) {
          if (error instanceof GroupNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new GroupWithThatNameAlreadyExistsError(
              "Group already exists",
              {
                cause: error,
              },
            );
          }

          captureException(error, { data: { groupId: id, group } });
          throw new DatabaseOperationError("Failed to update group", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteGroup(id: number): Promise<void> {
    return await startSpan(
      { name: "GroupsRepository > deleteGroup" },
      async () => {
        try {
          const query = db
            .delete(groupsTable)
            .where(eq(groupsTable.id, id))
            .returning();

          const [deletedGroup] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedGroup) {
            throw new GroupNotFoundError("Group not found");
          }
        } catch (error) {
          if (error instanceof GroupNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new GroupStillReferencedError("Group still referenced", {
              cause: error,
            });
          }

          captureException(error, { data: { groupId: id } });
          throw new DatabaseOperationError("Failed to delete group", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteAllGroups(): Promise<void> {
    return await startSpan(
      { name: "GroupsRepository > deleteAllGroups" },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(groupsTable).returning();

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new GroupStillReferencedError("Group still referenced", {
              cause: error,
            });
          }

          captureException(error);
          throw new DatabaseOperationError("Failed to delete all groups", {
            cause: error,
          });
        }
      },
    );
  }
}
