import { z } from "zod";
import { nameSchema } from "../value-objects/name";
import { phoneNumberSchema } from "../value-objects/phone-number";
import { type RecursivePartial } from "~/types/recursive-partial";

export const emergencyContactSchema = z.object({
  memberId: z.number().int().positive(),
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  relationship: z.string().nullable(),
});

export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

export const emergencyContactInsertSchema = emergencyContactSchema;

export type EmergencyContactInsert = z.infer<
  typeof emergencyContactInsertSchema
>;

export type EmergencyContactUpdate = RecursivePartial<
  Omit<z.infer<typeof emergencyContactInsertSchema>, "memberId">
>;
