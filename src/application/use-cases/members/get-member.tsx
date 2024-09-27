import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Member } from "~/domain/entities/member";
import { MemberNotFoundError } from "~/domain/errors/members";

/**
 * Get a member by ID.
 *
 * @param memberId The ID of the member to get
 * @returns The member
 *
 * @throws {MemberNotFoundError} If the member was not found
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function getMemberUseCase(memberId: number): Promise<Member> {
  return startSpan({ name: "getMember Use Case", op: "function" }, async () => {
    const membersRepository = getInjection("IMembersRepository");

    const member = await membersRepository.getMemberById(memberId);

    if (!member) {
      throw new MemberNotFoundError("Member not found");
    }

    return member;
  });
}
