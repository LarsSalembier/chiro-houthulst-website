"use server";

import {
  type UpdateEventData,
  type CreateEventData,
} from "../../../server/schemas/event-schemas";
import { revalidatePath } from "next/cache";
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "~/server/queries/event-queries";

/**
 * Adds an event to the calendar, and revalidates the calendar page.
 *
 * @param values The data of the event to add.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws A ZodError if the event data is invalid.
 * @throws If the event could not be created.
 */
export async function createEventAndRevalidate(values: CreateEventData) {
  await createEvent(values);

  revalidatePath("/kalender");
}

/**
 * Updates an event in the calendar, and revalidates the calendar page.
 *
 * @param eventId The id of the event to update.
 * @param values The new data of the event.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws A ZodError if the event data is invalid.
 * @throws If the event could not be updated.
 */
export async function updateEventAndRevalidate(
  eventId: number,
  values: UpdateEventData,
) {
  await updateEvent(eventId, values);

  revalidatePath("/kalender");
}

/**
 * Deletes an event from the calendar, and revalidates the calendar page.
 *
 * @param eventId The id of the event to delete.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws If the event could not be deleted.
 */
export async function deleteEventAndRevalidate(eventId: number) {
  await deleteEvent(eventId);

  revalidatePath("/kalender");
}
