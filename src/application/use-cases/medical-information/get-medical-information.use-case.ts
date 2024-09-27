import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type MedicalInformation } from "~/domain/entities/medical-information";
import { MedicalInformationNotFoundError } from "~/domain/errors/medical-information";
import { MemberNotFoundError } from "~/domain/errors/members";

/**
 * Retrieves the medical information for a member.
 *
 * @param memberId - The ID of the member.
 * @returns The medical information for the member.
 *
 * @throws {MemberNotFoundError} If the member was not found.
 * @throws {MedicalInformationNotFoundError} If the medical information was not found.
 * @throws {DatabaseOperationError} If the operation fails for any reason.
 */
export async function getMedicalInformationUseCase(
  memberId: number,
): Promise<MedicalInformation> {
  return startSpan(
    { name: "getMedicalInformation Use Case", op: "function" },
    async () => {
      const medicalInformationRepository = getInjection(
        "IMedicalInformationRepository",
      );
      const membersRepository = getInjection("IMembersRepository");

      const member = await membersRepository.getMemberById(memberId);

      if (!member) {
        throw new MemberNotFoundError("Member not found");
      }

      const medicalInformation =
        await medicalInformationRepository.getMedicalInformationByMemberId(
          memberId,
        );

      if (!medicalInformation) {
        throw new MedicalInformationNotFoundError(
          "Medical information not found",
        );
      }

      return medicalInformation;
    },
  );
}
