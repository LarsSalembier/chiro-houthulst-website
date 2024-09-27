import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq, isNull } from "drizzle-orm";
import { injectable } from "inversify";
import { IAddressesRepository } from "~/application/repositories/addresses.repository.interface";
import { Address, AddressInsert } from "~/domain/entities/address";
import { DatabaseOperationError } from "~/domain/errors/common";
import { db } from "drizzle";
import {
  addresses as addressesTable,
  UNIQUE_ADDRESS_CONSTRAINT,
} from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  AddressAlreadyExistsError,
  AddressNotFoundError,
  AddressStillReferencedError,
} from "~/domain/errors/addresses";

@injectable()
export class AddressesRepository implements IAddressesRepository {
  async createAddress(address: AddressInsert): Promise<Address> {
    return await startSpan(
      { name: "AddressesRepository > createAddress" },
      async () => {
        try {
          const query = db.insert(addressesTable).values(address).returning();

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
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation &&
            error.constraint === UNIQUE_ADDRESS_CONSTRAINT
          ) {
            throw new AddressAlreadyExistsError("Address already exists", {
              cause: error,
            });
          }

          captureException(error, { data: address });
          throw new DatabaseOperationError("Failed to create address", {
            cause: error,
          });
        }
      },
    );
  }

  async getAddressById(id: number): Promise<Address | undefined> {
    return await startSpan(
      { name: "AddressesRepository > getAddressById" },
      async () => {
        try {
          const query = db.query.addresses.findFirst({
            where: eq(addressesTable.id, id),
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

  async getAddressByDetails(
    street: string,
    houseNumber: string,
    box: string | null,
    municipality: string,
    postalCode: number,
  ): Promise<Address | undefined> {
    return await startSpan(
      { name: "AddressesRepository > getAddressByDetails" },
      async () => {
        try {
          const query = db.query.addresses.findFirst({
            where: and(
              eq(addressesTable.street, street),
              eq(addressesTable.houseNumber, houseNumber),
              box === null
                ? isNull(addressesTable.box)
                : eq(addressesTable.box, box),
              eq(addressesTable.municipality, municipality),
              eq(addressesTable.postalCode, postalCode),
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

  async getAllAddresses(): Promise<Address[]> {
    return await startSpan(
      { name: "AddressesRepository > getAllAddresses" },
      async () => {
        try {
          const query = db.query.addresses.findMany();

          const allAddresses = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allAddresses;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get all addresses", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteAddress(id: number): Promise<void> {
    return await startSpan(
      { name: "AddressesRepository > deleteAddress" },
      async () => {
        try {
          const query = db
            .delete(addressesTable)
            .where(eq(addressesTable.id, id))
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
          if (error instanceof AddressNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new AddressStillReferencedError("Address still referenced", {
              cause: error,
            });
          }

          captureException(error, { data: { addressId: id } });
          throw new DatabaseOperationError("Failed to delete address", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteAllAddresses(): Promise<void> {
    return await startSpan(
      { name: "AddressesRepository > deleteAllAddresses" },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(addressesTable).returning();

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
            throw new AddressStillReferencedError("Address still referenced", {
              cause: error,
            });
          }

          captureException(error);
          throw new DatabaseOperationError("Failed to delete all addresses", {
            cause: error,
          });
        }
      },
    );
  }
}
