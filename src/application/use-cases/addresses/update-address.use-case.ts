import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type AddressInsert, type Address } from "~/domain/entities/address";
import {
  AddressAlreadyExistsError,
  AddressNotFoundError,
  AddressStillReferencedError,
} from "~/domain/errors/addresses";

/**
 * Update an address. The address will be deleted and a new address will be created with the updated details.
 *
 * @param addressId The ID of the address to update
 * @param address The updated address details
 * @returns The updated address
 *
 * @throws {AddressNotFoundError} If the address was not found
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function updateAddressUseCase(
  addressId: number,
  address: Partial<AddressInsert>,
): Promise<Address> {
  return startSpan(
    { name: "updateAddress Use Case", op: "function" },
    async () => {
      const addressesRepository = getInjection("IAddressesRepository");

      const addressToUpdate =
        await addressesRepository.getAddressById(addressId);

      if (!addressToUpdate) {
        throw new AddressNotFoundError("Address not found");
      }

      const updatedAddress = {
        ...addressToUpdate,
        ...address,
      };

      // Remove old address
      try {
        await addressesRepository.deleteAddress(addressId);
      } catch (error) {
        // If it is still referenced, we don't want to delete it
        if (!(error instanceof AddressStillReferencedError)) {
          throw error;
        }
      }

      // Create new address
      try {
        return await addressesRepository.createAddress(updatedAddress);
      } catch (error) {
        if (error instanceof AddressAlreadyExistsError) {
          return (await addressesRepository.getAddressByDetails(
            updatedAddress.street,
            updatedAddress.houseNumber,
            updatedAddress.box,
            updatedAddress.municipality,
            updatedAddress.postalCode,
          ))!;
        }

        throw error;
      }
    },
  );
}
