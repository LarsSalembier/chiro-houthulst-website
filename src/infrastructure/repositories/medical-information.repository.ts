import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { type IMedicalInformationRepository } from "~/application/repositories/medical-information.repository.interface";
import {
  type MedicalInformationUpdate,
  type MedicalInformation,
  type MedicalInformationInsert,
} from "~/domain/entities/medical-information";
import { db } from "drizzle";
import { medicalInformation as medicalInformationTable } from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  MedicalInformationNotFoundError,
  MemberAlreadyHasMedicalInformationError,
} from "~/domain/errors/medical-information";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";

@injectable()
export class MedicalInformationRepository
  implements IMedicalInformationRepository
{
  private mapToEntity(
    dbMedicalInfo: typeof medicalInformationTable.$inferSelect,
  ): MedicalInformation {
    return {
      ...dbMedicalInfo,
      asthma: {
        hasCondition: dbMedicalInfo.asthma,
        info: dbMedicalInfo.asthmaInformation,
      },
      bedwetting: {
        hasCondition: dbMedicalInfo.bedwetting,
        info: dbMedicalInfo.bedwettingInformation,
      },
      epilepsy: {
        hasCondition: dbMedicalInfo.epilepsy,
        info: dbMedicalInfo.epilepsyInformation,
      },
      heartCondition: {
        hasCondition: dbMedicalInfo.heartCondition,
        info: dbMedicalInfo.heartConditionInformation,
      },
      hayFever: {
        hasCondition: dbMedicalInfo.hayFever,
        info: dbMedicalInfo.hayFeverInformation,
      },
      skinCondition: {
        hasCondition: dbMedicalInfo.skinCondition,
        info: dbMedicalInfo.skinConditionInformation,
      },
      rheumatism: {
        hasCondition: dbMedicalInfo.rheumatism,
        info: dbMedicalInfo.rheumatismInformation,
      },
      sleepwalking: {
        hasCondition: dbMedicalInfo.sleepwalking,
        info: dbMedicalInfo.sleepwalkingInformation,
      },
      diabetes: {
        hasCondition: dbMedicalInfo.diabetes,
        info: dbMedicalInfo.diabetesInformation,
      },
      doctor: {
        name: {
          firstName: dbMedicalInfo.doctorFirstName,
          lastName: dbMedicalInfo.doctorLastName,
        },
        phoneNumber: dbMedicalInfo.doctorPhoneNumber,
      },
    };
  }

  private mapToDbFieldsPartial(
    medicalInformation: MedicalInformationInsert | MedicalInformationUpdate,
  ): Partial<typeof medicalInformationTable.$inferInsert> {
    return {
      ...medicalInformation,
      asthma: medicalInformation.asthma?.hasCondition,
      asthmaInformation: medicalInformation.asthma?.info,
      bedwetting: medicalInformation.bedwetting?.hasCondition,
      bedwettingInformation: medicalInformation.bedwetting?.info,
      epilepsy: medicalInformation.epilepsy?.hasCondition,
      epilepsyInformation: medicalInformation.epilepsy?.info,
      heartCondition: medicalInformation.heartCondition?.hasCondition,
      heartConditionInformation: medicalInformation.heartCondition?.info,
      hayFever: medicalInformation.hayFever?.hasCondition,
      hayFeverInformation: medicalInformation.hayFever?.info,
      skinCondition: medicalInformation.skinCondition?.hasCondition,
      skinConditionInformation: medicalInformation.skinCondition?.info,
      rheumatism: medicalInformation.rheumatism?.hasCondition,
      rheumatismInformation: medicalInformation.rheumatism?.info,
      sleepwalking: medicalInformation.sleepwalking?.hasCondition,
      sleepwalkingInformation: medicalInformation.sleepwalking?.info,
      diabetes: medicalInformation.diabetes?.hasCondition,
      diabetesInformation: medicalInformation.diabetes?.info,
      doctorFirstName: medicalInformation.doctor?.name?.firstName,
      doctorLastName: medicalInformation.doctor?.name?.lastName,
      doctorPhoneNumber: medicalInformation.doctor?.phoneNumber,
    };
  }

  private mapToDbFields(
    medicalInformation: MedicalInformationInsert,
  ): typeof medicalInformationTable.$inferInsert {
    return this.mapToDbFieldsPartial(
      medicalInformation,
    ) as typeof medicalInformationTable.$inferInsert;
  }

  /**
   * Creates new medical information for a member.
   *
   * @param medicalInformation The medical information data to insert.
   * @returns The created medical information.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberAlreadyHasMedicalInformationError} If the member already has medical information.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createMedicalInformation(
    medicalInformation: MedicalInformationInsert,
  ): Promise<MedicalInformation> {
    return await startSpan(
      { name: "MedicalInformationRepository > createMedicalInformation" },
      async () => {
        try {
          const dbMedicalInformation = this.mapToDbFields(medicalInformation);

          const query = db
            .insert(medicalInformationTable)
            .values(dbMedicalInformation)
            .returning();

          const [createdMedicalInformation] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdMedicalInformation) {
            throw new DatabaseOperationError(
              "Failed to create medical information",
            );
          }

          return this.mapToEntity(createdMedicalInformation);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new MemberAlreadyHasMedicalInformationError(
              "Member already has medical information",
              { cause: error },
            );
          }

          captureException(error, { data: medicalInformation });
          throw new DatabaseOperationError(
            "Failed to create medical information",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets medical information for a member.
   *
   * @param memberId The ID of the member whose medical information to retrieve.
   * @returns The medical information if found, undefined otherwise.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getMedicalInformation(
    memberId: number,
  ): Promise<MedicalInformation | undefined> {
    return await startSpan(
      { name: "MedicalInformationRepository > getMedicalInformation" },
      async () => {
        try {
          const query = db.query.medicalInformation.findFirst({
            where: eq(medicalInformationTable.memberId, memberId),
          });

          const medicalInfo = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!medicalInfo) {
            return undefined;
          }

          return this.mapToEntity(medicalInfo);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError(
            "Failed to get medical information",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Updates an existing medical information for a member.
   *
   * @param memberId The ID of the member whose medical information to update.
   * @param medicalInformation The updated medical information data.
   * @returns The updated medical information.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MedicalInformationNotFoundError} If the medical information is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateMedicalInformation(
    memberId: number,
    medicalInformation: MedicalInformationUpdate,
  ): Promise<MedicalInformation> {
    return await startSpan(
      { name: "MedicalInformationRepository > updateMedicalInformation" },
      async () => {
        try {
          const dbMedicalInformationUpdate =
            this.mapToDbFieldsPartial(medicalInformation);

          dbMedicalInformationUpdate.updatedAt = new Date();

          const query = db
            .update(medicalInformationTable)
            .set(dbMedicalInformationUpdate)
            .where(eq(medicalInformationTable.memberId, memberId))
            .returning();

          const [updatedMedicalInformation] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedMedicalInformation) {
            throw new MedicalInformationNotFoundError(
              "Medical information not found",
            );
          }

          return this.mapToEntity(updatedMedicalInformation);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId, medicalInformation } });
          throw new DatabaseOperationError(
            "Failed to update medical information",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Deletes medical information for a member.
   *
   * @param memberId The ID of the member whose medical information to delete.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MedicalInformationNotFoundError} If the medical information is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteMedicalInformation(memberId: number): Promise<void> {
    return await startSpan(
      { name: "MedicalInformationRepository > deleteMedicalInformation" },
      async () => {
        try {
          const query = db
            .delete(medicalInformationTable)
            .where(eq(medicalInformationTable.memberId, memberId))
            .returning();

          const [deletedMedicalInformation] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedMedicalInformation) {
            throw new MedicalInformationNotFoundError(
              "Medical information not found",
            );
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError(
            "Failed to delete medical information",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
