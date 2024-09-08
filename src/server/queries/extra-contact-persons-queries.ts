// import { db } from "../db";
// import { parents, auditLogs, extraContactPersons } from "../db/schema";
// import { AuthenticationError } from "~/lib/errors";
// import { isLoggedIn } from "~/lib/auth";
// import { auth } from "@clerk/nextjs/server";
// import { type CreateExtraContactPersonData } from "../schemas/extra-contact-person-schemas";

// export async function createExtraContactPerson(
//   data: CreateExtraContactPersonData,
// ) {
//   if (!isLoggedIn()) throw new AuthenticationError();

//   const newExtraContactPerson = await db.transaction(async (tx) => {
//     const [extraContactPerson] = await tx
//       .insert(extraContactPersons)
//       .values({
//         ...data,
//       })
//       .returning();

//     if (!parent) return;

//     await tx.insert(auditLogs).values({
//       tableName: "parents",
//       recordId: parent.id,
//       action: "INSERT",
//       newValues: JSON.stringify(parent),
//       userId: auth().userId!,
//     });

//     return parent;
//   });

//   return newParent;
// }
