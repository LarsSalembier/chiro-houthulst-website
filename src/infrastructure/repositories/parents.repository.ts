import { captureException, startSpan } from "@sentry/nextjs";
import { eq, inArray } from "drizzle-orm";
import { injectable } from "inversify";
import { IParentsRepository } from "~/application/repositories/parents.repository.interface";
import { Parent, ParentInsert, ParentUpdate } from "~/domain/entities/parent";
import { db } from "drizzle";
import {
  membersParents as membersParentsTable,
  parents as parentsTable,
  UNIQUE_EMAIL_ADDRESS_FOR_PARENT_CONSTRAINT,
} from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  ParentNotFoundError,
  ParentStillReferencedError,
  ParentWithThatEmailAddressAlreadyExistsError,
} from "~/domain/errors/parents";
import { DatabaseOperationError } from "~/domain/errors/common";
import { AddressNotFoundError } from "~/domain/errors/addresses";

@injectable()
export class ParentsRepository implements IParentsRepository {
  private mapToEntity(parent: typeof parentsTable.$inferSelect): Parent {
    return {
      ...parent,
      name: {
        firstName: parent.firstName,
        lastName: parent.lastName,
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

  async createParent(parent: ParentInsert): Promise<Parent> {
    return await startSpan(
      { name: "ParentsRepository > createParent" },
      async () => {
        try {
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
            error.code === PostgresErrorCode.UniqueViolation &&
            error.constraint === UNIQUE_EMAIL_ADDRESS_FOR_PARENT_CONSTRAINT
          ) {
            throw new ParentWithThatEmailAddressAlreadyExistsError(
              "A parent with that email address already exists",
              { cause: error },
            );
          }
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new AddressNotFoundError("Address not found", {
              cause: error,
            });
          }

          captureException(error, { data: parent });
          throw new DatabaseOperationError("Failed to create parent", {
            cause: error,
          });
        }
      },
    );
  }

  async getParentById(id: number): Promise<Parent | undefined> {
    return await startSpan(
      { name: "ParentsRepository > getParentById" },
      async () => {
        try {
          const query = db.query.parents.findFirst({
            where: eq(parentsTable.id, id),
          });

          const parent = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return parent ? this.mapToEntity(parent) : undefined;
        } catch (error) {
          captureException(error, { data: { parentId: id } });
          throw new DatabaseOperationError("Failed to get parent", {
            cause: error,
          });
        }
      },
    );
  }

  async getParentByEmailAddress(
    emailAddress: string,
  ): Promise<Parent | undefined> {
    return await startSpan(
      { name: "ParentsRepository > getParentByEmailAddress" },
      async () => {
        try {
          const query = db.query.parents.findFirst({
            where: eq(parentsTable.emailAddress, emailAddress),
          });

          const parent = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return parent ? this.mapToEntity(parent) : undefined;
        } catch (error) {
          captureException(error, { data: { emailAddress } });
          throw new DatabaseOperationError("Failed to get parent", {
            cause: error,
          });
        }
      },
    );
  }

  async getAllParents(): Promise<Parent[]> {
    return await startSpan(
      { name: "ParentsRepository > getAllParents" },
      async () => {
        try {
          const query = db.query.parents.findMany();

          const allParents = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allParents.map((parent) => this.mapToEntity(parent));
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get all parents", {
            cause: error,
          });
        }
      },
    );
  }

  async getParentsForMember(memberId: number): Promise<
    {
      parent: Parent;
      isPrimary: boolean;
    }[]
  > {
    return await startSpan(
      { name: "ParentsRepository > getParentsForMember" },
      async () => {
        try {
          const parentMemberRelationshipsQuery =
            db.query.membersParents.findMany({
              where: eq(membersParentsTable.memberId, memberId),
            });

          const parentMemberRelationships = await startSpan(
            {
              name: parentMemberRelationshipsQuery.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => parentMemberRelationshipsQuery.execute(),
          );

          const parentIds = parentMemberRelationships.map(
            (relationship) => relationship.parentId,
          );

          const parentsQuery = db.query.parents.findMany({
            where: inArray(parentsTable.id, parentIds),
          });

          const parents = await startSpan(
            {
              name: parentsQuery.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => parentsQuery.execute(),
          );

          return parentMemberRelationships.map((relationship) => {
            const parent = parents.find(
              (parent) => parent.id === relationship.parentId,
            );

            if (!parent) {
              throw new ParentNotFoundError("Parent not found");
            }

            return {
              parent: this.mapToEntity(parent),
              isPrimary: relationship.isPrimary,
            };
          });
        } catch (error) {
          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError("Failed to get parents for member", {
            cause: error,
          });
        }
      },
    );
  }

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
          if (error instanceof ParentNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation &&
            error.constraint === UNIQUE_EMAIL_ADDRESS_FOR_PARENT_CONSTRAINT
          ) {
            throw new ParentWithThatEmailAddressAlreadyExistsError(
              "A parent with that email address already exists",
              { cause: error },
            );
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new AddressNotFoundError("Address not found", {
              cause: error,
            });
          }

          captureException(error, { data: { parentId: id, parent } });
          throw new DatabaseOperationError("Failed to update parent", {
            cause: error,
          });
        }
      },
    );
  }

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
          if (error instanceof ParentNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new ParentStillReferencedError("Parent still referenced", {
              cause: error,
            });
          }

          captureException(error, { data: { parentId: id } });
          throw new DatabaseOperationError("Failed to delete parent", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteAllParents(): Promise<void> {
    return await startSpan(
      { name: "ParentsRepository > deleteAllParents" },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(parentsTable).returning();

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
            throw new ParentStillReferencedError("Parent still referenced", {
              cause: error,
            });
          }

          captureException(error);
          throw new DatabaseOperationError("Failed to delete all parents", {
            cause: error,
          });
        }
      },
    );
  }
}
