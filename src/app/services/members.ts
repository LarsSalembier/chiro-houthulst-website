import { db } from "drizzle";

export async function getMemberById(id: number) {
  const member = await db.query.members.findFirst({
    where: (members, { eq }) => eq(members.id, id),
    with: {
      membersParents: {
        with: {
          parent: {
            with: {
              address: true,
            },
          },
        },
      },
      medicalInformation: true,
      emergencyContact: true,
      yearlyMemberships: {
        with: {
          workYear: true,
          group: true,
        },
      },
    },
  });

  if (!member) {
    return undefined;
  }

  return {
    ...member,
    membersParents: undefined,
    parents: member.membersParents.map((mp) => ({
      ...mp.parent,
      isPrimary: mp.isPrimary,
    })),
  };
}

type MemberWithAllRelevantData = Exclude<
  Awaited<ReturnType<typeof getMemberById>>,
  undefined
>;

export function getCurrentYearlyMembership(member: MemberWithAllRelevantData) {
  const today = new Date();

  for (const yearlyMembership of member.yearlyMemberships) {
    if (
      yearlyMembership.workYear.startDate <= today &&
      today <= yearlyMembership.workYear.endDate
    ) {
      return yearlyMembership;
    }
  }

  return undefined;
}
