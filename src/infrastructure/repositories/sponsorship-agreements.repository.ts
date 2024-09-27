import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq } from "drizzle-orm";
import { injectable } from "inversify";
import { ISponsorshipAgreementsRepository } from "~/application/repositories/sponsorship-agreements.repository.interface";
import {
  SponsorshipAgreement,
  SponsorshipAgreementInsert,
  SponsorshipAgreementUpdate,
} from "~/domain/entities/sponsorship-agreement";
import { DatabaseOperationError } from "~/domain/errors/common";
import { db } from "drizzle";
import { sponsorshipAgreements as sponsorshipAgreementsTable } from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  SponsorAlreadyHasSponsorshipAgreementForWorkYearError,
  SponsorshipAgreementNotFoundError,
} from "~/domain/errors/sponsorship-agreements";
import { SponsorNotFoundError } from "~/domain/errors/sponsors";
import { WorkYearNotFoundError } from "~/domain/errors/work-years";

@injectable()
export class SponsorshipAgreementsRepository
  implements ISponsorshipAgreementsRepository
{
  async createSponsorshipAgreement(
    sponsorshipAgreement: SponsorshipAgreementInsert,
  ): Promise<SponsorshipAgreement> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > createSponsorshipAgreement",
      },
      async () => {
        try {
          const query = db
            .insert(sponsorshipAgreementsTable)
            .values(sponsorshipAgreement)
            .returning();

          const [createdSponsorshipAgreement] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdSponsorshipAgreement) {
            throw new DatabaseOperationError(
              "Failed to create sponsorship agreement",
            );
          }

          return createdSponsorshipAgreement;
        } catch (error) {
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (isDatabaseError(error)) {
            if (error.code === PostgresErrorCode.UniqueViolation) {
              throw new SponsorAlreadyHasSponsorshipAgreementForWorkYearError(
                "Sponsor already has a sponsorship agreement for this work year",
                { cause: error },
              );
            }

            if (error.code === PostgresErrorCode.ForeignKeyViolation) {
              if (error.column === "sponsor_id") {
                throw new SponsorNotFoundError("Sponsor not found", {
                  cause: error,
                });
              }

              if (error.column === "work_year_id") {
                throw new WorkYearNotFoundError("Work year not found", {
                  cause: error,
                });
              }
            }
          }

          captureException(error, { data: sponsorshipAgreement });
          throw new DatabaseOperationError(
            "Failed to create sponsorship agreement",
            { cause: error },
          );
        }
      },
    );
  }

  async getSponsorshipAgreementByIds(
    sponsorId: number,
    workYearId: number,
  ): Promise<SponsorshipAgreement | undefined> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > getSponsorshipAgreementByIds",
      },
      async () => {
        try {
          const query = db.query.sponsorshipAgreements.findFirst({
            where: and(
              eq(sponsorshipAgreementsTable.sponsorId, sponsorId),
              eq(sponsorshipAgreementsTable.workYearId, workYearId),
            ),
          });

          const sponsorshipAgreement = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return sponsorshipAgreement;
        } catch (error) {
          captureException(error, { data: { sponsorId, workYearId } });
          throw new DatabaseOperationError(
            "Failed to get sponsorship agreement",
            { cause: error },
          );
        }
      },
    );
  }

  async getAllSponsorshipAgreements(): Promise<SponsorshipAgreement[]> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > getAllSponsorshipAgreements",
      },
      async () => {
        try {
          const query = db.query.sponsorshipAgreements.findMany();

          const allSponsorshipAgreements = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allSponsorshipAgreements;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError(
            "Failed to get all sponsorship agreements",
            { cause: error },
          );
        }
      },
    );
  }

  async updateSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
    sponsorshipAgreement: SponsorshipAgreementUpdate,
  ): Promise<SponsorshipAgreement> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > updateSponsorshipAgreement",
      },
      async () => {
        try {
          const query = db
            .update(sponsorshipAgreementsTable)
            .set(sponsorshipAgreement)
            .where(
              and(
                eq(sponsorshipAgreementsTable.sponsorId, sponsorId),
                eq(sponsorshipAgreementsTable.workYearId, workYearId),
              ),
            )
            .returning();

          const [updatedSponsorshipAgreement] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedSponsorshipAgreement) {
            throw new SponsorshipAgreementNotFoundError(
              "Sponsorship agreement not found",
            );
          }

          return updatedSponsorshipAgreement;
        } catch (error) {
          if (error instanceof SponsorshipAgreementNotFoundError) {
            throw error;
          }

          captureException(error, {
            data: { sponsorId, workYearId, sponsorshipAgreement },
          });
          throw new DatabaseOperationError(
            "Failed to update sponsorship agreement",
            { cause: error },
          );
        }
      },
    );
  }

  async deleteSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<void> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > deleteSponsorshipAgreement",
      },
      async () => {
        try {
          const query = db
            .delete(sponsorshipAgreementsTable)
            .where(
              and(
                eq(sponsorshipAgreementsTable.sponsorId, sponsorId),
                eq(sponsorshipAgreementsTable.workYearId, workYearId),
              ),
            )
            .returning();

          const [deletedSponsorshipAgreement] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedSponsorshipAgreement) {
            throw new SponsorshipAgreementNotFoundError(
              "Sponsorship agreement not found",
            );
          }
        } catch (error) {
          if (error instanceof SponsorshipAgreementNotFoundError) {
            throw error;
          }

          captureException(error, { data: { sponsorId, workYearId } });
          throw new DatabaseOperationError(
            "Failed to delete sponsorship agreement",
            { cause: error },
          );
        }
      },
    );
  }

  async deleteAllSponsorshipAgreements(): Promise<void> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > deleteAllSponsorshipAgreements",
      },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(sponsorshipAgreementsTable).returning();

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
            "Failed to delete all sponsorship agreements",
            { cause: error },
          );
        }
      },
    );
  }
}
