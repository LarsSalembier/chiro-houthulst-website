import "server-only";
import { db } from "~/server/db";

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
