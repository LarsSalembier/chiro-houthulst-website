import { z } from "zod";
import { nameSchema } from "../value-objects/name";
import { phoneNumberSchema } from "../value-objects/phone-number";
import { parentRelationshipEnumSchema } from "../enums/parent-relationship";
import { type RecursivePartial } from "~/types/recursive-partial";
import { MAX_EMAIL_ADDRESS_LENGTH } from "drizzle/schema";

export const parentSchema = z.object({
  id: z.number().int().positive(),
  emailAddress: z
    .string()
    .trim()
    .min(3)
    .max(MAX_EMAIL_ADDRESS_LENGTH)
    .toLowerCase()
    .email(),
  relationship: parentRelationshipEnumSchema,
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  addressId: z.number().int().positive(),
});

export type Parent = z.infer<typeof parentSchema>;

export const parentInsertSchema = parentSchema.omit({ id: true });

export type ParentInsert = z.infer<typeof parentInsertSchema>;

export type ParentUpdate = RecursivePartial<ParentInsert>;
