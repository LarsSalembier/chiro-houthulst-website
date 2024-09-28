import { z } from "zod";

export const decisionEnumValues = ["YES", "NO"] as const;

export const decisionEnumSchema = z.enum(decisionEnumValues, {
  message: "Kies een van de opties",
});

export type Decision = z.infer<typeof decisionEnumSchema>;
