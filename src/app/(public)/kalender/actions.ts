"use server";

import { type z } from "zod";
import { createEventSchema } from "./create-event-schema";
import { auth } from "@clerk/nextjs/server";
import { AuthenticationError, AuthorizationError } from "~/repository/errors";
import { hasRole } from "~/utils/roles";
import { db } from "~/server/db";
import { events } from "~/server/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

/**
 * Adds an event.
 *
 * @param data The event data.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws A ZodError if the event data is invalid.
 * @throws If the event could not be added.
 */
export async function addEvent(data: z.infer<typeof createEventSchema>) {
  const user = auth().userId;

  if (!user) {
    throw new AuthenticationError();
  }

  if (!hasRole("leiding") && !hasRole("admin")) {
    throw new AuthorizationError();
  }

  createEventSchema.parse(data);

  await db
    .insert(events)
    .values({
      ...data,
      createdBy: user,
    })
    .execute();

  revalidatePath("/kalender");
  redirect("/kalender");
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
  const user = auth().userId;

  if (!user) {
    throw new AuthenticationError();
  }

  if (!hasRole("leiding") && !hasRole("admin")) {
    throw new AuthorizationError();
  }

  await db.delete(events).where(eq(events.id, id));

  revalidatePath("/kalender");
  redirect("/kalender");
}
