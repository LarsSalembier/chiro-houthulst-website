import { db } from "drizzle";
import { type Gender } from "~/types/enums/gender";

export async function getGroupsForDateOfBirthAndGender(
  birthDate: Date,
  gender: Gender,
) {
  const today = new Date();
  const diff = today.getTime() - birthDate.getTime();
  const ageInDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  const groups = await db.query.groups.findMany({
    where: (groups, { and, eq, lte, gte, isNull, or }) =>
      and(
        eq(groups.active, true),
        lte(groups.minimumAgeInDays, ageInDays),
        or(
          isNull(groups.maximumAgeInDays),
          gte(groups.maximumAgeInDays, ageInDays),
        ),
        gender !== "X"
          ? or(isNull(groups.gender), eq(groups.gender, gender))
          : undefined,
      ),
  });

  return groups;
}

export async function getGroupsWithMembers() {
  const groups = await db.query.groups.findMany({
    where: (groups, { eq }) => eq(groups.active, true),
    with: {
      yearlyMemberships: {
        with: {
          member: {
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
            },
          },
        },
      },
    },
  });

  return groups;
}
