import { Resend } from "resend";
import { env } from "~/env";
import React from "react";
import ContactFormEmail from "~/components/email/contact-form-email";

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
