import { z } from "zod";

export const createSponsorSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Vul de bedrijfsnaam in.")
    .max(256, "Bedrijfsnaam is te lang."),
  companyOwnerName: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(2, "Vul de naam van de zaakvoerder in.")
      .max(256, "Naam is te lang.")
      .optional(),
  ),
  municipality: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(2, "Vul de gemeente in.")
      .max(256, "Gemeente is te lang.")
      .optional(),
  ),
  postalCode: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(/^\d{4}$/, "Geef een geldige postcode in.")
      .optional(),
  ),
  street: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(2, "Vul de straatnaam in.")
      .max(256, "Straatnaam is te lang.")
      .optional(),
  ),
  number: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(10, "Huisnummer is te lang.").optional(),
  ),
  landline: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(
        /^\d{3} \d{2} \d{2} \d{2}$/,
        "Geef een geldig telefoonnummer in in het formaat 051 12 34 56.",
      )
      .optional(),
  ),
  mobile: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(
        /^\d{4} \d{2} \d{2} \d{2}$/,
        "Geef een geldig telefoonnummer in in het formaat 0495 12 34 56.",
      )
      .optional(),
  ),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .email("Geef een geldig emailadres in.")
      .max(256, "Emailadres is te lang.")
      .optional(),
  ),
  websiteUrl: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .url("Geef een geldige URL in.")
      .max(256, "URL is te lang.")
      .optional(),
  ),
  amount: z.preprocess(
    (val) => (Number.isNaN(val) ? undefined : Number(val)),
    z.number().min(0, "Bedrag moet positief zijn."),
  ),
  logoUrl: z
    .string()
    .trim()
    .url("Geef een geldige URL in.")
    .max(256, "URL is te lang."),
  paid: z.boolean(),
});

export type CreateSponsorData = z.infer<typeof createSponsorSchema>;

export const updateSponsorSchema = createSponsorSchema;

export type UpdateSponsorData = z.infer<typeof updateSponsorSchema>;
