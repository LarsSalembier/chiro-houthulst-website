import { z } from "zod";

export const createWorkyearSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Naam is te kort.")
    .max(255, "Naam is te lang."),
  startDate: z.date({
    required_error: "Geef een geldige startdatum in.",
  }),
  endDate: z.date({
    required_error: "Geef een geldige einddatum in.",
  }),
});

export type CreateWorkyearData = z.infer<typeof createWorkyearSchema>;

export const updateWorkyearSchema = createWorkyearSchema;

export type UpdateWorkyearData = z.infer<typeof updateWorkyearSchema>;
