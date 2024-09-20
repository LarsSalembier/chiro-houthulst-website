import { z } from "zod";
import { paymentMethodEnumSchema } from "../enums/payment-method";

export const sponsorshipAgreementSchema = z.object({
  sponsorId: z.number().int().positive(),
  workYearId: z.number().int().positive(),
  amount: z.number().positive(),
  paymentReceived: z.boolean(),
  paymentMethod: paymentMethodEnumSchema.nullable(),
  paymentDate: z.date().nullable(),
});

export type SponsorshipAgreement = z.infer<typeof sponsorshipAgreementSchema>;

export const sponsorshipAgreementInsertSchema = sponsorshipAgreementSchema;

export type SponsorshipAgreementInsert = z.infer<
  typeof sponsorshipAgreementInsertSchema
>;

export type SponsorshipAgreementUpdate = Partial<
  Omit<SponsorshipAgreementInsert, "sponsorId" | "workYearId">
>;
