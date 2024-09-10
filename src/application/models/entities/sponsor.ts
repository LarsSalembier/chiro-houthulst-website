import { z } from "zod";
import { nameSchema } from "../value-objects/name";
import { addressSchema } from "../value-objects/address";
import { phoneNumberSchema } from "../value-objects/phone-number";

export const sponsorSchema = z.object({
  id: z.number().int().positive(),
  companyName: z.string(),
  companyOwnerName: nameSchema.optional(),
  address: addressSchema.optional(),
  phoneNumber: phoneNumberSchema.optional(),
  emailAddress: z.string().email().optional(),
  websiteUrl: z.string().url().optional(),
  amount: z.number().positive(),
  logoUrl: z.string().url().optional(),
  paid: z.boolean(),
});
