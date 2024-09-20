import { captureException, startSpan } from "@sentry/nextjs";
import { eq, and } from "drizzle-orm";
import { injectable } from "inversify";
import { type IParentsRepository } from "~/application/repositories/parents.repository.interface";
import {
  type ParentUpdate,
  type Parent,
  type ParentInsert,
} from "~/domain/entities/parent";
import { db } from "drizzle";
import { parents as parentsTable, membersParents } from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  ParentAlreadyExistsError,
  ParentAlreadyLinkedToMemberError,
  ParentNotFoundError,
  ParentNotLinkedToMemberError,
  ParentStillReferencedError,
} from "~/domain/errors/parents";
import { MemberNotFoundError } from "~/domain/errors/members";
import { AddressNotFoundError } from "~/domain/errors/addresses";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";
import { type IAddressesRepository } from "~/application/repositories/addresses.repository.interface";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";

@injectable()
export class ParentsRepository implements IParentsRepository {
  constructor(
    private readonly addressesRepository: IAddressesRepository,
    private readonly membersRepository: IMembersRepository,
  ) {}
  private mapToEntity(dbParent: typeof parentsTable.$inferSelect): Parent {
    return {
      ...dbParent,
      name: {
        firstName: dbParent.firstName,
        lastName: dbParent.lastName,
      },
    };
  }

  private mapToDbFieldsPartial(
    parent: ParentInsert | ParentUpdate,
  ): Partial<typeof parentsTable.$inferInsert> {
    return {
      ...parent,
      firstName: parent.name?.firstName,
      lastName: parent.name?.lastName,
    };
  }

  private mapToDbFields(
    parent: ParentInsert,
  ): typeof parentsTable.$inferInsert {
    return this.mapToDbFieldsPartial(
      parent,
    ) as typeof parentsTable.$inferInsert;
  }

  /**
   * Creates a new parent.
   *
   * @param parent The parent data to insert.
   * @returns The created parent.
   * @throws {ParentAlreadyExistsError} If a parent with the same email already exists.
   * @throws {AddressNotFoundError} If the address does not exist.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createParent(parent: ParentInsert): Promise<Parent> {
    return await startSpan(
      { name: "ParentsRepository > createParent" },
      async () => {
        try {
          // Ensure the address exists
          const addressExists = await this.addressesRepository.getAddressById(
            parent.addressId,
          );

          if (!addressExists) {
            throw new AddressNotFoundError("Address not found");
          }

          const query = db
            .insert(parentsTable)
            .values(this.mapToDbFields(parent))
            .returning();

          const [createdParent] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdParent) {
            throw new DatabaseOperationError("Failed to create parent");
          }

          return this.mapToEntity(createdParent);
        } catch (error) {
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new ParentAlreadyExistsError(
              "Parent with the same email already exists",
              { cause: error },
            );
          }

          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: parent });
          throw new DatabaseOperationError("Failed to create parent", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets a parent by their ID.
   *
   * @param id The ID of the parent to get.
   * @returns The parent if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getParent(id: number): Promise<Parent | undefined> {
    return await startSpan(
      { name: "ParentsRepository > getParent" },
      async () => {
        try {
          const query = db.query.parents.findFirst({
            where: eq(parentsTable.id, id),
          });

          const dbParent = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbParent) {
            return undefined;
          }

          return this.mapToEntity(dbParent);
        } catch (error) {
          captureException(error, { data: { parentId: id } });
          throw new DatabaseOperationError("Failed to get parent", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets a parent by their email.
   *
   * @param emailAddress The email of the parent to get.
   * @returns The parent if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getParentByEmail(emailAddress: string): Promise<Parent | undefined> {
    return await startSpan(
      { name: "ParentsRepository > getParentByEmail" },
      async () => {
        try {
          const query = db.query.parents.findFirst({
            where: eq(parentsTable.emailAddress, emailAddress),
          });

          const dbParent = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbParent) {
            return undefined;
          }

          return this.mapToEntity(dbParent);
        } catch (error) {
          captureException(error, { data: { email: emailAddress } });
          throw new DatabaseOperationError("Failed to get parent by email", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Updates a parent.
   *
   * @param id The ID of the parent to update.
   * @param parent The parent data to update.
   * @returns The updated parent.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {ParentAlreadyExistsError} If a parent with the new email already exists.
   * @throws {AddressNotFoundError} If the new address does not exist.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateParent(id: number, parent: ParentUpdate): Promise<Parent> {
    return await startSpan(
      { name: "ParentsRepository > updateParent" },
      async () => {
        try {
          const query = db
            .update(parentsTable)
            .set(this.mapToDbFieldsPartial(parent))
            .where(eq(parentsTable.id, id))
            .returning();

          const [updatedParent] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedParent) {
            throw new ParentNotFoundError("Parent not found");
          }

          return this.mapToEntity(updatedParent);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new ParentAlreadyExistsError(
              "Parent with the new email already exists",
              { cause: error },
            );
          }

          captureException(error, { data: { id, parent } });
          throw new DatabaseOperationError("Failed to update parent", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Deletes a parent.
   *
   * @param id The ID of the parent to delete.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {ParentStillReferencedError} If the parent is still referenced by other entities.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteParent(id: number): Promise<void> {
    return await startSpan(
      { name: "ParentsRepository > deleteParent" },
      async () => {
        try {
          const query = db
            .delete(parentsTable)
            .where(eq(parentsTable.id, id))
            .returning();

          const [deletedParent] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedParent) {
            throw new ParentNotFoundError("Parent not found");
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new ParentStillReferencedError(
              "Parent is still referenced by other entities",
              { cause: error },
            );
          }

          captureException(error, { data: { id } });
          throw new DatabaseOperationError("Failed to delete parent", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Adds a member to a parent.
   *
   * @param parentId The ID of the parent.
   * @param memberId The ID of the member.
   * @param isPrimary Whether the parent is the primary parent.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {ParentAlreadyLinkedToMemberError} If the parent is already linked to the member.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async addMemberToParent(
    parentId: number,
    memberId: number,
    isPrimary: boolean,
  ): Promise<void> {
    return await startSpan(
      { name: "ParentsRepository > addMemberToParent" },
      async () => {
        try {
          const parentExists = await this.getParent(parentId);

          if (!parentExists) {
            throw new ParentNotFoundError("Parent not found");
          }

          const memberExists = await this.membersRepository.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const query = db.insert(membersParents).values({
            parentId,
            memberId,
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
              { cause: error },
            );
          }

          captureException(error, { data: { parentId, memberId } });
          throw new DatabaseOperationError("Failed to add member to parent", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Removes a member from a parent.
   *
   * @param parentId The ID of the parent.
   * @param memberId The ID of the member.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async removeMemberFromParent(
    parentId: number,
    memberId: number,
  ): Promise<void> {
    return await startSpan(
      { name: "ParentsRepository > removeMemberFromParent" },
      async () => {
        try {
          const parentExists = await this.getParent(parentId);

          if (!parentExists) {
            throw new ParentNotFoundError("Parent not found");
          }

          const memberExists = await this.membersRepository.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const query = db
            .delete(membersParents)
            .where(
              and(
                eq(membersParents.parentId, parentId),
                eq(membersParents.memberId, memberId),
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

          captureException(error, { data: { parentId, memberId } });
          throw new DatabaseOperationError(
            "Failed to remove member from parent",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets parents associated with a member.
   *
   * @param memberId The ID of the member.
   * @returns An array of parents associated with the member.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getParentsForMember(memberId: number): Promise<Parent[]> {
    return await startSpan(
      { name: "ParentsRepository > getParentsForMember" },
      async () => {
        try {
          const memberExists = await this.membersRepository.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const query = db.query.membersParents.findMany({
            where: eq(membersParents.memberId, memberId),
            with: {
              parent: true,
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

          return memberParentLinks.map((link) => this.mapToEntity(link.parent));
        } catch (error) {
          if (error instanceof MemberNotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError("Failed to get parents for member", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets the primary parent associated with a member.
   *
   * @param memberId The ID of the member.
   * @returns The primary parent associated with the member if found, undefined otherwise.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getPrimaryParentForMember(
    memberId: number,
  ): Promise<Parent | undefined> {
    return await startSpan(
      { name: "ParentsRepository > getPrimaryParentForMember" },
      async () => {
        try {
          const memberExists = await this.membersRepository.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const query = db.query.membersParents.findFirst({
            where: and(
              eq(membersParents.memberId, memberId),
              eq(membersParents.isPrimary, true),
            ),
            with: {
              parent: true,
            },
          });

          const primaryParentLink = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!primaryParentLink) {
            return undefined;
          }

          return this.mapToEntity(primaryParentLink.parent);
        } catch (error) {
          if (error instanceof MemberNotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError(
            "Failed to get primary parent for member",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
