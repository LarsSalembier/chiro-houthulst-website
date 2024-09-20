import { z } from "zod";
import { nameSchema } from "../value-objects/name";
import { phoneNumberSchema } from "../value-objects/phone-number";
import { genderEnumSchema } from "../enums/gender";
import { type RecursivePartial } from "~/types/recursive-partial";

export const selectMemberSchema = z.object({
  id: z.number().int().positive(),
  name: nameSchema,
  gender: genderEnumSchema,
  dateOfBirth: z.date(),
  emailAddress: z.string().email().nullable(),
  phoneNumber: phoneNumberSchema.nullable(),
  gdprPermissionToPublishPhotos: z.boolean(),
});

export type Member = z.infer<typeof selectMemberSchema>;

export const insertMemberSchema = selectMemberSchema.omit({ id: true });

export type MemberInsert = z.infer<typeof insertMemberSchema>;

export type MemberUpdate = RecursivePartial<MemberInsert>;
