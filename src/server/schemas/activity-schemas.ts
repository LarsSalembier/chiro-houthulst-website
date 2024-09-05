import { z } from "zod";

export const createActivitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Naam is te kort.")
    .max(255, "Naam is te lang."),
  type: z.enum(["WORK_YEAR", "CAMP", "GROUP_EXERCISE"], {
    errorMap: () => ({ message: "Kies een geldig type activiteit." }),
  }),
  price: z.number().min(0, "Prijs moet positief zijn."),
  startDate: z.date({
    required_error: "Geef een geldige startdatum in.",
  }),
  endDate: z.date({
    required_error: "Geef een geldige einddatum in.",
  }),
  description: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(1000, "Beschrijving is te lang.").optional(),
  ),
  location: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Locatie is te lang.").optional(),
  ),
  maxParticipants: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .number()
      .int("Aantal deelnemers moet een geheel getal zijn.")
      .positive("Aantal deelnemers moet positief zijn.")
      .optional(),
  ),
});

export type CreateActivityData = z.infer<typeof createActivitySchema>;

export const updateActivitySchema = createActivitySchema;

export type UpdateActivityData = z.infer<typeof updateActivitySchema>;
