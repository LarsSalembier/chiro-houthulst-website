"use server";

import { AuthenticationError, AuthorizationError } from "~/utils/errors";
import { isAdmin, isLeiding, isLoggedIn } from "~/utils/auth";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { type Role } from "types/globals";
import { type z } from "zod";
import { createEventSchema } from "~/app/(public)/kalender/create-event-schema";
import { db } from "./db";
import { events, type Sponsor, sponsors } from "./db/schema";
import { and, between, eq, gt, isNotNull, lt } from "drizzle-orm";
import { type createSponsorSchema } from "~/app/(public)/sponsor-schemas";
import { Resend } from "resend";
import { env } from "~/env";
import React from "react";
import ContactFormEmail from "~/components/email/contact-form-email";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUser(userId: string) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isAdmin()) {
    throw new AuthorizationError();
  }

  await clerkClient.users.deleteUser(userId);

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

export async function setRole(userId: string, role: Role) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isAdmin()) {
    throw new AuthorizationError();
  }

  await clerkClient.users.updateUser(userId, {
    publicMetadata: { role },
  });

  revalidatePath("/admin/accounts");
}

export async function getUsersByQuery(query?: string) {
  return query
    ? (await clerkClient.users.getUserList({ query })).data
    : (await clerkClient.users.getUserList()).data;
}

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
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isLeiding()) {
    throw new AuthorizationError();
  }

  await db.delete(events).where(eq(events.id, id));

  revalidatePath("/kalender");
  redirect("/kalender");
}

const SPONSORSHIP_START_DATE = new Date(2023, 9, 1);
const SPONSORSHIP_END_DATE = new Date(2024, 8, 31);

/**
 * Adds a sponsor.
 *
 * @param data The sponsor data.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not an admin.
 * @throws A ZodError if the sponsor data is invalid.
 * @throws If the sponsor could not be added.
 */
export async function addSponsor(data: z.infer<typeof createSponsorSchema>) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isLeiding()) {
    throw new AuthorizationError();
  }

  await db
    .insert(sponsors)
    .values({
      ...data,
      startDate: SPONSORSHIP_START_DATE,
      endDate: SPONSORSHIP_END_DATE,
    })
    .execute();

  revalidatePath("/");
  redirect("/");
}

/**
 * Sends an email from the contact form.
 *
 * @param emailData The email data.
 *
 * @throws If the email could not be sent.
 */
export const sendEmailFromContactForm = async (emailData: {
  name: string;
  email: string;
  message: string;
}): Promise<void> => {
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Contactformulier website <contact@chirohouthulst.be>",
    to: "chiro.houthulst@hotmail.com",
    subject: "Nieuw bericht via contactformulier",
    reply_to: emailData.email,
    react: React.createElement(ContactFormEmail, emailData),
  });

  revalidatePath("/");
};

/**
 * Maps a sponsor to a sponsor DTO.
 *
 * @param sponsor The sponsor to map.
 *
 * @returns The sponsor DTO.
 * @throws If the sponsor does not have a logo URL.
 */
function toDtoMapper(sponsor: Sponsor) {
  if (!sponsor.logoUrl) {
    throw new Error("Sponsor should have a logo URL");
  }

  return {
    id: sponsor.id,
    companyName: sponsor.companyName,
    websiteUrl: sponsor.websiteUrl,
    logoUrl: sponsor.logoUrl,
  };
}

/**
 * Get sponsors in a certain amount range.
 *
 * @param minAmount The minimum amount.
 * @param maxAmount The maximum amount.
 *
 * @returns The sponsors that adhere to the following additional conditions:
 * - The sponsor has a logo URL.
 * - The sponsor has paid.
 * - The sponsor's start date is in the past.
 * - The sponsor's end date is in the future.
 * - The sponsor's amount is between the min and max amount.
 */
export async function getSponsorsInAmountRange(
  minAmount: number,
  maxAmount: number,
) {
  const foundSponsors = await db.query.sponsors.findMany({
    where: and(
      isNotNull(sponsors.logoUrl),
      eq(sponsors.paid, true),
      lt(sponsors.startDate, new Date()),
      gt(sponsors.endDate, new Date()),
      between(sponsors.amount, minAmount, maxAmount),
    ),
  });

  return foundSponsors.map(toDtoMapper);
}
