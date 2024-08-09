"use server";

import { type CreateEventData } from "../../../server/schemas/create-event-schema";
import { toast } from "sonner";
import { format } from "date-fns";
import { nlBE } from "date-fns/locale";
import { AuthenticationError, AuthorizationError } from "~/utils/errors";
import { revalidatePath } from "next/cache";
import { createEvent, deleteEvent } from "~/server/queries/event-queries";

/**
 * Adds an event to the calendar, and revalidates the calendar page. Also shows
 * a toast message on success or error.
 *
 * @param values The data of the event to add.
 */
export async function addEventAndRevalidateCalendar(values: CreateEventData) {
  try {
    await createEvent(values);
    toast.success(
      `${values.title} (${format(values.startDate, "PPP HH:mm", {
        locale: nlBE,
      })}) succesvol toegevoegd aan de kalender.`,
    );
  } catch (error) {
    if (error instanceof AuthenticationError) {
      toast.error("Je bent niet ingelogd.");
    } else if (error instanceof AuthorizationError) {
      toast.error("Je hebt geen toestemming om een evenement toe te voegen.");
    } else {
      toast.error(
        `Er is een fout opgetreden bij het toevoegen van ${values.title} (${format(
          values.startDate,
          "PPP HH:mm",
          { locale: nlBE },
        )}) aan de kalender.`,
      );
    }

    console.error(`Error adding event ${values.title}:`, error);
  }

  revalidatePath("/kalender");
}

/**
 * Deletes an event from the calendar, and revalidates the calendar page. Also
 * shows a toast message on success or error.
 *
 * @param eventId The id of the event to delete.
 */
export async function deleteEventAndRevalidateCalendar(eventId: number) {
  try {
    await deleteEvent(eventId);
    toast.success("Evenement succesvol verwijderd van de kalender.");
  } catch (error) {
    if (error instanceof AuthenticationError) {
      toast.error("Je bent niet ingelogd.");
    } else if (error instanceof AuthorizationError) {
      toast.error("Je hebt geen toestemming om een evenement te verwijderen.");
    } else {
      toast.error(
        "Er is een fout opgetreden bij het verwijderen van het evenement.",
      );
    }

    console.error(`Error removing event with id ${eventId}:`, error);
  }

  revalidatePath("/kalender");
}
