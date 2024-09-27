import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type EmergencyContact } from "~/domain/entities/emergency-contact";
import { EmergencyContactNotFoundError } from "~/domain/errors/emergency-contacts";
import { MemberNotFoundError } from "~/domain/errors/members";

/**
 * Retrieves the emergency contact for a member.
 *
 * @param memberId - The ID of the member.
 * @returns The emergency contact for the member.
 *
 * @throws {MemberNotFoundError} If the member was not found.
 * @throws {EmergencyContactNotFoundError} If the emergency contact was not found.
 * @throws {DatabaseOperationError} If the operation fails for any reason.
 */
export async function getEmergencyContactUseCase(
  memberId: number,
): Promise<EmergencyContact> {
  return startSpan(
    { name: "getEmergencyContact Use Case", op: "function" },
    async () => {
      const emergencyContactsRepository = getInjection(
        "IEmergencyContactsRepository",
      );
      const membersRepository = getInjection("IMembersRepository");

      const member = await membersRepository.getMemberById(memberId);

      if (!member) {
        throw new MemberNotFoundError("Member not found");
      }

      const emergencyContact =
        await emergencyContactsRepository.getEmergencyContactByMemberId(
          memberId,
        );

      if (!emergencyContact) {
        throw new EmergencyContactNotFoundError("Emergency contact not found");
      }

      return emergencyContact;
    },
  );
}
