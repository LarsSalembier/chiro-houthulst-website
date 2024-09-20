import { captureException, startSpan } from "@sentry/nextjs";
import { eq, and } from "drizzle-orm";
import { injectable } from "inversify";
import { type ISponsorshipAgreementsRepository } from "~/application/repositories/sponsorship-agreements.repository.interface";
import {
  type SponsorshipAgreementUpdate,
  type SponsorshipAgreement,
  type SponsorshipAgreementInsert,
} from "~/domain/entities/sponsorship-agreement";
import { db } from "drizzle";
import { sponsorshipAgreements as sponsorshipAgreementsTable } from "drizzle/schema";
import {
  SponsorshipAgreementAlreadyExistsError,
  SponsorshipAgreementNotFoundError,
} from "~/domain/errors/sponsorship-agreements";
import { WorkyearNotFoundError } from "~/domain/errors/workyears";
import { SponsorNotFoundError } from "~/domain/errors/sponsors";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";
import { type ISponsorsRepository } from "~/application/repositories/sponsors.repository.interface";
import { type IWorkyearsRepository } from "~/application/repositories/workyears.repository.interface";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";

@injectable()
export class SponsorshipAgreementsRepository
  implements ISponsorshipAgreementsRepository
{
  constructor(
    private readonly sponsorsRepository: ISponsorsRepository,
    private readonly workyearsRepository: IWorkyearsRepository,
  ) {}

  /**
   * Creates a new sponsorship agreement.
   *
   * @param sponsorshipAgreement The sponsorship agreement data to insert.
   * @returns The created sponsorship agreement.
   * @throws {SponsorshipAgreementAlreadyExistsError} If the agreement already exists.
   * @throws {SponsorNotFoundError} If the sponsor does not exist.
   * @throws {WorkyearNotFoundError} If the work year does not exist.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createSponsorshipAgreement(
    sponsorshipAgreement: SponsorshipAgreementInsert,
  ): Promise<SponsorshipAgreement> {
    return await startSpan(
      { name: "SponsorshipAgreementsRepository > createSponsorshipAgreement" },
      async () => {
        try {
          const sponsorExists = await this.sponsorsRepository.getSponsor(
            sponsorshipAgreement.sponsorId,
          );

          if (!sponsorExists) {
            throw new SponsorNotFoundError("Sponsor not found");
          }

          const workYearExists = await this.workyearsRepository.getWorkyear(
            sponsorshipAgreement.workYearId,
          );

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Work year not found");
          }

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
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new SponsorshipAgreementAlreadyExistsError(
              "Sponsorship agreement already exists",
              { cause: error },
            );
          }

          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: sponsorshipAgreement });
          throw new DatabaseOperationError(
            "Failed to create sponsorship agreement",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets a sponsorship agreement by sponsor ID and work year ID.
   *
   * @param sponsorId The ID of the sponsor.
   * @param workYearId The ID of the work year.
   * @returns The sponsorship agreement if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<SponsorshipAgreement | undefined> {
    return await startSpan(
      { name: "SponsorshipAgreementsRepository > getSponsorshipAgreement" },
      async () => {
        try {
          const query = db.query.sponsorshipAgreements.findFirst({
            where: and(
              eq(sponsorshipAgreementsTable.sponsorId, sponsorId),
              eq(sponsorshipAgreementsTable.workYearId, workYearId),
            ),
          });

          const dbSponsorshipAgreement = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbSponsorshipAgreement) {
            return undefined;
          }

          return dbSponsorshipAgreement;
        } catch (error) {
          captureException(error, { data: { sponsorId, workYearId } });
          throw new DatabaseOperationError(
            "Failed to get sponsorship agreement",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets all sponsorship agreements.
   *
   * @returns An array of sponsorship agreements.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getSponsorshipAgreements(): Promise<SponsorshipAgreement[]> {
    return await startSpan(
      { name: "SponsorshipAgreementsRepository > getSponsorshipAgreements" },
      async () => {
        try {
          const query = db.query.sponsorshipAgreements.findMany();

          const dbSponsorshipAgreements = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return dbSponsorshipAgreements;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError(
            "Failed to get sponsorship agreements",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets sponsorship agreements for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of sponsorship agreements.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > getSponsorshipAgreementsForWorkYear",
      },
      async () => {
        try {
          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Work year not found");
          }

          const query = db.query.sponsorshipAgreements.findMany({
            where: eq(sponsorshipAgreementsTable.workYearId, workYearId),
          });

          const dbSponsorshipAgreements = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return dbSponsorshipAgreements;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { workYearId } });
          throw new DatabaseOperationError(
            "Failed to get sponsorship agreements for work year",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets sponsorship agreements for a specific sponsor.
   *
   * @param sponsorId The ID of the sponsor.
   * @returns An array of sponsorship agreements.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getSponsorshipAgreementsForSponsor(
    sponsorId: number,
  ): Promise<SponsorshipAgreement[]> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > getSponsorshipAgreementsForSponsor",
      },
      async () => {
        try {
          const sponsorExists =
            await this.sponsorsRepository.getSponsor(sponsorId);

          if (!sponsorExists) {
            throw new SponsorNotFoundError("Sponsor not found");
          }

          const query = db.query.sponsorshipAgreements.findMany({
            where: eq(sponsorshipAgreementsTable.sponsorId, sponsorId),
          });

          const dbSponsorshipAgreements = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return dbSponsorshipAgreements;
        } catch (error) {
          if (error instanceof SponsorNotFoundError) {
            throw error;
          }

          captureException(error, { data: { sponsorId } });
          throw new DatabaseOperationError(
            "Failed to get sponsorship agreements for sponsor",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Updates a sponsorship agreement.
   *
   * @param sponsorId The ID of the sponsor.
   * @param workYearId The ID of the work year.
   * @param input The data to update.
   * @returns The updated sponsorship agreement.
   * @throws {SponsorshipAgreementNotFoundError} If the agreement is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
    input: SponsorshipAgreementUpdate,
  ): Promise<SponsorshipAgreement> {
    return await startSpan(
      { name: "SponsorshipAgreementsRepository > updateSponsorshipAgreement" },
      async () => {
        try {
          const query = db
            .update(sponsorshipAgreementsTable)
            .set(input)
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
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { sponsorId, workYearId } });
          throw new DatabaseOperationError(
            "Failed to update sponsorship agreement",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Deletes a sponsorship agreement.
   *
   * @param sponsorId The ID of the sponsor.
   * @param workYearId The ID of the work year.
   * @throws {SponsorshipAgreementNotFoundError} If the agreement is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<void> {
    return await startSpan(
      { name: "SponsorshipAgreementsRepository > deleteSponsorshipAgreement" },
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

          const [deletedAgreement] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedAgreement) {
            throw new SponsorshipAgreementNotFoundError(
              "Sponsorship agreement not found",
            );
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { sponsorId, workYearId } });
          throw new DatabaseOperationError(
            "Failed to delete sponsorship agreement",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets unpaid sponsorship agreements for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of unpaid sponsorship agreements.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getUnpaidSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > getUnpaidSponsorshipAgreementsForWorkYear",
      },
      async () => {
        try {
          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Work year not found");
          }

          const query = db.query.sponsorshipAgreements.findMany({
            where: and(
              eq(sponsorshipAgreementsTable.workYearId, workYearId),
              eq(sponsorshipAgreementsTable.paymentReceived, false),
            ),
          });

          const dbSponsorshipAgreements = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return dbSponsorshipAgreements;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { workYearId } });
          throw new DatabaseOperationError(
            "Failed to get unpaid sponsorship agreements for work year",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets paid sponsorship agreements for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of paid sponsorship agreements.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getPaidSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]> {
    return await startSpan(
      {
        name: "SponsorshipAgreementsRepository > getPaidSponsorshipAgreementsForWorkYear",
      },
      async () => {
        try {
          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Work year not found");
          }

          const query = db.query.sponsorshipAgreements.findMany({
            where: and(
              eq(sponsorshipAgreementsTable.workYearId, workYearId),
              eq(sponsorshipAgreementsTable.paymentReceived, true),
            ),
          });

          const dbSponsorshipAgreements = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return dbSponsorshipAgreements;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { workYearId } });
          throw new DatabaseOperationError(
            "Failed to get paid sponsorship agreements for work year",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
