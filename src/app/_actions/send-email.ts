"use server";

import { Resend } from "resend";
import { env } from "~/env";

import ContactFormEmail from "~/components/contact-form-email";
import React from "react";

const resend = new Resend(env.RESEND_API_KEY);

type InputData = {
  name: string;
  email: string;
  message: string;
};

export const sendEmail = async (input: InputData) => {
  await resend.emails.send({
    from: "Contactformulier website <contact@chirohouthulst.be>",
    to: "lars.salembier@gmail.com",
    subject: "Nieuw bericht via contactformulier",
    reply_to: input.email,
    react: React.createElement(ContactFormEmail, {
      name: input.name,
      email: input.email,
      message: input.message,
    }),
  });
};
