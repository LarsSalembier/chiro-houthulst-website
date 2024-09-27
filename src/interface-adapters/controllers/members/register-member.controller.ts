import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { registerMemberUseCase } from "~/application/use-cases/members/register-member";
import { type Member } from "~/domain/entities/member";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "~/domain/errors/authentication";
import { type RegisterMemberInput } from "./schema";

/**
 * Controller for registering a member
 *
 * @param input - The input for registering a member
 * @returns The registered member
 *
 * @throws {UnauthenticatedError} If the user is not logged in
 * @throws {UnauthorizedError} If the user is not leiding
 * @throws {MemberWithThatEmailAddressAlreadyExistsError} If a member with that email address already exists
 * @throws {MemberWithThatNameAndBirthDateAlreadyExistsError} If a member with that name and birth date already exists
 * @throws {ParentWithThatEmailAddressAlreadyExistsError} If a parent with that email address already exists
 * @throws {WorkYearNotFoundError} If the current work year could not be found
 * @throws {GroupNotFoundError} If the group could not be found
 * @throws {DatabaseOperationError} If an error occurs in the database
 */
export async function registerMemberController(
  input: RegisterMemberInput,
): Promise<Member> {
  return await startSpan(
    {
      name: "registerMember Controller",
    },
    async () => {
      const authenticationService = getInjection("IAuthenticationService");

      if (!authenticationService.isLoggedIn()) {
        throw new UnauthenticatedError(
          "You must be logged in to create a work year",
        );
      }

      if (!authenticationService.isLeiding()) {
        throw new UnauthorizedError("You must be leiding to register a member");
      }

      return await registerMemberUseCase(
        input.memberData,
        input.parentsWithAddresses,
        input.emergencyContact,
        input.medicalInformation,
        input.groupId,
        input.yearlyMembership,
      );
    },
  );
}
