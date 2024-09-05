// import { isLeiding, isLoggedIn } from "~/lib/auth";
// import { type CreateDepartmentData } from "../schemas/department-schemas";
// import { AuthenticationError, AuthorizationError } from "~/lib/errors";
// import { db } from "../db";
// import {
//   auditLogs,
//   departments,
//   memberDepartments,
//   members,
// } from "../db/schema";
// import { auth } from "@clerk/nextjs/server";
// import { sql, desc, and, eq } from "drizzle-orm";
// import { getActiveWorkYear } from "./workyear-queries";

// export async function createDepartment(data: CreateDepartmentData) {
//   if (!isLoggedIn()) throw new AuthenticationError();
//   if (!isLeiding()) throw new AuthorizationError();

//   const newDepartment = await db.transaction(async (tx) => {
//     const [department] = await tx.insert(departments).values(data).returning();

//     if (!department) return;

//     await tx.insert(auditLogs).values({
//       tableName: "departments",
//       recordId: department.id,
//       action: "INSERT",
//       newValues: JSON.stringify(department),
//       userId: auth().userId!,
//     });

//     return department;
//   });

//   return newDepartment;
// }

// export async function getDepartmentStatistics() {
//   if (!isLoggedIn()) throw new AuthenticationError();
//   if (!isLeiding()) throw new AuthorizationError();

//   const currentWorkYear = await getActiveWorkYear();
//   if (!currentWorkYear) {
//     throw new Error("No active work year found");
//   }

//   const result = await db
//     .select({
//       id: departments.id,
//       name: departments.name,
//       memberCount: sql<number>`count(DISTINCT ${memberDepartments.memberId})`,
//     })
//     .from(departments)
//     .leftJoin(
//       memberDepartments,
//       and(
//         eq(departments.id, memberDepartments.departmentId),
//         eq(memberDepartments.workYearId, currentWorkYear.id),
//       ),
//     )
//     .groupBy(departments.id)
//     .orderBy(desc(sql<number>`count(DISTINCT ${memberDepartments.memberId})`));

//   return result;
// }

// export async function getDepartmentParents(departmentId: number) {
//   if (!isLoggedIn()) throw new AuthenticationError();
//   if (!isLeiding()) throw new AuthorizationError();

//   const currentWorkYear = await getActiveWorkYear();

//   if (!currentWorkYear) {
//     throw new Error("No active work year found");
//   }

//   return db.query.memberDepartments.findMany({
//     where: and(
//       eq(memberDepartments.departmentId, departmentId),
//       eq(memberDepartments.workYearId, currentWorkYear.id),
//     ),
//     with: {
//       member: {
//         with: {
//           membersParents: {
//             with: {
//               parent: {
//                 with: {
//                   parentAddresses: {
//                     with: {
//                       address: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });
// }

// export async function getUpcomingBirthdaysByDepartment(
//   departmentId: number,
//   daysAhead = 30,
// ) {
//   if (!isLoggedIn()) throw new AuthenticationError();
//   if (!isLeiding()) throw new AuthorizationError();

//   const currentWorkYear = await getActiveWorkYear();

//   if (!currentWorkYear) {
//     throw new Error("No active work year found");
//   }

//   const currentDate = new Date();
//   const futureDate = new Date(
//     currentDate.getTime() + daysAhead * 24 * 60 * 60 * 1000,
//   );

//   return db.query.memberDepartments.findMany({
//     where: and(
//       eq(memberDepartments.departmentId, departmentId),
//       eq(memberDepartments.workYearId, currentWorkYear.id),
//       sql`(
//         EXTRACT(MONTH FROM ${members.dateOfBirth}) > EXTRACT(MONTH FROM CURRENT_DATE)
//         OR (
//           EXTRACT(MONTH FROM ${members.dateOfBirth}) = EXTRACT(MONTH FROM CURRENT_DATE)
//           AND EXTRACT(DAY FROM ${members.dateOfBirth}) >= EXTRACT(DAY FROM CURRENT_DATE)
//         )
//       )
//       AND (
//         EXTRACT(MONTH FROM ${members.dateOfBirth}) < EXTRACT(MONTH FROM ${sql.raw(futureDate.toISOString())})
//         OR (
//           EXTRACT(MONTH FROM ${members.dateOfBirth}) = EXTRACT(MONTH FROM ${sql.raw(futureDate.toISOString())})
//           AND EXTRACT(DAY FROM ${members.dateOfBirth}) <= EXTRACT(DAY FROM ${sql.raw(futureDate.toISOString())})
//         )
//       )`,
//     ),
//     with: {
//       member: true,
//     },
//     orderBy: [
//       sql`EXTRACT(MONTH FROM ${members.dateOfBirth})`,
//       sql`EXTRACT(DAY FROM ${members.dateOfBirth})`,
//     ],
//   });
// }
