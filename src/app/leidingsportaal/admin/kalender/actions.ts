"use server";

import { requireAdminAuth } from "~/lib/auth";
import { db } from "~/server/db/db";
import { events } from "~/server/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function getAllEvents() {
  await requireAdminAuth();

  try {
    const allEvents = await db
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
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
      })
      .from(events)
      .orderBy(events.startDate);

    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
}

export async function createEvent(eventData: {
  title: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  coverImageUrl?: string;
  facebookEventUrl?: string;
  price?: number;
  canSignUp: boolean;
  signUpDeadline?: Date;
}) {
  await requireAdminAuth();

  try {
    const [newEvent] = await db.insert(events).values(eventData).returning();

    if (!newEvent) {
      throw new Error("Failed to create event");
    }

    revalidatePath("/leidingsportaal/admin/kalender");
    revalidatePath("/");

    return newEvent;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event");
  }
}

export async function updateEvent(
  id: number,
  eventData: {
    title?: string;
    startDate?: Date;
    endDate?: Date;
    location?: string;
    coverImageUrl?: string;
    facebookEventUrl?: string;
    price?: number;
    canSignUp?: boolean;
    signUpDeadline?: Date;
  },
) {
  await requireAdminAuth();

  try {
    const [updatedEvent] = await db
      .update(events)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    if (!updatedEvent) {
      throw new Error("Event not found");
    }

    revalidatePath("/leidingsportaal/admin/kalender");
    revalidatePath("/");

    return updatedEvent;
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event");
  }
}

export async function deleteEvent(id: number): Promise<void> {
  await requireAdminAuth();

  try {
    await db.delete(events).where(eq(events.id, id));

    revalidatePath("/leidingsportaal/admin/kalender");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Failed to delete event");
  }
}
