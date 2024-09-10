import { z } from "zod";
import { nameSchema } from "./name";
import { addressSchema } from "./address";
import { phoneNumberSchema } from "./phone-number";

export const sponsorSchema = z.object({
  companyName: z.string(),
  companyOwnerName: nameSchema.optional(),
  address: addressSchema.optional(),
  phoneNumber: phoneNumberSchema.optional(),
  emailAddress: z.string().email().optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
});
