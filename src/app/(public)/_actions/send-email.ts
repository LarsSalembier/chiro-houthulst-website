"use server";

import { Resend } from "resend";
import { env } from "~/env";
import ContactFormEmail from "~/components/contact-form-email";
import React from "react";

interface EmailData {
  name: string;
  email: string;
  message: string;
}

const emailConfig = {
  from: "Contactformulier website <contact@chirohouthulst.be>",
  to: "chiro.houthulst@hotmail.com",
  subject: "Nieuw bericht via contactformulier",
};

const sendEmail = async (emailData: EmailData): Promise<void> => {
  try {
    const resend = new Resend(env.RESEND_API_KEY);

    await resend.emails.send({
      ...emailConfig,
      reply_to: emailData.email,
      react: React.createElement(ContactFormEmail, emailData),
    });
  } catch (error) {
    // Handle errors appropriately (e.g., logging, user feedback)
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
