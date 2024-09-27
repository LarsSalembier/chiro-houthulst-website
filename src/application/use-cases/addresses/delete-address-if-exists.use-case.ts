import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import {
  AddressNotFoundError,
  AddressStillReferencedError,
} from "~/domain/errors/addresses";

/**
 * Delete an address. The address will only be deleted if it is not referenced by any other entity. If it doesn't exist, nothing will happen.
 *
 * @param addressId The ID of the address to delete
 *
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function deleteAddressIfExistsUseCase(
  addressId: number,
): Promise<void> {
  return startSpan(
    { name: "deleteAddressIfExists Use Case", op: "function" },
    async () => {
      const addressesRepository = getInjection("IAddressesRepository");

      try {
        return await addressesRepository.deleteAddress(addressId);
      } catch (error) {
        if (
          !(
            error instanceof AddressStillReferencedError ||
            error instanceof AddressNotFoundError
          )
        ) {
          throw error;
        }
      }
    },
  );
}
