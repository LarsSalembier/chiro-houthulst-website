import { isLeiding, isLoggedIn } from "~/utils/auth";
import {
  createEventSchema,
  type CreateEventData,
} from "../schemas/create-event-schema";
import { AuthenticationError, AuthorizationError } from "~/utils/errors";
import { db } from "../db";
import { events } from "../db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

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