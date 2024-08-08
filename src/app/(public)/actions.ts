"use server";

import { auth } from "@clerk/nextjs/server";
import React from "react";
import { Resend } from "resend";
import { type z } from "zod";
import ContactFormEmail from "~/components/email/contact-form-email";
import { env } from "~/env";
import { AuthenticationError, AuthorizationError } from "~/repository/errors";
import { hasRole } from "~/utils/roles";
import { db } from "~/server/db";
import { sponsors } from "~/server/db/schema";
import { type createSponsorSchema } from "./sponsor-schemas";

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
  const user = auth().userId;
  if (!user) {
    throw new AuthenticationError();
  }
  if (hasRole("admin")) {
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
};
