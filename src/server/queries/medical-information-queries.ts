// import { db } from "../db";
// import { medicalInformation, auditLogs } from "../db/schema";
// import { AuthenticationError } from "~/lib/errors";
// import { isLoggedIn } from "~/lib/auth";
// import { type CreateMedicalInformationData } from "../schemas/medical-information-schemas";
// import { auth } from "@clerk/nextjs/server";

// export async function createMedicalInformation(
//   data: CreateMedicalInformationData,
//   memberId: number,
//   generalPractitionerId: number,
// ) {
//   if (!isLoggedIn()) throw new AuthenticationError();

//   const newMedicalInfo = await db.transaction(async (tx) => {
//     const [medInfo] = await tx
//       .insert(medicalInformation)
//       .values({
//         ...data,
//         memberId,
//         generalPractitionerId,
//       })
//       .returning();

//     if (!medInfo) return;

//     await tx.insert(auditLogs).values({
//       tableName: "medical_information",
//       recordId: medInfo.id,
//       action: "INSERT",
//       newValues: JSON.stringify(medInfo),
//       userId: auth().userId!,
//     });

//     return medInfo;
//   });

//   return newMedicalInfo;
// }
