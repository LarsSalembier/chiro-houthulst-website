import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Address, type AddressInsert } from "~/domain/entities/address";
import { AddressAlreadyExistsError } from "~/domain/errors/addresses";

/**
 * Create or get an address. If the address already exists, return the existing address. If the address does not exist, create it and return the new address.
 *
 * @param address The address to create or get
 * @returns The existing or new address
 *
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function createOrGetAddressUseCase(
  address: AddressInsert,
): Promise<Address> {
  return startSpan(
    { name: "createOrGetAddress Use Case", op: "function" },
    async () => {
      const addressesRepository = getInjection("IAddressesRepository");

      try {
        const newAddress = await addressesRepository.createAddress(address);

        return newAddress;
      } catch (error) {
        if (error instanceof AddressAlreadyExistsError) {
          return (await addressesRepository.getAddressByDetails(
            address.street,
            address.houseNumber,
            address.box,
            address.municipality,
            address.postalCode,
          ))!;
        }

        throw error;
      }
    },
  );
}
