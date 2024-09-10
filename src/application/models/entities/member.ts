import { z } from "zod";
import { medicalInformationSchema } from "../value-objects/medical-information";
import { nameSchema } from "../value-objects/name";
import { phoneNumberSchema } from "../value-objects/phone-number";
import { addressSchema } from "../value-objects/address";
import { genderEnumSchema } from "../enums/gender";
import { emergencyContactSchema } from "../value-objects/emergency-contact";

export const selectMemberSchema = z.object({
  id: z.number().int().positive(),
  name: nameSchema,
  gender: genderEnumSchema,
  dateOfBirth: z.date(),
  emailAddress: z.string().email().optional(),
  phoneNumber: phoneNumberSchema.optional(),
  address: addressSchema,
  gdprPermissionToPublishPhotos: z.boolean(),
  emergencyContacts: z.array(emergencyContactSchema),
  medicalInformation: medicalInformationSchema,
});

export type Member = z.infer<typeof selectMemberSchema>;

export const insertMemberSchema = selectMemberSchema.omit({ id: true });

export type MemberInsert = z.infer<typeof insertMemberSchema>;
