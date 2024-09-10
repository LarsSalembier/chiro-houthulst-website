import { z } from "zod";
import { genderEnumSchema } from "../enums/gender";

export const selectGroupSchema = z.object({
  name: z.string(),
  color: z.string().optional(),
  description: z.string().optional(),
  minBirthDate: z.date().optional(),
  maxBirthDate: z.date().optional(),
  gender: genderEnumSchema.optional(),
  mascotImageUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  workYearId: z.number().int().positive(),
});

export type Group = z.infer<typeof selectGroupSchema>;

export const insertGroupSchema = selectGroupSchema;

export type GroupInsert = z.infer<typeof insertGroupSchema>;
