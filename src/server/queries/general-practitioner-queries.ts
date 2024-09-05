// import { isLoggedIn } from "~/lib/auth";
// import { AuthenticationError } from "~/lib/errors";
// import { db } from "../db";
// import { generalPractitioners, auditLogs } from "../db/schema";
// import { type CreateGeneralPractitionerData } from "../schemas/general-practitioner-schemas";
// import { auth } from "@clerk/nextjs/server";

// export async function createGeneralPractitioner(
//   data: CreateGeneralPractitionerData,
// ) {
//   if (!isLoggedIn()) throw new AuthenticationError();

//   const newGP = await db.transaction(async (tx) => {
//     const [gp] = await tx.insert(generalPractitioners).values(data).returning();

//     if (!gp) return;

//     await tx.insert(auditLogs).values({
//       tableName: "general_practitioners",
//       recordId: gp.id,
//       action: "INSERT",
//       newValues: JSON.stringify(gp),
//       userId: auth().userId!,
//     });

//     return gp;
//   });

//   return newGP;
// }
