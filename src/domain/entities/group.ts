import { z } from "zod";
import { genderEnumSchema } from "../enums/gender";
import {
  MAX_GROUP_COLOR_LENGTH,
  MAX_GROUP_NAME_LENGTH,
  MAX_URL_LENGTH,
} from "~/server/db/schema";

export const selectGroupSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(3).toLowerCase().max(MAX_GROUP_NAME_LENGTH),
  color: z.string().trim().min(1).max(MAX_GROUP_COLOR_LENGTH).nullable(),
  description: z.string().trim().min(3).nullable(),
  minimumAgeInDays: z.number().int().positive(),
  maximumAgeInDays: z.number().int().positive().nullable(),
  gender: genderEnumSchema.nullable(),
  active: z.boolean().default(true),
  mascotImageUrl: z.string().url().trim().min(3).max(MAX_URL_LENGTH).nullable(),
  coverImageUrl: z.string().url().trim().min(3).max(MAX_URL_LENGTH).nullable(),
});

export type Group = z.infer<typeof selectGroupSchema>;

export const insertGroupSchema = selectGroupSchema.omit({ id: true });

export type GroupInsert = z.infer<typeof insertGroupSchema>;

export type GroupUpdate = Partial<GroupInsert>;
