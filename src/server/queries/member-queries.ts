// import { db } from "../db";
// import {
//   members,
//   // membersParents,
//   auditLogs,
//   // subscriptions,
//   // activities,
//   // memberDepartments,
//   // departments,
// } from "../db/schema";
// import {
//   AuthenticationError,
//   // AuthorizationError
// } from "~/lib/errors";
// import {
//   // isLeiding,
//   isLoggedIn,
// } from "~/lib/auth";
// import {
//   //   type UpdateMemberData,
//   type CreateMemberData,
// } from "../schemas/member-schemas";
// import { auth } from "@clerk/nextjs/server";
// import {
//   // and,
//   eq,
//   // gte,
//   // sql
// } from "drizzle-orm";
// // import { getActiveWorkYear } from "./workyear-queries";

// export async function getMembersForLoggedInUser() {
//   if (!isLoggedIn()) throw new AuthenticationError();

//   const result = await db.query.members.findMany({
//     where: eq(members.userId, auth().userId!),
//   });

//   return result;
// }

// export async function createMember(data: CreateMemberData) {
//   if (!isLoggedIn()) throw new AuthenticationError();

//   const newMember = await db.transaction(async (tx) => {
//     const [member] = await tx
//       .insert(members)
//       .values({
//         ...data,
//         userId: auth().userId!,
//       })
//       .returning();

//     if (!member) return;

//     await tx.insert(auditLogs).values({
//       tableName: "members",
//       recordId: member.id,
//       action: "INSERT",
//       newValues: JSON.stringify(member),
//       userId: auth().userId!,
//     });

//     return member;
//   });

//   return newMember;
// }

// // export async function updateMember(
// //   memberId: number,
// //   memberData: UpdateMemberData,
// // ) {
// //   if (!isLoggedIn()) throw new AuthenticationError();
// //   if (!isLeiding()) throw new AuthorizationError();

// //   const result = await db.transaction(async (tx) => {
// //     const [oldMember] = await tx
// //       .select()
// //       .from(members)
// //       .where(eq(members.id, memberId));

// //     if (!oldMember) {
// //       throw new Error("Member not found");
// //     }

// //     const [updatedMember] = await tx
// //       .update(members)
// //       .set(memberData)
// //       .where(eq(members.id, memberId))
// //       .returning();
// //     await tx.insert(auditLogs).values({
// //       tableName: "members",
// //       recordId: memberId,
// //       action: "UPDATE",
// //       oldValues: JSON.stringify(oldMember),
// //       newValues: JSON.stringify(updatedMember),
// //       userId: oldMember.userId,
// //     });
// //     return updatedMember;
// //   });

// //   return result;
// // }

// // export async function linkMemberToParent(
// //   memberId: number,
// //   parentId: number,
// //   isPrimary: boolean,
// // ) {
// //   if (!isLoggedIn()) throw new AuthenticationError();

// //   await db.transaction(async (tx) => {
// //     const [link] = await tx
// //       .insert(membersParents)
// //       .values({ memberId, parentId, isPrimary })
// //       .returning();

// //     await tx.insert(auditLogs).values({
// //       tableName: "members_parents",
// //       recordId: memberId,
// //       action: "INSERT",
// //       newValues: JSON.stringify(link),
// //       userId: auth().userId!,
// //     });
// //   });
// // }

// // export async function linkMemberToDepartment(
// //   memberId: number,
// //   departmentId: number,
// //   workYearId: number,
// // ) {
// //   if (!isLoggedIn()) throw new AuthenticationError();

// //   await db.transaction(async (tx) => {
// //     const [link] = await tx
// //       .insert(memberDepartments)
// //       .values({ memberId, departmentId, workYearId })
// //       .returning();

// //     await tx.insert(auditLogs).values({
// //       tableName: "member_departments",
// //       recordId: memberId,
// //       action: "INSERT",
// //       newValues: JSON.stringify(link),
// //       userId: auth().userId!,
// //     });
// //   });
// // }

// // export async function subscribeMemberToActivity(
// //   memberId: number,
// //   activityId: number,
// // ) {
// //   if (!isLoggedIn()) throw new AuthenticationError();

// //   const result = await db.transaction(async (tx) => {
// //     const [activity] = await tx
// //       .select()
// //       .from(activities)
// //       .where(eq(activities.id, activityId));

// //     if (!activity) {
// //       throw new Error("Activity not found");
// //     }

// //     const currentWorkYear = await getActiveWorkYear();
// //     if (!currentWorkYear) {
// //       throw new Error("No active work year found");
// //     }

// //     const [memberDepartment] = await tx
// //       .select()
// //       .from(memberDepartments)
// //       .where(
// //         and(
// //           eq(memberDepartments.memberId, memberId),
// //           eq(memberDepartments.workYearId, currentWorkYear.id),
// //         ),
// //       );

// //     if (!memberDepartment) {
// //       throw new Error(
// //         "Member is not assigned to a department for the current work year",
// //       );
// //     }

// //     const [existingSubscription] = await tx
// //       .select()
// //       .from(subscriptions)
// //       .where(
// //         and(
// //           eq(subscriptions.memberId, memberId),
// //           eq(subscriptions.activityId, activityId),
// //         ),
// //       );

// //     if (existingSubscription) {
// //       throw new Error("Member is already subscribed to this activity");
// //     }

// //     const [subscription] = await tx
// //       .insert(subscriptions)
// //       .values({
// //         memberId,
// //         activityId,
// //         status: "PENDING",
// //       })
// //       .returning();

// //     return subscription;
// //   });

// //   return result;
// // }

// // export async function getMemberWithActiveSubscriptionsAndDepartment(
// //   memberId: number,
// // ) {
// //   if (!isLoggedIn()) throw new AuthenticationError();

// //   const currentWorkYear = await getActiveWorkYear();
// //   if (!currentWorkYear) {
// //     throw new Error("No active work year found");
// //   }

// //   const result = await db.query.members.findFirst({
// //     where: eq(members.id, memberId),
// //     with: {
// //       subscriptions: {
// //         where: and(
// //           eq(subscriptions.status, "APPROVED"),
// //           gte(activities.endDate, new Date()),
// //         ),
// //         with: {
// //           activity: true,
// //         },
// //       },
// //       memberDepartments: {
// //         where: eq(memberDepartments.workYearId, currentWorkYear.id),
// //         with: {
// //           department: true,
// //         },
// //       },
// //     },
// //   });

// //   return result;
// // }

// // export async function getMembersByDepartmentInCurrentYear(
// //   departmentId: number,
// // ) {
// //   if (!isLoggedIn()) throw new AuthenticationError();
// //   if (!isLeiding()) throw new AuthorizationError();

// //   const currentWorkYear = await getActiveWorkYear();
// //   if (!currentWorkYear) {
// //     throw new Error("No active work year found");
// //   }

// //   const result = await db.query.memberDepartments.findMany({
// //     where: and(
// //       eq(memberDepartments.departmentId, departmentId),
// //       eq(memberDepartments.workYearId, currentWorkYear.id),
// //     ),
// //     with: {
// //       member: {
// //         with: {
// //           subscriptions: {
// //             where: eq(subscriptions.status, "APPROVED"),
// //             with: {
// //               activity: true,
// //             },
// //           },
// //         },
// //       },
// //     },
// //   });

// //   return result.map((md) => md.member);
// // }

// // export async function getUpcomingBirthdays() {
// //   if (!isLoggedIn()) throw new AuthenticationError();

// //   const currentWorkYear = await getActiveWorkYear();
// //   if (!currentWorkYear) {
// //     throw new Error("No active work year found");
// //   }

// //   const result = await db
// //     .select({
// //       id: members.id,
// //       firstName: members.firstName,
// //       lastName: members.lastName,
// //       dateOfBirth: members.dateOfBirth,
// //       age: sql<number>`EXTRACT(YEAR FROM AGE(${members.dateOfBirth}))`,
// //       departmentId: memberDepartments.departmentId,
// //       departmentName: departments.name,
// //     })
// //     .from(members)
// //     .leftJoin(
// //       memberDepartments,
// //       and(
// //         eq(members.id, memberDepartments.memberId),
// //         eq(memberDepartments.workYearId, currentWorkYear.id),
// //       ),
// //     )
// //     .leftJoin(departments, eq(memberDepartments.departmentId, departments.id))
// //     .where(
// //       and(
// //         sql`EXTRACT(MONTH FROM ${members.dateOfBirth}) = EXTRACT(MONTH FROM CURRENT_DATE)`,
// //         sql`EXTRACT(DAY FROM ${members.dateOfBirth}) BETWEEN EXTRACT(DAY FROM CURRENT_DATE) AND EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '30 days')`,
// //       ),
// //     )
// //     .orderBy(
// //       sql`EXTRACT(MONTH FROM ${members.dateOfBirth})`,
// //       sql`EXTRACT(DAY FROM ${members.dateOfBirth})`,
// //     );

// //   return result;
// // }
