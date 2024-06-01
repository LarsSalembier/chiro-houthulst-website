import { and, gte, isNotNull, lte } from "drizzle-orm";
import "server-only";
import { db } from "~/server/db";
import { sponsors } from "./db/schema";

export async function getGroups() {
  const groupsFromDb = await db.query.groups
    .findMany({
      with: {
        members: {
          columns: {},
          with: {
            person: true,
          },
        },
      },
    })
    .execute();

  return groupsFromDb.map((group) => ({
    name: group.name,
    ageRange: group.ageRange,
    members: group.members.map((member) => ({
      id: member.person.id,
      firstName: member.person.firstName,
      lastName: member.person.lastName,
      phone: member.person.phone,
    })),
  }));
}

export async function getSponsorsWithLogo(
  startAmount: number,
  endAmount: number,
) {
  return await db.query.sponsors.findMany({
    where: and(
      gte(sponsors.amount, startAmount),
      lte(sponsors.amount, endAmount),
      isNotNull(sponsors.logoUrl),
    ),
  });
}
