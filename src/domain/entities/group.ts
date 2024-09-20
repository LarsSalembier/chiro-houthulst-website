import { z } from "zod";
import { genderEnumSchema } from "../enums/gender";

export const selectGroupSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  color: z.string().nullable(),
  description: z.string().nullable(),
  minimumAgeInDays: z.number().int().positive(),
  maximumAgeInDays: z.number().int().positive().nullable(),
  gender: genderEnumSchema.nullable(),
  active: z.boolean(),
  mascotImageUrl: z.string().url().nullable(),
  coverImageUrl: z.string().url().nullable(),
});

export type Group = z.infer<typeof selectGroupSchema>;

export const insertGroupSchema = selectGroupSchema.omit({ id: true });

export type GroupInsert = z.infer<typeof insertGroupSchema>;

export type GroupUpdate = Partial<GroupInsert>;
