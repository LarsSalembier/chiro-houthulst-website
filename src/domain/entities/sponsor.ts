import { z } from "zod";
import { nameSchema } from "../value-objects/name";
import { phoneNumberSchema } from "../value-objects/phone-number";
import { type RecursivePartial } from "~/types/recursive-partial";
import {
  MAX_COMPANY_NAME_LENGTH,
  MAX_EMAIL_ADDRESS_LENGTH,
  MAX_URL_LENGTH,
} from "drizzle/schema";

export const sponsorSchema = z.object({
  id: z.number().int().positive(),
  companyName: z.string().trim().min(3).max(MAX_COMPANY_NAME_LENGTH),
  companyOwnerName: nameSchema.nullable(),
  addressId: z.number().int().positive().nullable(),
  phoneNumber: phoneNumberSchema.nullable(),
  emailAddress: z
    .string()
    .email()
    .trim()
    .toLowerCase()
    .min(3)
    .max(MAX_EMAIL_ADDRESS_LENGTH)
    .nullable(),
  websiteUrl: z.string().url().trim().min(3).max(MAX_URL_LENGTH).nullable(),
  logoUrl: z.string().url().trim().min(3).max(MAX_URL_LENGTH).nullable(),
});

export type Sponsor = z.infer<typeof sponsorSchema>;

export const sponsorInsertSchema = sponsorSchema.omit({ id: true });

export type SponsorInsert = z.infer<typeof sponsorInsertSchema>;

export type SponsorUpdate = RecursivePartial<SponsorInsert>;
