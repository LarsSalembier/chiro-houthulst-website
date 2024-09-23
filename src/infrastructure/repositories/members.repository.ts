import { captureException, startSpan } from "@sentry/nextjs";
import { eq, and } from "drizzle-orm";
import { injectable } from "inversify";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";
import {
  type MemberUpdate,
  type Member,
  type MemberInsert,
} from "~/domain/entities/member";
import { db } from "drizzle";
import {
  members as membersTable,
  membersParents,
  yearlyMemberships,
} from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  MemberAlreadyExistsError,
  MemberNotFoundError,
  MemberStillReferencedError,
} from "~/domain/errors/members";
import { GroupNotFoundError } from "~/domain/errors/groups";
import { WorkyearNotFoundError } from "~/domain/errors/workyears";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";
import {
  ParentAlreadyLinkedToMemberError,
  ParentNotFoundError,
  ParentNotLinkedToMemberError,
} from "~/domain/errors/parents";
import { getInjection } from "di/container";

@injectable()
export class MembersRepository implements IMembersRepository {
  constructor(
    private readonly parentsRepository = getInjection("IParentsRepository"),
    private readonly groupsRepository = getInjection("IGroupsRepository"),
    private readonly workyearsRepository = getInjection("IWorkyearsRepository"),
  ) {}

  private mapToEntity(member: typeof membersTable.$inferSelect): Member {
    return {
      ...member,
      name: {
        firstName: member.firstName,
        lastName: member.lastName,
      },
    };
  }

  private mapToDbFieldsPartial(
    member: MemberInsert | MemberUpdate,
  ): Partial<typeof membersTable.$inferInsert> {
    return {
      ...member,
      firstName: member.name?.firstName,
      lastName: member.name?.lastName,
    };
  }

  private mapToDbFields(
    member: MemberInsert,
  ): typeof membersTable.$inferInsert {
    return this.mapToDbFieldsPartial(
      member,
    ) as typeof membersTable.$inferInsert;
  }

  /**
   * Creates a new member.
   *
   * @param member The member data to insert.
   * @returns The created member.
   * @throws {MemberAlreadyExistsError} If a member with the same details already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createMember(member: MemberInsert): Promise<Member> {
    return await startSpan(
      { name: "MembersRepository > createMember" },
      async () => {
        try {
          const query = db
            .insert(membersTable)
            .values(this.mapToDbFields(member))
            .returning();

          const [createdMember] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdMember) {
            throw new DatabaseOperationError("Failed to create member");
          }

          return this.mapToEntity(createdMember);
        } catch (error) {
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new MemberAlreadyExistsError(
              "Member with the same details already exists",
              { cause: error },
            );
          }

          captureException(error, { data: member });
          throw new DatabaseOperationError("Failed to create member", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets a member by their ID.
   *
   * @param id The ID of the member to retrieve.
   * @returns The member if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getMember(id: number): Promise<Member | undefined> {
    return await startSpan(
      { name: "MembersRepository > getMember" },
      async () => {
        try {
          const query = db.query.members.findFirst({
            where: eq(membersTable.id, id),
          });

          const dbMember = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbMember) {
            return undefined;
          }

          return this.mapToEntity(dbMember);
        } catch (error) {
          captureException(error, { data: { memberId: id } });
          throw new DatabaseOperationError("Failed to get member", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets a member by their email address.
   *
   * @param emailAddress The email address of the member to retrieve.
   * @returns The member if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getMemberByEmail(emailAddress: string): Promise<Member | undefined> {
    return await startSpan(
      { name: "MembersRepository > getMemberByEmail" },
      async () => {
        try {
          const query = db.query.members.findFirst({
            where: eq(membersTable.emailAddress, emailAddress),
          });

          const dbMember = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbMember) {
            return undefined;
          }

          return this.mapToEntity(dbMember);
        } catch (error) {
          captureException(error, { data: { email: emailAddress } });
          throw new DatabaseOperationError("Failed to get member by email", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets a member by their first name, last name and date of birth.
   *
   * @param firstName The first name of the member to retrieve.
   * @param lastName The last name of the member to retrieve.
   * @param dateOfBirth The date of birth of the member to retrieve.
   * @returns The member if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMemberByNameAndDateOfBirth(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): Promise<Member | undefined> {
    return startSpan(
      { name: "MembersRepository > getMemberByNameAndDateOfBirth" },
      async () => {
        try {
          const query = db.query.members.findFirst({
            where: and(
              eq(membersTable.firstName, firstName),
              eq(membersTable.lastName, lastName),
              eq(membersTable.dateOfBirth, dateOfBirth),
            ),
          });

          const dbMember = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbMember) {
            return undefined;
          }

          return this.mapToEntity(dbMember);
        } catch (error) {
          captureException(error, {
            data: { firstName, lastName, dateOfBirth },
          });
          throw new DatabaseOperationError(
            "Failed to get member by name and date of birth",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets all members.
   *
   * @returns An array of all members.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getMembers(): Promise<Member[]> {
    return await startSpan(
      { name: "MembersRepository > getMembers" },
      async () => {
        try {
          const query = db.query.members.findMany();

          const dbMembers = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return dbMembers.map((dbMember) => this.mapToEntity(dbMember));
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get members", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets members associated with a parent.
   *
   * @param parentId The ID of the parent.
   * @returns An array of members associated with the parent.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getMembersForParent(parentId: number): Promise<Member[]> {
    return await startSpan(
      { name: "MembersRepository > getMembersForParent" },
      async () => {
        try {
          const parentExists = await this.parentsRepository.getParent(parentId);

          if (!parentExists) {
            throw new ParentNotFoundError("Parent not found");
          }

          const query = db.query.membersParents.findMany({
            where: eq(membersParents.parentId, parentId),
            with: {
              member: true,
            },
          });

          const memberParentLinks = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return memberParentLinks.map((link) => this.mapToEntity(link.member));
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { parentId } });
          throw new DatabaseOperationError("Failed to get members for parent", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets members by group and work year.
   *
   * @param groupId The ID of the group.
   * @param workYearId The ID of the work year.
   * @returns An array of members in the specified group and work year.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getMembersByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<Member[]> {
    return await startSpan(
      { name: "MembersRepository > getMembersByGroup" },
      async () => {
        try {
          const groupExists = await this.groupsRepository.getGroup(groupId);

          if (!groupExists) {
            throw new GroupNotFoundError("Group not found");
          }

          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Work year not found");
          }

          const query = db.query.yearlyMemberships.findMany({
            where: and(
              eq(yearlyMemberships.groupId, groupId),
              eq(yearlyMemberships.workYearId, workYearId),
            ),
            with: {
              member: true,
            },
          });

          const yearlyMemberships_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return yearlyMemberships_.map((ym) => this.mapToEntity(ym.member));
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { groupId, workYearId } });
          throw new DatabaseOperationError("Failed to get members by group", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets members for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of members for the specified work year.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getMembersForWorkYear(workYearId: number): Promise<Member[]> {
    return await startSpan(
      { name: "MembersRepository > getMembersForWorkYear" },
      async () => {
        try {
          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Work year not found");
          }

          const query = db.query.yearlyMemberships.findMany({
            where: eq(yearlyMemberships.workYearId, workYearId),
            with: {
              member: true,
            },
          });

          const yearlyMemberships_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return yearlyMemberships_.map((ym) => this.mapToEntity(ym.member));
        } catch (error) {
          if (error instanceof WorkyearNotFoundError) {
            throw error;
          }

          captureException(error, { data: { workYearId } });
          throw new DatabaseOperationError(
            "Failed to get members for work year",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Updates a member.
   *
   * @param id The ID of the member to update.
   * @param member The member data to update.
   * @returns The updated member.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberAlreadyExistsError} If a member with the same email already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateMember(id: number, member: MemberUpdate): Promise<Member> {
    return await startSpan(
      { name: "MembersRepository > updateMember" },
      async () => {
        try {
          const query = db
            .update(membersTable)
            .set(this.mapToDbFieldsPartial(member))
            .where(eq(membersTable.id, id))
            .returning();

          const [updatedMember] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedMember) {
            throw new MemberNotFoundError("Member not found");
          }

          return this.mapToEntity(updatedMember);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new MemberAlreadyExistsError(
              "Member with the same email already exists",
              { cause: error },
            );
          }

          captureException(error, { data: { memberId: id, member } });
          throw new DatabaseOperationError("Failed to update member", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Deletes a member.
   *
   * @param id The ID of the member to delete.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberStillReferencedError} If the member is still referenced by other entities.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteMember(id: number): Promise<void> {
    return await startSpan(
      { name: "MembersRepository > deleteMember" },
      async () => {
        try {
          const query = db
            .delete(membersTable)
            .where(eq(membersTable.id, id))
            .returning();

          const [deletedMember] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedMember) {
            throw new MemberNotFoundError("Member not found");
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new MemberStillReferencedError(
              "Failed to delete member due to foreign key constraint",
              { cause: error },
            );
          }

          captureException(error, { data: { memberId: id } });
          throw new DatabaseOperationError("Failed to delete member", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Adds a parent to a member.
   *
   * @param memberId The ID of the member.
   * @param parentId The ID of the parent.
   * @param isPrimary Whether the parent is the primary parent.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {ParentAlreadyLinkedToMemberError} If the parent is already linked to the member.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async addParentToMember(
    memberId: number,
    parentId: number,
    isPrimary: boolean,
  ): Promise<void> {
    return await startSpan(
      { name: "MembersRepository > addParentToMember" },
      async () => {
        try {
          const memberExists = await this.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const parentExists = await this.parentsRepository.getParent(parentId);

          if (!parentExists) {
            throw new ParentNotFoundError("Parent not found");
          }

          const query = db.insert(membersParents).values({
            memberId,
            parentId,
            isPrimary,
          });

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new ParentAlreadyLinkedToMemberError(
              "Parent is already linked to the member",
            );
          }

          captureException(error, { data: { memberId, parentId } });
          throw new DatabaseOperationError("Failed to add parent to member", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Removes a parent from a member.
   *
   * @param memberId The ID of the member.
   * @param parentId The ID of the parent.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async removeParentFromMember(
    memberId: number,
    parentId: number,
  ): Promise<void> {
    return await startSpan(
      { name: "MembersRepository > removeParentFromMember" },
      async () => {
        try {
          const memberExists = await this.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const parentExists = await this.parentsRepository.getParent(parentId);

          if (!parentExists) {
            throw new ParentNotFoundError("Parent not found");
          }

          const query = db
            .delete(membersParents)
            .where(
              and(
                eq(membersParents.memberId, memberId),
                eq(membersParents.parentId, parentId),
              ),
            )
            .returning();

          const [deletedLink] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedLink) {
            throw new ParentNotLinkedToMemberError(
              "Parent is not linked to the member",
            );
          }
        } catch (error) {
          if (
            error instanceof NotFoundError ||
            error instanceof ParentNotLinkedToMemberError
          ) {
            throw error;
          }

          captureException(error, { data: { memberId, parentId } });
          throw new DatabaseOperationError(
            "Failed to remove parent from member",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
