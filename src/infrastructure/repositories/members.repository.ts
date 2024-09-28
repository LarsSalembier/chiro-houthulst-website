import { captureException, startSpan } from "@sentry/nextjs";
import { eq, and, inArray } from "drizzle-orm";
import { injectable } from "inversify";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";
import {
  type MemberUpdate,
  type Member,
  type MemberInsert,
} from "~/domain/entities/member";
import { db } from "drizzle";
import {
  UNIQUE_NAME_AND_DATE_OF_BIRTH_FOR_MEMBER_CONSTRAINT,
  UNIQUE_EMAIL_ADDRESS_FOR_MEMBER_CONSTRAINT,
  members as membersTable,
  membersParents as membersParentsTable,
} from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  MemberNotFoundError,
  MemberStillReferencedError,
  MemberWithThatEmailAddressAlreadyExistsError,
  MemberWithThatNameAndBirthDateAlreadyExistsError,
  ParentIsAlreadyLinkedToMemberError,
  ParentIsNotLinkedToMemberError,
} from "~/domain/errors/members";
import { DatabaseOperationError } from "~/domain/errors/common";
import { ParentNotFoundError } from "~/domain/errors/parents";

@injectable()
export class MembersRepository implements IMembersRepository {
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
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            if (
              error.constraint_name ===
              UNIQUE_NAME_AND_DATE_OF_BIRTH_FOR_MEMBER_CONSTRAINT
            ) {
              throw new MemberWithThatNameAndBirthDateAlreadyExistsError(
                "A member with the same name and date of birth already exists",
                { cause: error },
              );
            }

            if (
              error.constraint_name ===
              UNIQUE_EMAIL_ADDRESS_FOR_MEMBER_CONSTRAINT
            ) {
              throw new MemberWithThatEmailAddressAlreadyExistsError(
                "A member with the same email address already exists",
                { cause: error },
              );
            }
          }

          captureException(error, { data: member });
          throw new DatabaseOperationError("Failed to create member", {
            cause: error,
          });
        }
      },
    );
  }

  async getMemberById(id: number): Promise<Member | undefined> {
    return await startSpan(
      { name: "MembersRepository > getMemberById" },
      async () => {
        try {
          const query = db.query.members.findFirst({
            where: eq(membersTable.id, id),
          });

          const member = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return member ? this.mapToEntity(member) : undefined;
        } catch (error) {
          captureException(error, { data: { memberId: id } });
          throw new DatabaseOperationError("Failed to get member", {
            cause: error,
          });
        }
      },
    );
  }

  async getMemberByNameAndDateOfBirth(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): Promise<Member | undefined> {
    return await startSpan(
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

          const member = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return member ? this.mapToEntity(member) : undefined;
        } catch (error) {
          captureException(error, {
            data: { firstName, lastName, dateOfBirth },
          });
          throw new DatabaseOperationError("Failed to get member", {
            cause: error,
          });
        }
      },
    );
  }

  async getMemberByEmailAddress(
    emailAddress: string,
  ): Promise<Member | undefined> {
    return await startSpan(
      { name: "MembersRepository > getMemberByEmailAddress" },
      async () => {
        try {
          const query = db.query.members.findFirst({
            where: eq(membersTable.emailAddress, emailAddress),
          });

          const member = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return member ? this.mapToEntity(member) : undefined;
        } catch (error) {
          captureException(error, { data: { emailAddress } });
          throw new DatabaseOperationError("Failed to get member", {
            cause: error,
          });
        }
      },
    );
  }

  async getAllMembers(): Promise<Member[]> {
    return await startSpan(
      { name: "MembersRepository > getAllMembers" },
      async () => {
        try {
          const query = db.query.members.findMany();

          const allMembers = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allMembers.map((member) => this.mapToEntity(member));
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get all members", {
            cause: error,
          });
        }
      },
    );
  }

  async getMembersForParent(parentId: number): Promise<Member[]> {
    return await startSpan(
      { name: "MembersRepository > getMembersForParent" },
      async () => {
        try {
          const query = db.query.members.findMany({
            where: inArray(
              membersTable.id,
              db
                .select()
                .from(membersParentsTable)
                .where(eq(membersParentsTable.parentId, parentId)),
            ),
          });

          const members = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return members.map((member) => this.mapToEntity(member));
        } catch (error) {
          captureException(error, { data: { parentId } });
          throw new DatabaseOperationError("Failed to get members for parent", {
            cause: error,
          });
        }
      },
    );
  }

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
          if (error instanceof MemberNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            if (
              error.constraint_name ===
              UNIQUE_NAME_AND_DATE_OF_BIRTH_FOR_MEMBER_CONSTRAINT
            ) {
              throw new MemberWithThatNameAndBirthDateAlreadyExistsError(
                "A member with the same name and date of birth already exists",
                { cause: error },
              );
            }

            if (
              error.constraint_name ===
              UNIQUE_EMAIL_ADDRESS_FOR_MEMBER_CONSTRAINT
            ) {
              throw new MemberWithThatEmailAddressAlreadyExistsError(
                "A member with the same email address already exists",
                { cause: error },
              );
            }
          }

          captureException(error, { data: { memberId: id, member } });
          throw new DatabaseOperationError("Failed to update member", {
            cause: error,
          });
        }
      },
    );
  }

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
          if (error instanceof MemberNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new MemberStillReferencedError("Member still referenced", {
              cause: error,
            });
          }

          captureException(error, { data: { memberId: id } });
          throw new DatabaseOperationError("Failed to delete member", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteAllMembers(): Promise<void> {
    return await startSpan(
      { name: "MembersRepository > deleteAllMembers" },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(membersTable).returning();

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
            throw new MemberStillReferencedError("Member still referenced", {
              cause: error,
            });
          }

          captureException(error);
          throw new DatabaseOperationError("Failed to delete all members", {
            cause: error,
          });
        }
      },
    );
  }

  async addParentToMember(
    memberId: number,
    parentId: number,
    isPrimary = false,
  ): Promise<void> {
    return await startSpan(
      { name: "MembersRepository > addParentToMember" },
      async () => {
        try {
          const query = db
            .insert(membersParentsTable)
            .values({
              memberId,
              parentId,
              isPrimary,
            })
            .returning();

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
            if (error.column_name === "member_id") {
              throw new MemberNotFoundError("Member not found", {
                cause: error,
              });
            }

            if (error.column_name === "parent_id") {
              throw new ParentNotFoundError("Parent not found", {
                cause: error,
              });
            }
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new ParentIsAlreadyLinkedToMemberError(
              "Parent is already linked to member",
              { cause: error },
            );
          }

          captureException(error, { data: { memberId, parentId, isPrimary } });
          throw new DatabaseOperationError("Failed to add parent to member", {
            cause: error,
          });
        }
      },
    );
  }

  async removeParentFromMember(
    memberId: number,
    parentId: number,
  ): Promise<void> {
    return await startSpan(
      { name: "MembersRepository > removeParentFromMember" },
      async () => {
        try {
          const query = db
            .delete(membersParentsTable)
            .where(
              and(
                eq(membersParentsTable.memberId, memberId),
                eq(membersParentsTable.parentId, parentId),
              ),
            )
            .returning();

          const [result] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!result) {
            throw new ParentIsNotLinkedToMemberError(
              "Parent is not linked to member",
            );
          }
        } catch (error) {
          if (error instanceof ParentIsNotLinkedToMemberError) {
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

  async removeAllParentsFromMember(memberId: number): Promise<void> {
    return await startSpan(
      { name: "MembersRepository > removeAllParentsFromMember" },
      async () => {
        try {
          const query = db
            .delete(membersParentsTable)
            .where(eq(membersParentsTable.memberId, memberId))
            .returning();

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError(
            "Failed to remove all parents from member",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  async removeAllParentsFromAllMembers(): Promise<void> {
    return await startSpan(
      { name: "MembersRepository > removeAllParentsFromAllMembers" },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(membersParentsTable).returning();

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError(
            "Failed to remove all parents from all members",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
