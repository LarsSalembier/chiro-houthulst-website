import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type AddressInsert } from "~/domain/entities/address";
import { type EmergencyContactInsert } from "~/domain/entities/emergency-contact";
import { type MedicalInformationInsert } from "~/domain/entities/medical-information";
import { type Member, type MemberInsert } from "~/domain/entities/member";
import { type ParentInsert } from "~/domain/entities/parent";
import { type YearlyMembershipInsert } from "~/domain/entities/yearly-membership";
import { getCurrentWorkYearUseCase } from "../work-years/get-current-work-year.use-case";
import { createOrUpdateParentUseCase } from "../parents/create-or-update-parent.use-case";

/**
 * Register a new member.
 *
 * @param memberData The data of the member to register
 * @param parentsWithAddresses The parents of the member with their addresses
 * @param emergencyContact The emergency contact of the member
 * @param medicalInformation The medical information of the member
 * @param groupId The group ID of the member
 * @param yearlyMembership The yearly membership of the member
 *
 * @throws {MemberWithThatEmailAddressAlreadyExistsError} If a member with that email address already exists
 * @throws {MemberWithThatNameAndBirthDateAlreadyExistsError} If a member with that name and birth date already exists
 * @throws {WorkYearNotFoundError} If no active work year was found
 * @throws {GroupNotFoundError} If the group was not found
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function registerMemberUseCase(
  memberData: MemberInsert,
  parentsWithAddresses: {
    parent: Omit<ParentInsert, "addressId">;
    address: AddressInsert;
  }[],
  emergencyContact: Omit<EmergencyContactInsert, "memberId">,
  medicalInformation: Omit<MedicalInformationInsert, "memberId">,
  groupId: number,
  yearlyMembership: Omit<
    YearlyMembershipInsert,
    "memberId" | "groupId" | "workYearId"
  >,
): Promise<Member> {
  return startSpan(
    { name: "registerMember Use Case", op: "function" },
    async () => {
      const membersRepository = getInjection("IMembersRepository");
      const emergencyContactsRepository = getInjection(
        "IEmergencyContactsRepository",
      );
      const medicalInformationRepository = getInjection(
        "IMedicalInformationRepository",
      );
      const yearlyMembershipsRepository = getInjection(
        "IYearlyMembershipsRepository",
      );

      const currentWorkYear = await getCurrentWorkYearUseCase();

      const member = await membersRepository.createMember(memberData);

      for (let i = 0; i < parentsWithAddresses.length; i++) {
        const { parent, address } = parentsWithAddresses[i]!;

        const createdOrUpdatedParent = await createOrUpdateParentUseCase(
          parent,
          address,
        );

        await membersRepository.addParentToMember(
          member.id,
          createdOrUpdatedParent.id,
          i === 0,
        );
      }

      await emergencyContactsRepository.createEmergencyContact({
        ...emergencyContact,
        memberId: member.id,
      });

      await medicalInformationRepository.createMedicalInformation({
        ...medicalInformation,
        memberId: member.id,
      });

      await yearlyMembershipsRepository.createYearlyMembership({
        ...yearlyMembership,
        memberId: member.id,
        groupId,
        workYearId: currentWorkYear.id,
      });

      return member;
    },
  );
}
