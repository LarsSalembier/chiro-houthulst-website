import { z } from "zod";
import { nameSchema } from "../value-objects/name";
import { phoneNumberSchema } from "../value-objects/phone-number";
import { type RecursivePartial } from "~/types/recursive-partial";

export const sponsorSchema = z.object({
  id: z.number().int().positive(),
  companyName: z.string(),
  companyOwnerName: nameSchema.nullable(),
  addressId: z.number().int().positive().nullable(),
  phoneNumber: phoneNumberSchema.nullable(),
  emailAddress: z.string().email().nullable(),
  websiteUrl: z.string().url().nullable(),
  logoUrl: z.string().url().nullable(),
});

export type Sponsor = z.infer<typeof sponsorSchema>;

export const sponsorInsertSchema = sponsorSchema.omit({ id: true });

export type SponsorInsert = z.infer<typeof sponsorInsertSchema>;

export type SponsorUpdate = RecursivePartial<SponsorInsert>;
