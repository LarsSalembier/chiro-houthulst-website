// import { db } from "../db";
// import {
//   activities,
//   subscriptions,
//   auditLogs,
//   departments,
//   memberDepartments,
// } from "../db/schema";
// import { AuthenticationError, AuthorizationError } from "~/lib/errors";
// import { isLeiding, isLoggedIn } from "~/lib/auth";
// import { type CreateActivityData } from "../schemas/activity-schemas";
// import { auth } from "@clerk/nextjs/server";
// import { eq, gte, sql } from "drizzle-orm";
// import { getActiveWorkYear as getActiveWorkyear } from "./workyear-queries";

// export async function createActivity(
//   data: CreateActivityData,
//   workYearId: number,
// ) {
//   if (!isLoggedIn()) throw new AuthenticationError();
//   if (!isLeiding()) throw new AuthorizationError();

//   const newActivity = await db.transaction(async (tx) => {
//     const [activity] = await tx
//       .insert(activities)
//       .values({
//         ...data,
//         price: data.price.toFixed(2),
//         workYearId,
//       })
//       .returning();

//     if (!activity) return;

//     await tx.insert(auditLogs).values({
//       tableName: "activities",
//       recordId: activity.id,
//       action: "INSERT",
//       newValues: JSON.stringify(activity),
//       userId: auth().userId!,
//     });

//     return activity;
//   });

//   return newActivity;
// }

// export async function subscribeMemberToActivity(
//   memberId: number,
//   activityId: number,
// ) {
//   if (!isLoggedIn()) throw new AuthenticationError();

//   const newSubscription = await db.transaction(async (tx) => {
//     const [subscription] = await tx
//       .insert(subscriptions)
//       .values({ memberId, activityId, status: "PENDING" })
//       .returning();

//     if (!subscription) return;

//     await tx.insert(auditLogs).values({
//       tableName: "subscriptions",
//       recordId: subscription.id,
//       action: "INSERT",
//       newValues: JSON.stringify(subscription),
//       userId: auth().userId!,
//     });

//     return subscription;
//   });

//   return newSubscription;
// }

// export async function getUpcomingActivities() {
//   const result = await db
//     .select({
//       id: activities.id,
//       name: activities.name,
//       startDate: activities.startDate,
//       endDate: activities.endDate,
//       location: activities.location,
//       subscribedCount: sql<number>`count(${subscriptions.id})`,
//       maxParticipants: activities.maxParticipants,
//     })
//     .from(activities)
//     .leftJoin(subscriptions, eq(activities.id, subscriptions.activityId))
//     .where(gte(activities.startDate, new Date()))
//     .groupBy(activities.id, departments.id)
//     .orderBy(activities.startDate);

//   return result;
// }

// export async function getAllActivitiesWithMemberCounts() {
//   if (!isLoggedIn()) throw new AuthenticationError();
//   if (!isLeiding()) throw new AuthorizationError();

//   const currentWorkYear = await getActiveWorkyear();

//   if (!currentWorkYear) {
//     throw new Error("No active work year found");
//   }

//   return db.query.activities.findMany({
//     where: eq(activities.workYearId, currentWorkYear.id),
//     with: {
//       subscriptions: {
//         with: {
//           member: {
//             with: {
//               memberDepartments: {
//                 where: eq(memberDepartments.workYearId, currentWorkYear.id),
//                 with: {
//                   department: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });
// }
