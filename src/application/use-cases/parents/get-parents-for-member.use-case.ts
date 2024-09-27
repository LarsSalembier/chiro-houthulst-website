import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Address } from "~/domain/entities/address";
import { type Parent } from "~/domain/entities/parent";

export async function getParentsForMemberUseCase(memberId: number): Promise<
  {
    parent: Parent;
    address: Address;
    isPrimary: boolean;
  }[]
> {
  return startSpan(
    { name: "getParentsForMember Use Case", op: "function" },
    async () => {
      const parentsRepository = getInjection("IParentsRepository");

      const parents = await parentsRepository.getParentsForMember(memberId);

      const addressIds = parents.map((parent) => parent.parent.addressId);

      const addressesRepository = getInjection("IAddressesRepository");

      const addresses = await Promise.all(
        addressIds.map(
          async (addressId) =>
            (await addressesRepository.getAddressById(addressId))!,
        ),
      );

      return parents.map((parent, index) => ({
        parent: parent.parent,
        address: addresses[index]!,
        isPrimary: parent.isPrimary,
      }));
    },
  );
}
