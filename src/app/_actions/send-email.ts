"use server";

import { Resend } from "resend";
import { env } from "~/env";

import ContactFormEmail from "~/components/contact-form-email";
import React from "react";
import { z } from "zod";

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (
  prevState: { state: string; message: string },
  formData: FormData,
) => {
  const schema = z.object({
    message: z
      .string()
      .min(1, "Gelieve een bericht in te vullen.")
      .max(1000, "Bericht is te lang."),
    email: z.string().email("Gelieve een geldig emailadres in te vullen."),
    name: z
      .string()
      .min(1, "Gelieve een naam in te vullen.")
      .max(100, "Naam is te lang."),
  });

  const input = {
    message: formData.get("message"),
    email: formData.get("email"),
    name: formData.get("name"),
  };

  const parse = schema.safeParse(input);

  if (!parse.success) {
    return {
      state: "error",
      message: parse.error.errors.map((error) => error.message).join(" "),
    };
  }

  const data = parse.data;

  try {
    await resend.emails.send({
      from: "Contactformulier website <onboarding@resend.dev>",
      to: "chirohouthulst@hotmail.com",
      subject: "Nieuw bericht via contactformulier",
      reply_to: data.email,
      react: React.createElement(ContactFormEmail, {
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });
  } catch (error) {
    return {
      state: "error",
      message: "Er is een fout opgetreden bij het versturen van het bericht.",
    };
  }

  return {
    state: "success",
    message: "Bericht is succesvol verstuurd.",
  };
};
