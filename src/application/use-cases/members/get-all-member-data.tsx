import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type AddressInsert } from "~/domain/entities/address";
import { type EmergencyContactInsert } from "~/domain/entities/emergency-contact";
import { type MedicalInformationInsert } from "~/domain/entities/medical-information";
import { type MemberInsert } from "~/domain/entities/member";
import { type ParentInsert } from "~/domain/entities/parent";

/**
 * Get all data of a member.
 *
 * @param firstName The first name of the member
 * @param lastName The last name of the member
 * @param birthDate The birth date of the member
 * @returns The member data, parents with addresses, emergency contact, and medical information, or `undefined` if the member was not found
 */
export async function getAllMemberDataUseCase(
  firstName: string,
  lastName: string,
  birthDate: Date,
): Promise<
  | {
      memberData: MemberInsert;
      parentsWithAddresses: {
        parent: Omit<ParentInsert, "addressId">;
        address: AddressInsert;
      }[];
      emergencyContact: Omit<EmergencyContactInsert, "memberId">;
      medicalInformation: Omit<MedicalInformationInsert, "memberId">;
    }
  | undefined
> {
  return startSpan({ name: "getMember Use Case", op: "function" }, async () => {
    const membersRepository = getInjection("IMembersRepository");
    const emergencyContactsRepository = getInjection(
      "IEmergencyContactsRepository",
    );
    const medicalInformationRepository = getInjection(
      "IMedicalInformationRepository",
    );
    const parentsRepository = getInjection("IParentsRepository");
    const addressesRepository = getInjection("IAddressesRepository");

    const member = await membersRepository.getMemberByNameAndDateOfBirth(
      firstName,
      lastName,
      birthDate,
    );

    if (!member) {
      return undefined;
    }

    const parents = await parentsRepository.getParentsForMember(member.id);

    const parentsWithAddresses = await Promise.all(
      parents.map(async (parent) => {
        const address = (await addressesRepository.getAddressById(
          parent.parent.addressId,
        ))!;

        return { parent: parent.parent, address };
      }),
    );

    const emergencyContact =
      await emergencyContactsRepository.getEmergencyContactByMemberId(
        member.id,
      );

    const medicalInformation =
      await medicalInformationRepository.getMedicalInformationByMemberId(
        member.id,
      );

    if (!emergencyContact || !medicalInformation) {
      return undefined;
    }

    return {
      memberData: member,
      parentsWithAddresses,
      emergencyContact,
      medicalInformation,
    };
  });
}
