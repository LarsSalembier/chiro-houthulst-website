import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Member } from "~/domain/entities/member";
import { type YearlyMembership } from "~/domain/entities/yearly-membership";
import { getCurrentWorkYearUseCase } from "../work-years/get-current-work-year.use-case";

/**
 * Retrieves the members and yearly memberships for a group.
 *
 * @param groupId - The ID of the group.
 * @returns A list of members and their yearly memberships for the group.
 *
 * @throws {WorkYearNotFoundError} If no active work year was found.
 * @throws {DatabaseOperationError} If the operation fails for any reason.
 */
export async function getMembersForGroupUseCase(groupId: number): Promise<
  {
    member: Member;
    yearlyMembership: Omit<
      YearlyMembership,
      "memberId" | "groupId" | "workYearId"
    >;
  }[]
> {
  return startSpan(
    { name: "getMembersForGroup Use Case", op: "function" },
    async () => {
      const yearlyMembershipsRepository = getInjection(
        "IYearlyMembershipsRepository",
      );

      const currentWorkYear = await getCurrentWorkYearUseCase();

      const yearlyMemberships =
        await yearlyMembershipsRepository.getAllYearlyMemberships();

      const yearlyMembershipsForGroup = yearlyMemberships.filter(
        (yearlyMembership) =>
          yearlyMembership.groupId === groupId &&
          yearlyMembership.workYearId === currentWorkYear.id,
      );

      const memberIds = yearlyMembershipsForGroup.map(
        (yearlyMembership) => yearlyMembership.memberId,
      );

      const membersRepository = getInjection("IMembersRepository");

      const members = await Promise.all(
        memberIds.map((memberId) => membersRepository.getMemberById(memberId)),
      );

      return yearlyMembershipsForGroup
        .map((yearlyMembership) => {
          const member = members.find(
            (member) => member?.id === yearlyMembership.memberId,
          );

          if (!member) {
            return null;
          }

          return {
            member,
            yearlyMembership,
          };
        })
        .filter((result) => result !== null);
    },
  );
}