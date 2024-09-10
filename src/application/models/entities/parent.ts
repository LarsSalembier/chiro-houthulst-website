import { z } from "zod";
import { addressSchema } from "../value-objects/address";
import { nameSchema } from "../value-objects/name";
import { phoneNumberSchema } from "../value-objects/phone-number";
import { parentRelationshipEnumSchema } from "../enums/parent-relationship";

export const parentSchema = z.object({
  emailAddress: z.string().email(),
  relationship: parentRelationshipEnumSchema,
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  address: addressSchema,
});

export type Parent = z.infer<typeof parentSchema>;

export const parentInsertSchema = parentSchema;

export type ParentInsert = z.infer<typeof parentInsertSchema>;
