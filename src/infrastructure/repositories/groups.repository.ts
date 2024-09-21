import { captureException, startSpan } from "@sentry/nextjs";
import { eq, and, or, gte, lte, count, isNull } from "drizzle-orm";
import { injectable } from "inversify";
import { type IGroupsRepository } from "~/application/repositories/groups.repository.interface";
import {
  type GroupUpdate,
  type Group,
  type GroupInsert,
} from "~/domain/entities/group";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  GroupIsStillReferencedError,
  GroupNameAlreadyExistsError,
} from "~/domain/errors/groups";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";
import { GroupNotFoundError } from "~/domain/errors/groups";
import { isDatabaseError } from "~/domain/errors/database-error";
import { db } from "drizzle";
import { groups, yearlyMemberships } from "drizzle/schema";
import { differenceInDays } from "date-fns";
import { type Gender } from "~/domain/enums/gender";

@injectable()
export class GroupsRepository implements IGroupsRepository {
  /**
   * Creates a new group.
   *
   * @param group The group data to insert.
   * @returns The created group.
   * @throws {GroupNameAlreadyExistsError} If a group with the same name already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createGroup(group: GroupInsert): Promise<Group> {
    return await startSpan(
      { name: "GroupsRepository > createGroup" },
      async () => {
        try {
          const query = db.insert(groups).values(group).returning();

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
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new GroupNameAlreadyExistsError(
              `Group with name ${group.name} already exists`,
              { cause: error },
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

  /**
   * Returns a group by id, or undefined if not found.
   *
   * @param id The group id.
   * @returns The group, or undefined if not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getGroup(id: number): Promise<Group | undefined> {
    return await startSpan(
      { name: "GroupsRepository > getGroup" },
      async () => {
        try {
          const query = db.query.groups.findFirst({
            where: eq(groups.id, id),
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

  /**
   * Returns a group by name, or undefined if not found.
   *
   * @param groupName The group name.
   * @returns The group, or undefined if not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getGroupByName(groupName: string): Promise<Group | undefined> {
    return await startSpan(
      { name: "GroupsRepository > getGroupByName" },
      async () => {
        try {
          const query = db.query.groups.findFirst({
            where: eq(groups.name, groupName),
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
          captureException(error, { data: { groupName } });
          throw new DatabaseOperationError("Failed to get group by name", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Returns all groups.
   *
   * @returns All groups.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getGroups(): Promise<Group[]> {
    return await startSpan(
      { name: "GroupsRepository > getGroups" },
      async () => {
        try {
          const query = db.query.groups.findMany();

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
          captureException(error);
          throw new DatabaseOperationError("Failed to get groups", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Returns all active groups.
   *
   * @returns All active groups.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getActiveGroups(): Promise<Group[]> {
    return await startSpan(
      { name: "GroupsRepository > getActiveGroups" },
      async () => {
        try {
          const query = db.query.groups.findMany({
            where: eq(groups.active, true),
          });

          const activeGroups = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return activeGroups;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get active groups", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Returns all active groups a member can be registered in for the given birth date and gender.
   *
   * @param birthDate The member's birth date.
   * @param gender The member's gender.
   * @returns All groups for the given birth date.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getActiveGroupsForBirthDateAndGender(
    birthDate: Date,
    gender: Gender,
  ): Promise<Group[]> {
    return await startSpan(
      { name: "GroupsRepository > getGroupsForBirthDate" },
      async () => {
        try {
          const ageInDays = differenceInDays(new Date(), birthDate);

          console.log("ageInDays", ageInDays);

          const genderQueryPart =
            gender === "X"
              ? undefined
              : or(isNull(groups.gender), eq(groups.gender, gender));

          const query = db.query.groups.findMany({
            where: and(
              eq(groups.active, true),
              genderQueryPart,
              lte(groups.minimumAgeInDays, ageInDays),
              or(
                isNull(groups.maximumAgeInDays),
                gte(groups.maximumAgeInDays, ageInDays),
              ),
            ),
          });

          const groups_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return groups_;
        } catch (error) {
          captureException(error, { data: { birthDate } });
          throw new DatabaseOperationError(
            "Failed to get groups for birth date",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Updates a group by name.
   *
   * @param id The group id.
   * @param group The group data to update.
   * @returns The updated group.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupNameAlreadyExistsError} If a group with the same name already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateGroup(id: number, group: GroupUpdate): Promise<Group> {
    return await startSpan(
      { name: "GroupsRepository > updateGroup" },
      async () => {
        try {
          const updatedGroup = await db.transaction(async (tx) => {
            const query = tx
              .update(groups)
              .set(group)
              .where(eq(groups.id, id))
              .returning();

            const [updatedGroup_] = await startSpan(
              {
                name: query.toSQL().sql,
                op: "db.query",
                attributes: { "db.system": "postgresql" },
              },
              () => query.execute(),
            );

            if (!updatedGroup_) {
              throw new GroupNotFoundError(`Group with id ${id} not found`);
            }

            return updatedGroup_;
          });

          return updatedGroup;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new GroupNameAlreadyExistsError(
              `Group with name ${group.name} already exists`,
              { cause: error },
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

  /**
   * Deletes a group by name.
   *
   * @param id The group id.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupIsStillReferencedError} If the group is still referenced.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteGroup(id: number): Promise<void> {
    return await startSpan(
      { name: "GroupsRepository > deleteGroup" },
      async () => {
        try {
          const query = db.delete(groups).where(eq(groups.id, id)).returning();

          const [deletedGroup] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedGroup) {
            throw new GroupNotFoundError(`Group with id ${id} not found`);
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new GroupIsStillReferencedError(
              "Failed to delete group. The group is still referenced",
              { cause: error },
            );
          }

          captureException(error, { data: { groupId: id } });
          throw new DatabaseOperationError("Failed to delete group", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Checks if a group is active.
   *
   * @param id The group id.
   * @returns True if the group is active, false otherwise.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async isGroupActive(id: number): Promise<boolean> {
    return await startSpan(
      { name: "GroupsRepository > isGroupActive" },
      async () => {
        try {
          const group = await this.getGroup(id);

          if (!group) {
            throw new GroupNotFoundError(`Group with id ${id} not found`);
          }

          return group.active;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { groupId: id } });
          throw new DatabaseOperationError(
            "Failed to check if group is active",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets the amount of members in a group.
   *
   * @param groupId The group id.
   * @param workYearId The workyear id.
   * @returns The amount of members in the group.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getMembersCount(groupId: number, workYearId: number): Promise<number> {
    return await startSpan(
      { name: "GroupsRepository > getMembersCount" },
      async () => {
        try {
          const groupExists = await this.getGroup(groupId);

          if (!groupExists) {
            throw new GroupNotFoundError(`Group with id ${groupId} not found`);
          }

          const query = db
            .select({ count: count() })
            .from(yearlyMemberships)
            .where(
              and(
                eq(yearlyMemberships.groupId, groupId),
                eq(yearlyMemberships.workYearId, workYearId),
              ),
            );

          const result = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!result[0]) {
            return 0;
          }

          return result[0].count;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { groupId, workYearId } });
          throw new DatabaseOperationError(
            "Failed to get member count for group",
            { cause: error },
          );
        }
      },
    );
  }
}
