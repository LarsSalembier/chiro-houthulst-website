// import { and, gte, lte } from "drizzle-orm";
// import { db } from "../db";
// import { workYears } from "../db/schema";
// import { type CreateWorkyearData } from "../schemas/workyear-schemas";

// export async function createWorkYear(data: CreateWorkyearData) {
//   const newWorkYear = await db.transaction(async (tx) => {
//     const [workYear] = await tx.insert(workYears).values(data).returning();

//     return workYear;
//   });

//   return newWorkYear;
// }

// export async function getActiveWorkYear() {
//   const currentDate = new Date();

//   const result = await db.query.workYears.findFirst({
//     where: and(
//       lte(workYears.startDate, currentDate),
//       gte(workYears.endDate, currentDate),
//     ),
//   });

//   return result;
// }
