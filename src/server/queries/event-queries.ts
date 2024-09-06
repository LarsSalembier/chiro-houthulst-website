import { isLeiding, isLoggedIn } from "~/lib/auth";
import {
  createEventSchema,
  type UpdateEventData,
  type CreateEventData,
  updateEventSchema,
} from "../schemas/event-schemas";
import { AuthenticationError, AuthorizationError } from "~/lib/errors";
import { db } from "../db";
import { auditLogs, events } from "../db/schema";
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
 *
 * @returns The newly created event.
 */
export async function createEvent(data: CreateEventData) {
  if (!isLoggedIn()) throw new AuthenticationError();
  if (!isLeiding()) throw new AuthorizationError();

  createEventSchema.parse(data);

  const newEvent = await db.transaction(async (tx) => {
    const [event] = await tx.insert(events).values(data).returning();

    if (event) {
      await tx.insert(auditLogs).values({
        tableName: "events",
        recordId: event.id,
        action: "INSERT",
        newValues: JSON.stringify(event),
        userId: auth().userId!,
        timestamp: new Date(),
      });
    }

    return event;
  });

  return newEvent;
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
 *
 * @returns The updated event.
 */
export async function updateEvent(id: number, data: UpdateEventData) {
  if (!isLoggedIn()) throw new AuthenticationError();
  if (!isLeiding()) throw new AuthorizationError();

  const fixedData = updateEventSchema.parse(data);

  // TODO: handle the case where we remove description, location, or facebookEventUrl
  // at the moment, this will not actually remove the field from the database

  const updatedEvent = await db.transaction(async (tx) => {
    const [oldEvent] = await tx.select().from(events).where(eq(events.id, id));
    const [event] = await tx
      .update(events)
      .set(fixedData)
      .where(eq(events.id, id))
      .returning();

    await tx.insert(auditLogs).values({
      tableName: "events",
      recordId: id,
      action: "UPDATE",
      oldValues: JSON.stringify(oldEvent),
      newValues: JSON.stringify(event),
      userId: auth().userId!,
      timestamp: new Date(),
    });

    return event;
  });

  return updatedEvent;
}

/**
 * Delete an event.
 *
 * @param id The id of the event to delete.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws If the event could not be deleted.
 */
export async function deleteEvent(id: number) {
  if (!isLoggedIn()) throw new AuthenticationError();
  if (!isLeiding()) throw new AuthorizationError();

  await db.transaction(async (tx) => {
    const [oldEvent] = await tx.select().from(events).where(eq(events.id, id));
    await tx.delete(events).where(eq(events.id, id));

    await tx.insert(auditLogs).values({
      tableName: "events",
      recordId: id,
      action: "DELETE",
      oldValues: JSON.stringify(oldEvent),
      userId: auth().userId!,
      timestamp: new Date(),
    });
  });
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
