import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type AddressInsert } from "~/domain/entities/address";
import { type Parent, type ParentInsert } from "~/domain/entities/parent";
import { ParentWithThatEmailAddressAlreadyExistsError } from "~/domain/errors/parents";
import { createOrGetAddressUseCase } from "../addresses/create-or-get-address.use-case";

/**
 * Create a new parent or update an existing parent by their email address.
 *
 * @param parent The parent to create or update
 * @param address The address of the parent
 * @returns The parent
 *
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function createOrUpdateParentUseCase(
  parent: Omit<ParentInsert, "addressId">,
  address: AddressInsert,
): Promise<Parent> {
  return startSpan(
    { name: "createOrUpdateParent Use Case", op: "function" },
    async () => {
      const parentsRepository = getInjection("IParentsRepository");

      const addressEntity = await createOrGetAddressUseCase(address);

      const parentEntity = {
        ...parent,
        addressId: addressEntity.id,
      };

      try {
        const newParent = await parentsRepository.createParent(parentEntity);

        return newParent;
      } catch (error) {
        if (error instanceof ParentWithThatEmailAddressAlreadyExistsError) {
          const existingParent =
            (await parentsRepository.getParentByEmailAddress(
              parentEntity.emailAddress,
            ))!;

          return await parentsRepository.updateParent(
            existingParent.id,
            parentEntity,
          );
        }

        throw error;
      }
    },
  );
}
