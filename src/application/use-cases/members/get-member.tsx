import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Address } from "~/domain/entities/address";
import { type EmergencyContact } from "~/domain/entities/emergency-contact";
import { type MedicalInformation } from "~/domain/entities/medical-information";
import { type Member } from "~/domain/entities/member";
import { type Parent } from "~/domain/entities/parent";
import { type YearlyMembership } from "~/domain/entities/yearly-membership";
import { MemberNotFoundError } from "~/domain/errors/members";
import { getCurrentWorkYearUseCase } from "../work-years/get-current-work-year.use-case";

interface FullMemberInfo {
  member: Member;
  parentsWithAddresses: {
    parent: Omit<Parent, "addressId">;
    address: Address;
  }[];
  emergencyContact: Omit<EmergencyContact, "memberId">;
  medicalInformation: Omit<MedicalInformation, "memberId">;
  group: {
    id: number;
    name: string;
    color: string | null;
  };
  yearlyMembership: Omit<
    YearlyMembership,
    "memberId" | "groupId" | "workYearId"
  >;
}

/**
 * Get a member by ID.
 *
 * @param memberId The ID of the member to get
 * @returns The member
 *
 * @throws {MemberNotFoundError} If the member was not found
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function getMemberUseCase(
  memberId: number,
): Promise<FullMemberInfo> {
  return startSpan({ name: "getMember Use Case", op: "function" }, async () => {
    const membersRepository = getInjection("IMembersRepository");

    const member = await membersRepository.getMemberById(memberId);

    if (!member) {
      throw new MemberNotFoundError("Member not found");
    }

    const parentsRepository = getInjection("IParentsRepository");
    const addressesRepository = getInjection("IAddressesRepository");
    const emergencyContactsRepository = getInjection(
      "IEmergencyContactsRepository",
    );
    const medicalInformationRepository = getInjection(
      "IMedicalInformationRepository",
    );
    const yearlyMembershipsRepository = getInjection(
      "IYearlyMembershipsRepository",
    );
    const groupsRepository = getInjection("IGroupsRepository");

    const parents = await parentsRepository.getParentsForMember(memberId);
    const parentsWithAddresses = await Promise.all(
      parents.map(async (parent) => {
        const address = await addressesRepository.getAddressById(
          parent.parent.addressId,
        );
        if (!address) {
          throw new Error("Address not found");
        }
        return { parent: parent.parent, address };
      }),
    );

    const emergencyContact =
      await emergencyContactsRepository.getEmergencyContactByMemberId(memberId);
    if (!emergencyContact) {
      throw new Error("Emergency contact not found");
    }

    const medicalInformation =
      await medicalInformationRepository.getMedicalInformationByMemberId(
        memberId,
      );
    if (!medicalInformation) {
      throw new Error("Medical information not found");
    }

    const currentWorkYear = await getCurrentWorkYearUseCase();

    const yearlyMembership =
      await yearlyMembershipsRepository.getYearlyMembershipByIds(
        memberId,
        currentWorkYear.id,
      );
    if (!yearlyMembership) {
      throw new Error("Yearly membership not found");
    }

    const group = await groupsRepository.getGroupById(yearlyMembership.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    return {
      member,
      parentsWithAddresses,
      emergencyContact,
      medicalInformation,
      group,
      yearlyMembership,
    };
  });
}
