import { isLeiding, isLoggedIn } from "~/lib/auth";
import {
  createEventSchema,
  type UpdateEventData,
  type CreateEventData,
  updateEventSchema,
} from "../schemas/event-schemas";
import { AuthenticationError, AuthorizationError } from "~/lib/errors";
import { db } from "../db";
import { events } from "../db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, gte } from "drizzle-orm";

/**
 * Create a new event.
 *
 * @param data The event data.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws A ZodError if the event data is invalid.
 * @throws If the event could not be added.
 */
export async function createEvent(data: CreateEventData) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isLeiding()) {
    throw new AuthorizationError();
  }

  createEventSchema.parse(data);

  await db
    .insert(events)
    .values({
      ...data,
      createdBy: auth().userId!,
    })
    .execute();
}

/**
 * Updates an event.
 *
 * @param id The id of the event to update.
 * @param data The new event data.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws A ZodError if the event data is invalid.
 * @throws If the event could not be updated.
 */
export async function updateEvent(id: number, data: UpdateEventData) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isLeiding()) {
    throw new AuthorizationError();
  }

  updateEventSchema.parse(data);

  await db.update(events).set(data).where(eq(events.id, id)).execute();
}

/**
 * Deletes an event.
 *
 * @param id The id of the event to delete.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws If the event could not be deleted.
 */
export async function deleteEvent(id: number) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isLeiding()) {
    throw new AuthorizationError();
  }

  await db.delete(events).where(eq(events.id, id));
}

/**
 * Get all events.
 *
 * @returns All events.
 */
export async function getAllEvents() {
  return db.query.events.findMany();
}

/**
 * Get n upcoming (or currently happening) events.
 *
 * @returns The n closest to today events that haven't ended yet.
 */
export async function getUpcomingEvents(amount: number) {
  return db.query.events
    .findMany({
      where: gte(events.endDate, new Date()),
      orderBy: events.startDate,
      limit: amount,
    })
    .execute();
}
