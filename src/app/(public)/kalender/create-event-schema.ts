import { z } from "zod";

export const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Titel is te kort.")
    .max(50, "Titel is te lang."),
  description: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(10, "Beschrijving is te kort.")
      .max(500, "Beschrijving is te lang.")
      .optional(),
  ),
  startDate: z.date({
    required_error: "Geef een geldige startdatum in.",
  }),
  endDate: z.date({
    required_error: "Geef een geldige einddatum in.",
  }),
  location: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(3, "Geef een locatie in.")
      .max(256, "Locatie is te lang.")
      .optional(),
  ),
  facebookEventUrl: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(10, "Geef een geldige Facebook-evenement URL in.")
      .max(256, "URL is te lang.")
      .url("Geef een geldige URL in.")
      .optional(),
  ),
  eventType: z
    .string()
    .min(3, "Geef een geldig evenementtype in.")
    .max(50, "Evenementtype is te lang."),
});
