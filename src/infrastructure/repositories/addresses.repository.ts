import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq, isNull } from "drizzle-orm";
import { injectable } from "inversify";
import { type IAddressesRepository } from "~/application/repositories/addresses.repository.interface";
import { type Address, type AddressInsert } from "~/domain/entities/address";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  AddressAlreadyExistsError,
  AddressNotFoundError,
  AddressStillReferencedError,
} from "~/domain/errors/addresses";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";
import { isDatabaseError } from "~/domain/errors/database-error";
import { db } from "~/server/db";
import { addresses } from "~/server/db/schema";

@injectable()
export class AddressesRepository implements IAddressesRepository {
  /**
   * Creates a new address.
   *
   * @param address - The address data to insert.
   * @returns The created address.
   * @throws {AddressAlreadyExistsError} If an address with the same details already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createAddress(address: AddressInsert): Promise<Address> {
    return await startSpan(
      { name: "AddressesRepository > createAddress" },
      async () => {
        try {
          const query = db.insert(addresses).values(address).returning();

          const [createdAddress] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdAddress) {
            throw new DatabaseOperationError("Failed to create address");
          }

          return createdAddress;
        } catch (error) {
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new AddressAlreadyExistsError(
              "Address with the same details already exists",
              { cause: error },
            );
          }

          captureException(error, { data: address });
          throw new DatabaseOperationError("Failed to create address", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets an address by its ID.
   *
   * @param id The ID of the address to retrieve.
   * @returns The address if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getAddressById(id: number): Promise<Address | undefined> {
    return await startSpan(
      { name: "AddressesRepository > getAddressById" },
      async () => {
        try {
          const query = db.query.addresses.findFirst({
            where: eq(addresses.id, id),
          });

          const address = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return address;
        } catch (error) {
          captureException(error, { data: { addressId: id } });
          throw new DatabaseOperationError("Failed to get address", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets an address by its details.
   *
   * @param street The street of the address.
   * @param houseNumber The house number of the address.
   * @param box The box of the address.
   * @param municipality The municipality of the address.
   * @param postalCode The postal code of the address.
   * @returns The address if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getAddress(
    street: string,
    houseNumber: string,
    box: string | null,
    municipality: string,
    postalCode: number,
  ): Promise<Address | undefined> {
    return await startSpan(
      { name: "AddressesRepository > getAddress" },
      async () => {
        try {
          const query = db.query.addresses.findFirst({
            where: and(
              eq(addresses.street, street),
              eq(addresses.houseNumber, houseNumber),
              box === null ? isNull(addresses.box) : eq(addresses.box, box),
              eq(addresses.municipality, municipality),
              eq(addresses.postalCode, postalCode),
            ),
          });

          const address = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return address;
        } catch (error) {
          captureException(error, {
            data: { street, houseNumber, box, municipality, postalCode },
          });
          throw new DatabaseOperationError("Failed to get address", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Deletes an address by its ID.
   *
   * @param id The ID of the address to delete.
   * @throws {AddressNotFoundError} If the address is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteAddress(id: number): Promise<void> {
    return await startSpan(
      { name: "AddressesRepository > deleteAddress" },
      async () => {
        try {
          const query = db
            .delete(addresses)
            .where(eq(addresses.id, id))
            .returning();

          const [deletedAddress] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedAddress) {
            throw new AddressNotFoundError("Address not found");
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new AddressStillReferencedError(
              "Address is still referenced by other entities",
              { cause: error },
            );
          }

          captureException(error, { data: { addressId: id } });
          throw new DatabaseOperationError("Failed to delete address", {
            cause: error,
          });
        }
      },
    );
  }
}
