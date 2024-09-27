import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Address } from "~/domain/entities/address";
import { AddressAlreadyExistsError } from "~/domain/errors/addresses";

/**
 * Get an address by its ID.
 *
 * @param addressId The ID of the address to get
 * @returns The address
 *
 * @throws {AddressNotFoundError} If the address was not found
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function getAddressUseCase(addressId: number): Promise<Address> {
  return startSpan(
    { name: "getAddress Use Case", op: "function" },
    async () => {
      const addressesRepository = getInjection("IAddressesRepository");

      const address = await addressesRepository.getAddressById(addressId);

      if (!address) {
        throw new AddressAlreadyExistsError("Address not found");
      }

      return address;
    },
  );
}
