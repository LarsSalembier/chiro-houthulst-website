import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Address, type AddressInsert } from "~/domain/entities/address";

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

      // Check if address already exists
      const existingAddress = await addressesRepository.getAddressByDetails(
        address.street,
        address.houseNumber,
        address.box,
        address.municipality,
        address.postalCode,
      );

      if (existingAddress) {
        return existingAddress;
      }

      // Create address
      return addressesRepository.createAddress(address);
    },
  );
}
