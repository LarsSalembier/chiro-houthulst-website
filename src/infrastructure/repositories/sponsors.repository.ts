import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { type ISponsorsRepository } from "~/application/repositories/sponsors.repository.interface";
import { db } from "~/server/db";
import { sponsors as sponsorsTable } from "~/server/db/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  SponsorAlreadyExistsError,
  SponsorNotFoundError,
  SponsorStillReferencedError,
} from "~/domain/errors/sponsors";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";
import {
  type SponsorUpdate,
  type Sponsor,
  type SponsorInsert,
} from "~/domain/entities/sponsor";
import { type IAddressesRepository } from "~/application/repositories/addresses.repository.interface";
import { AddressNotFoundError } from "~/domain/errors/addresses";

@injectable()
export class SponsorsRepository implements ISponsorsRepository {
  constructor(private readonly addressRepository: IAddressesRepository) {}

  private mapToEntity(dbSponsor: typeof sponsorsTable.$inferSelect): Sponsor {
    return {
      ...dbSponsor,
      companyOwnerName:
        dbSponsor.companyOwnerFirstName && dbSponsor.companyOwnerLastName
          ? {
              firstName: dbSponsor.companyOwnerFirstName,
              lastName: dbSponsor.companyOwnerLastName,
            }
          : null,
    };
  }

  private mapToDbFieldsPartial(
    sponsor: SponsorUpdate | SponsorInsert,
  ): Partial<typeof sponsorsTable.$inferSelect> {
    return {
      ...sponsor,
      companyOwnerFirstName: sponsor.companyOwnerName?.firstName,
      companyOwnerLastName: sponsor.companyOwnerName?.lastName,
    };
  }

  private mapToDbFields(
    sponsor: SponsorInsert,
  ): typeof sponsorsTable.$inferSelect {
    return this.mapToDbFieldsPartial(
      sponsor,
    ) as typeof sponsorsTable.$inferSelect;
  }

  /**
   * Creates a new sponsor.
   *
   * @param sponsor The sponsor data to insert.
   * @returns The created sponsor.
   * @throws {SponsorAlreadyExistsError} If a sponsor with the same company name already exists.
   * @throws {AddressNotFoundError} If the address ID is provided and the address is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createSponsor(sponsor: Sponsor): Promise<Sponsor> {
    return await startSpan(
      { name: "SponsorsRepository > createSponsor" },
      async () => {
        try {
          if (sponsor.addressId) {
            const address = await this.addressRepository.getAddressById(
              sponsor.addressId,
            );

            if (!address) {
              throw new AddressNotFoundError("Address not found");
            }
          }

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
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new SponsorAlreadyExistsError(
              `Sponsor with company name ${sponsor.companyName} already exists`,
              { cause: error },
            );
          }

          captureException(error, { data: sponsor });
          throw new DatabaseOperationError("Failed to create sponsor", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets a sponsor by ID.
   *
   * @param id The ID of the sponsor.
   * @returns The sponsor if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getSponsor(id: number): Promise<Sponsor | undefined> {
    return await startSpan(
      { name: "SponsorsRepository > getSponsor" },
      async () => {
        try {
          const query = db.query.sponsors.findFirst({
            where: eq(sponsorsTable.id, id),
          });

          const dbSponsor = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbSponsor) {
            return undefined;
          }

          return this.mapToEntity(dbSponsor);
        } catch (error) {
          captureException(error, { data: { id } });
          throw new DatabaseOperationError("Failed to get sponsor", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets a sponsor by company name.
   *
   * @param companyName The company name of the sponsor.
   * @returns The sponsor if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getSponsorByCompanyName(
    companyName: string,
  ): Promise<Sponsor | undefined> {
    return await startSpan(
      { name: "SponsorsRepository > getSponsor" },
      async () => {
        try {
          const query = db.query.sponsors.findFirst({
            where: eq(sponsorsTable.companyName, companyName),
          });

          const dbSponsor = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbSponsor) {
            return undefined;
          }

          return this.mapToEntity(dbSponsor);
        } catch (error) {
          captureException(error, { data: { companyName } });
          throw new DatabaseOperationError("Failed to get sponsor", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets all sponsors.
   *
   * @returns All sponsors.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getSponsors(): Promise<Sponsor[]> {
    return await startSpan(
      { name: "SponsorsRepository > getSponsors" },
      async () => {
        try {
          const query = db.query.sponsors.findMany();

          const dbSponsors = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return dbSponsors.map((sponsor) => this.mapToEntity(sponsor));
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get sponsors", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Updates a sponsor.
   *
   * @param id The ID of the sponsor to update.
   * @param sponsor The sponsor data to update.
   * @returns The updated sponsor.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   * @throws {AddressNotFoundError} If a new address ID is provided and the address is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateSponsor(id: number, sponsor: SponsorUpdate): Promise<Sponsor> {
    return await startSpan(
      { name: "SponsorsRepository > updateSponsor" },
      async () => {
        try {
          if (sponsor.addressId) {
            const address = await this.addressRepository.getAddressById(
              sponsor.addressId,
            );

            if (!address) {
              throw new AddressNotFoundError("Address not found");
            }
          }

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
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { id, sponsor } });
          throw new DatabaseOperationError("Failed to update sponsor", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Deletes a sponsor.
   *
   * @param id The ID of the sponsor to delete.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   * @throws {SponsorStillReferencedError} If the sponsor is still referenced by sponsorship agreements.
   * @throws {DatabaseOperationError} If the operation fails.
   */
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
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (isDatabaseError(error)) {
            if (error.code === PostgresErrorCode.ForeignKeyViolation) {
              throw new SponsorStillReferencedError(
                "Sponsor is still referenced by sponsorship agreements",
                { cause: error },
              );
            }

            captureException(error, { data: { id } });
            throw new DatabaseOperationError("Failed to delete sponsor", {
              cause: error,
            });
          }
        }
      },
    );
  }
}
