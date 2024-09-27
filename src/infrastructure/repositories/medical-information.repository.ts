import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { IMedicalInformationRepository } from "~/application/repositories/medical-information.repository.interface";
import {
  MedicalInformationUpdate,
  MedicalInformation,
  MedicalInformationInsert,
} from "~/domain/entities/medical-information";
import { db } from "drizzle";
import { medicalInformation as medicalInformationTable } from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  MedicalInformationNotFoundError,
  MemberAlreadyHasMedicalInformationError,
} from "~/domain/errors/medical-information";
import { DatabaseOperationError } from "~/domain/errors/common";
import { MemberNotFoundError } from "~/domain/errors/members";

@injectable()
export class MedicalInformationRepository
  implements IMedicalInformationRepository
{
  private mapToEntity(
    medicalInformation: typeof medicalInformationTable.$inferSelect,
  ): MedicalInformation {
    return {
      ...medicalInformation,
      asthma: {
        hasCondition: medicalInformation.asthma,
        info: medicalInformation.asthmaInformation,
      },
      bedwetting: {
        hasCondition: medicalInformation.bedwetting,
        info: medicalInformation.bedwettingInformation,
      },
      epilepsy: {
        hasCondition: medicalInformation.epilepsy,
        info: medicalInformation.epilepsyInformation,
      },
      heartCondition: {
        hasCondition: medicalInformation.heartCondition,
        info: medicalInformation.heartConditionInformation,
      },
      hayFever: {
        hasCondition: medicalInformation.hayFever,
        info: medicalInformation.hayFeverInformation,
      },
      skinCondition: {
        hasCondition: medicalInformation.skinCondition,
        info: medicalInformation.skinConditionInformation,
      },
      rheumatism: {
        hasCondition: medicalInformation.rheumatism,
        info: medicalInformation.rheumatismInformation,
      },
      sleepwalking: {
        hasCondition: medicalInformation.sleepwalking,
        info: medicalInformation.sleepwalkingInformation,
      },
      diabetes: {
        hasCondition: medicalInformation.diabetes,
        info: medicalInformation.diabetesInformation,
      },
      doctor: {
        name: {
          firstName: medicalInformation.doctorFirstName,
          lastName: medicalInformation.doctorLastName,
        },
        phoneNumber: medicalInformation.doctorPhoneNumber,
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

  async createMedicalInformation(
    medicalInformation: MedicalInformationInsert,
  ): Promise<MedicalInformation> {
    return await startSpan(
      {
        name: "MedicalInformationRepository > createMedicalInformation",
      },
      async () => {
        try {
          const query = db
            .insert(medicalInformationTable)
            .values(this.mapToDbFields(medicalInformation))
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
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (isDatabaseError(error)) {
            if (error.code === PostgresErrorCode.UniqueViolation) {
              throw new MemberAlreadyHasMedicalInformationError(
                "Member already has medical information",
              );
            }

            if (error.code === PostgresErrorCode.ForeignKeyViolation) {
              throw new MemberNotFoundError("Member not found");
            }
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

  async getMedicalInformationByMemberId(
    memberId: number,
  ): Promise<MedicalInformation | undefined> {
    return await startSpan(
      {
        name: "MedicalInformationRepository > getMedicalInformationByMemberId",
      },
      async () => {
        try {
          const query = db.query.medicalInformation.findFirst({
            where: eq(medicalInformationTable.memberId, memberId),
          });

          const foundMedicalInformation = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return foundMedicalInformation
            ? this.mapToEntity(foundMedicalInformation)
            : undefined;
        } catch (error) {
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

  async getAllMedicalInformation(): Promise<MedicalInformation[]> {
    return await startSpan(
      {
        name: "MedicalInformationRepository > getAllMedicalInformation",
      },
      async () => {
        try {
          const query = db.query.medicalInformation.findMany();

          const allMedicalInformation = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allMedicalInformation.map((medicalInformation) =>
            this.mapToEntity(medicalInformation),
          );
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError(
            "Failed to get all medical information",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  async updateMedicalInformation(
    memberId: number,
    medicalInformation: MedicalInformationUpdate,
  ): Promise<MedicalInformation> {
    return await startSpan(
      {
        name: "MedicalInformationRepository > updateMedicalInformation",
      },
      async () => {
        try {
          const query = db
            .update(medicalInformationTable)
            .set(this.mapToDbFieldsPartial(medicalInformation))
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
          if (error instanceof MedicalInformationNotFoundError) {
            throw error;
          }

          captureException(error, {
            data: { memberId, medicalInformation },
          });
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

  async deleteMedicalInformation(memberId: number): Promise<void> {
    return await startSpan(
      {
        name: "MedicalInformationRepository > deleteMedicalInformation",
      },
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
          if (error instanceof MedicalInformationNotFoundError) {
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

  async deleteAllMedicalInformation(): Promise<void> {
    return await startSpan(
      {
        name: "MedicalInformationRepository > deleteAllMedicalInformation",
      },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(medicalInformationTable).returning();

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
            "Failed to delete all medical information",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
