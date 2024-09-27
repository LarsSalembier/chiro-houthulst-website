import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { ISponsorsRepository } from "~/application/repositories/sponsors.repository.interface";
import {
  Sponsor,
  SponsorInsert,
  SponsorUpdate,
} from "~/domain/entities/sponsor";
import { DatabaseOperationError } from "~/domain/errors/common";
import { db } from "drizzle";
import {
  sponsors as sponsorsTable,
  UNIQUE_COMPANY_NAME_FOR_SPONSOR_CONSTRAINT,
} from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  SponsorNotFoundError,
  SponsorStillReferencedError,
  SponsorWithThatCompanyNameAlreadyExistsError,
} from "~/domain/errors/sponsors";
import { AddressNotFoundError } from "~/domain/errors/addresses";

@injectable()
export class SponsorsRepository implements ISponsorsRepository {
  private mapToEntity(sponsor: typeof sponsorsTable.$inferSelect): Sponsor {
    return {
      ...sponsor,
      companyOwnerName:
        sponsor.companyOwnerFirstName !== null &&
        sponsor.companyOwnerLastName !== null
          ? {
              firstName: sponsor.companyOwnerFirstName,
              lastName: sponsor.companyOwnerLastName,
            }
          : null,
    };
  }

  private mapToDbFieldsPartial(
    sponsor: SponsorInsert | SponsorUpdate,
  ): Partial<typeof sponsorsTable.$inferInsert> {
    return {
      ...sponsor,
      companyOwnerFirstName: sponsor.companyOwnerName?.firstName,
      companyOwnerLastName: sponsor.companyOwnerName?.lastName,
    };
  }

  private mapToDbFields(
    sponsor: SponsorInsert,
  ): typeof sponsorsTable.$inferInsert {
    return this.mapToDbFieldsPartial(
      sponsor,
    ) as typeof sponsorsTable.$inferInsert;
  }

  async createSponsor(sponsor: SponsorInsert): Promise<Sponsor> {
    return await startSpan(
      { name: "SponsorsRepository > createSponsor" },
      async () => {
        try {
          const query = db
            .insert(sponsorsTable)
            .values(this.mapToDbFields(sponsor))
            .returning();

          const [createdSponsor] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdSponsor) {
            throw new DatabaseOperationError("Failed to create sponsor");
          }

          return this.mapToEntity(createdSponsor);
        } catch (error) {
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation &&
            error.constraint === UNIQUE_COMPANY_NAME_FOR_SPONSOR_CONSTRAINT
          ) {
            throw new SponsorWithThatCompanyNameAlreadyExistsError(
              "A sponsor with that company name already exists",
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

          captureException(error, { data: sponsor });
          throw new DatabaseOperationError("Failed to create sponsor", {
            cause: error,
          });
        }
      },
    );
  }

  async getSponsorById(id: number): Promise<Sponsor | undefined> {
    return await startSpan(
      { name: "SponsorsRepository > getSponsorById" },
      async () => {
        try {
          const query = db.query.sponsors.findFirst({
            where: eq(sponsorsTable.id, id),
          });

          const sponsor = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return sponsor ? this.mapToEntity(sponsor) : undefined;
        } catch (error) {
          captureException(error, { data: { sponsorId: id } });
          throw new DatabaseOperationError("Failed to get sponsor", {
            cause: error,
          });
        }
      },
    );
  }

  async getSponsorByCompanyName(
    companyName: string,
  ): Promise<Sponsor | undefined> {
    return await startSpan(
      { name: "SponsorsRepository > getSponsorByCompanyName" },
      async () => {
        try {
          const query = db.query.sponsors.findFirst({
            where: eq(sponsorsTable.companyName, companyName),
          });

          const sponsor = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return sponsor ? this.mapToEntity(sponsor) : undefined;
        } catch (error) {
          captureException(error, { data: { companyName } });
          throw new DatabaseOperationError("Failed to get sponsor", {
            cause: error,
          });
        }
      },
    );
  }

  async getAllSponsors(): Promise<Sponsor[]> {
    return await startSpan(
      { name: "SponsorsRepository > getAllSponsors" },
      async () => {
        try {
          const query = db.query.sponsors.findMany();

          const allSponsors = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allSponsors.map((sponsor) => this.mapToEntity(sponsor));
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get all sponsors", {
            cause: error,
          });
        }
      },
    );
  }

  async updateSponsor(id: number, sponsor: SponsorUpdate): Promise<Sponsor> {
    return await startSpan(
      { name: "SponsorsRepository > updateSponsor" },
      async () => {
        try {
          const query = db
            .update(sponsorsTable)
            .set(this.mapToDbFieldsPartial(sponsor))
            .where(eq(sponsorsTable.id, id))
            .returning();

          const [updatedSponsor] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedSponsor) {
            throw new SponsorNotFoundError("Sponsor not found");
          }

          return this.mapToEntity(updatedSponsor);
        } catch (error) {
          if (error instanceof SponsorNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation &&
            error.constraint === UNIQUE_COMPANY_NAME_FOR_SPONSOR_CONSTRAINT
          ) {
            throw new SponsorWithThatCompanyNameAlreadyExistsError(
              "A sponsor with that company name already exists",
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

          captureException(error, { data: { sponsorId: id, sponsor } });
          throw new DatabaseOperationError("Failed to update sponsor", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteSponsor(id: number): Promise<void> {
    return await startSpan(
      { name: "SponsorsRepository > deleteSponsor" },
      async () => {
        try {
          const query = db
            .delete(sponsorsTable)
            .where(eq(sponsorsTable.id, id))
            .returning();

          const [deletedSponsor] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedSponsor) {
            throw new SponsorNotFoundError("Sponsor not found");
          }
        } catch (error) {
          if (error instanceof SponsorNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new SponsorStillReferencedError("Sponsor still referenced", {
              cause: error,
            });
          }

          captureException(error, { data: { sponsorId: id } });
          throw new DatabaseOperationError("Failed to delete sponsor", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteAllSponsors(): Promise<void> {
    return await startSpan(
      { name: "SponsorsRepository > deleteAllSponsors" },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(sponsorsTable).returning();

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
            throw new SponsorStillReferencedError("Sponsor still referenced", {
              cause: error,
            });
          }

          captureException(error);
          throw new DatabaseOperationError("Failed to delete all sponsors", {
            cause: error,
          });
        }
      },
    );
  }
}
