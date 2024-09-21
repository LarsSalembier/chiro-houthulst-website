import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { type IEmergencyContactsRepository } from "~/application/repositories/emergency-contacts.repository.interface";
import {
  type EmergencyContactUpdate,
  type EmergencyContact,
  type EmergencyContactInsert,
} from "~/domain/entities/emergency-contact";
import { db } from "drizzle";
import { emergencyContacts } from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  EmergencyContactNotFoundError,
  MemberAlreadyHasEmergencyContactError,
} from "~/domain/errors/emergency-contacts";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";

@injectable()
export class EmergencyContactsRepository
  implements IEmergencyContactsRepository
{
  private mapSponsorsToEntity(
    emergencyContact: typeof emergencyContacts.$inferSelect,
  ): EmergencyContact {
    return {
      ...emergencyContact,
      name: {
        firstName: emergencyContact.firstName,
        lastName: emergencyContact.lastName,
      },
    };
  }

  private mapToDbFieldsPartial(
    emergencyContact: EmergencyContactInsert | EmergencyContactUpdate,
  ): Partial<typeof emergencyContacts.$inferInsert> {
    return {
      ...emergencyContact,
      firstName: emergencyContact.name?.firstName,
      lastName: emergencyContact.name?.lastName,
    };
  }

  private mapToDbFields(
    emergencyContact: EmergencyContactInsert,
  ): typeof emergencyContacts.$inferInsert {
    return this.mapToDbFieldsPartial(
      emergencyContact,
    ) as typeof emergencyContacts.$inferInsert;
  }

  /**
   * Creates a new emergency contact for a member.
   *
   * @param emergencyContact The emergency contact data to insert.
   * @returns The created emergency contact.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberAlreadyHasEmergencyContactError} If the member already has an emergency contact.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createEmergencyContact(
    emergencyContact: EmergencyContactInsert,
  ): Promise<EmergencyContact> {
    return await startSpan(
      { name: "EmergencyContactsRepository > createEmergencyContact" },
      async () => {
        try {
          const query = db
            .insert(emergencyContacts)
            .values(this.mapToDbFields(emergencyContact))
            .returning();

          const [createdEmergencyContact] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdEmergencyContact) {
            throw new DatabaseOperationError(
              "Failed to create emergency contact",
            );
          }

          return this.mapSponsorsToEntity(createdEmergencyContact);
        } catch (error) {
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new MemberAlreadyHasEmergencyContactError(
              "Member already has an emergency contact",
              { cause: error },
            );
          }

          captureException(error, { data: emergencyContact });
          throw new DatabaseOperationError(
            "Failed to create emergency contact",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets an emergency contact by its member ID.
   *
   * @param memberId The ID of the member whose emergency contact to retrieve.
   * @returns The emergency contact if found, undefined otherwise.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getEmergencyContact(
    memberId: number,
  ): Promise<EmergencyContact | undefined> {
    return await startSpan(
      { name: "EmergencyContactsRepository > getEmergencyContact" },
      async () => {
        try {
          const query = db.query.emergencyContacts.findFirst({
            where: eq(emergencyContacts.memberId, memberId),
          });

          const emergencyContact = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!emergencyContact) {
            return undefined;
          }

          return this.mapSponsorsToEntity(emergencyContact);
        } catch (error) {
          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError("Failed to get emergency contact", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Updates an existing emergency contact.
   *
   * @param memberId The ID of the member whose emergency contact to update.
   * @param emergencyContact The updated emergency contact data.
   * @returns The updated emergency contact.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {EmergencyContactNotFoundError} If the emergency contact is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateEmergencyContact(
    memberId: number,
    emergencyContact: EmergencyContactUpdate,
  ): Promise<EmergencyContact> {
    return await startSpan(
      { name: "EmergencyContactsRepository > updateEmergencyContact" },
      async () => {
        try {
          const query = db
            .update(emergencyContacts)
            .set(this.mapToDbFieldsPartial(emergencyContact))
            .where(eq(emergencyContacts.memberId, memberId))
            .returning();

          const [updatedEmergencyContact] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedEmergencyContact) {
            throw new EmergencyContactNotFoundError(
              "Emergency contact not found",
            );
          }

          return this.mapSponsorsToEntity(updatedEmergencyContact);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId, emergencyContact } });
          throw new DatabaseOperationError(
            "Failed to update emergency contact",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Deletes an emergency contact by its member ID.
   *
   * @param memberId The ID of the member whose emergency contact to delete.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {EmergencyContactNotFoundError} If the emergency contact is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteEmergencyContact(memberId: number): Promise<void> {
    return await startSpan(
      { name: "EmergencyContactsRepository > deleteEmergencyContact" },
      async () => {
        try {
          const query = db
            .delete(emergencyContacts)
            .where(eq(emergencyContacts.memberId, memberId))
            .returning();

          const [deletedEmergencyContact] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedEmergencyContact) {
            throw new EmergencyContactNotFoundError(
              "Emergency contact not found",
            );
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError(
            "Failed to delete emergency contact",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
