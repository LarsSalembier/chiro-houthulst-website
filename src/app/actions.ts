"use server";

import { db } from "~/server/db/db";
import { events } from "~/server/db/schema";
import { gte } from "drizzle-orm";

export async function getUpcomingEvents() {
  try {
    const now = new Date();
    const upcomingEvents = await db
      .select({
        id: events.id,
        title: events.title,
        startDate: events.startDate,
        endDate: events.endDate,
        location: events.location,
        coverImageUrl: events.coverImageUrl,
        facebookEventUrl: events.facebookEventUrl,
        price: events.price,
        canSignUp: events.canSignUp,
        signUpDeadline: events.signUpDeadline,
      })
      .from(events)
      .where(gte(events.startDate, now))
      .orderBy(events.startDate)
      .limit(20); // Limit to prevent too many events

    return upcomingEvents;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}
