import { z } from "zod";

export const createGeneralPractitionerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Voornaam is te kort.")
    .max(255, "Voornaam is te lang."),
  lastName: z
    .string()
    .trim()
    .min(2, "Achternaam is te kort.")
    .max(255, "Achternaam is te lang."),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^\d{3} \d{2} \d{2} \d{2}$/,
      "Geef een geldig telefoonnummer in in het formaat 051 12 34 56.",
    ),
});

export type CreateGeneralPractitionerData = z.infer<
  typeof createGeneralPractitionerSchema
>;

export const updateGeneralPractitionerSchema = createGeneralPractitionerSchema;

export type UpdateGeneralPractitionerData = z.infer<
  typeof updateGeneralPractitionerSchema
>;
