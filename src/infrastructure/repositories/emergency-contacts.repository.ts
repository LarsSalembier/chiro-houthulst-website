import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { IEmergencyContactsRepository } from "~/application/repositories/emergency-contacts.repository.interface";
import {
  EmergencyContactUpdate,
  EmergencyContact,
  EmergencyContactInsert,
} from "~/domain/entities/emergency-contact";
import { db } from "drizzle";
import { emergencyContacts as emergencyContactsTable } from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  EmergencyContactNotFoundError,
  MemberAlreadyHasEmergencyContactError,
} from "~/domain/errors/emergency-contacts";
import { DatabaseOperationError } from "~/domain/errors/common";
import { MemberNotFoundError } from "~/domain/errors/members";

@injectable()
export class EmergencyContactsRepository
  implements IEmergencyContactsRepository
{
  private mapToEntity(
    emergencyContact: typeof emergencyContactsTable.$inferSelect,
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
  ): Partial<typeof emergencyContactsTable.$inferInsert> {
    return {
      ...emergencyContact,
      firstName: emergencyContact.name?.firstName,
      lastName: emergencyContact.name?.lastName,
    };
  }

  private mapToDbFields(
    emergencyContact: EmergencyContactInsert,
  ): typeof emergencyContactsTable.$inferInsert {
    return this.mapToDbFieldsPartial(
      emergencyContact,
    ) as typeof emergencyContactsTable.$inferInsert;
  }

  async createEmergencyContact(
    emergencyContact: EmergencyContactInsert,
  ): Promise<EmergencyContact> {
    return await startSpan(
      { name: "EmergencyContactsRepository > createEmergencyContact" },
      async () => {
        try {
          const query = db
            .insert(emergencyContactsTable)
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

          return this.mapToEntity(createdEmergencyContact);
        } catch (error) {
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (isDatabaseError(error)) {
            if (error.code === PostgresErrorCode.UniqueViolation) {
              throw new MemberAlreadyHasEmergencyContactError(
                "Member already has an emergency contact",
              );
            }

            if (error.code === PostgresErrorCode.ForeignKeyViolation) {
              throw new MemberNotFoundError("Member not found");
            }
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

  async getEmergencyContactByMemberId(
    memberId: number,
  ): Promise<EmergencyContact | undefined> {
    return await startSpan(
      {
        name: "EmergencyContactsRepository > getEmergencyContactByMemberId",
      },
      async () => {
        try {
          const query = db.query.emergencyContacts.findFirst({
            where: eq(emergencyContactsTable.memberId, memberId),
          });

          const emergencyContact = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return emergencyContact
            ? this.mapToEntity(emergencyContact)
            : undefined;
        } catch (error) {
          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError("Failed to get emergency contact", {
            cause: error,
          });
        }
      },
    );
  }

  async getAllEmergencyContacts(): Promise<EmergencyContact[]> {
    return await startSpan(
      { name: "EmergencyContactsRepository > getAllEmergencyContacts" },
      async () => {
        try {
          const query = db.query.emergencyContacts.findMany();

          const allEmergencyContacts = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allEmergencyContacts.map((emergencyContact) =>
            this.mapToEntity(emergencyContact),
          );
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError(
            "Failed to get all emergency contacts",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  async updateEmergencyContact(
    memberId: number,
    emergencyContact: EmergencyContactUpdate,
  ): Promise<EmergencyContact> {
    return await startSpan(
      { name: "EmergencyContactsRepository > updateEmergencyContact" },
      async () => {
        try {
          const query = db
            .update(emergencyContactsTable)
            .set(this.mapToDbFieldsPartial(emergencyContact))
            .where(eq(emergencyContactsTable.memberId, memberId))
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

          return this.mapToEntity(updatedEmergencyContact);
        } catch (error) {
          if (error instanceof EmergencyContactNotFoundError) {
            throw error;
          }

          captureException(error, {
            data: { memberId, emergencyContact },
          });
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

  async deleteEmergencyContact(memberId: number): Promise<void> {
    return await startSpan(
      { name: "EmergencyContactsRepository > deleteEmergencyContact" },
      async () => {
        try {
          const query = db
            .delete(emergencyContactsTable)
            .where(eq(emergencyContactsTable.memberId, memberId))
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
          if (error instanceof EmergencyContactNotFoundError) {
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

  async deleteAllEmergencyContacts(): Promise<void> {
    return await startSpan(
      {
        name: "EmergencyContactsRepository > deleteAllEmergencyContacts",
      },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(emergencyContactsTable).returning();

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
            "Failed to delete all emergency contacts",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
