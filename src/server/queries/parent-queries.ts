// import { db } from "../db";
// import { parents, auditLogs } from "../db/schema";
// import { AuthenticationError } from "~/lib/errors";
// import { isLoggedIn } from "~/lib/auth";
// import { auth } from "@clerk/nextjs/server";
// import { type CreateParentData } from "../schemas/parent-schemas";

// export async function createParent(data: CreateParentData) {
//   if (!isLoggedIn()) throw new AuthenticationError();

//   const newParent = await db.transaction(async (tx) => {
//     const [parent] = await tx
//       .insert(parents)
//       .values({
//         ...data,
//         userId: auth().userId!,
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
