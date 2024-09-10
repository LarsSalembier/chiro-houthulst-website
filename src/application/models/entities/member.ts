import { z } from "zod";
import { extraContactPersonSchema } from "../value-objects/extra-contact-person";
import { medicalInformationSchema } from "../value-objects/medical-information";
import { nameSchema } from "../value-objects/name";
import { phoneNumberSchema } from "../value-objects/phone-number";

export const memberSchema = z.object({
  id: z.number().int().positive(),
  name: nameSchema,
  gender: z.enum(["M", "F", "X"]),
  dateOfBirth: z.date(),
  emailAddress: z.string().email().optional(),
  phoneNumber: phoneNumberSchema.optional(),
  permissionPhotos: z.boolean(),
  extraContactPerson: extraContactPersonSchema,
  medicalInformation: medicalInformationSchema,
});
