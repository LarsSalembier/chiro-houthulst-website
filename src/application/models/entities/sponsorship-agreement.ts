import { z } from "zod";
import { paymentMethodEnumSchema } from "../enums/payment-method";
import { sponsorSchema } from "../value-objects/sponsor";

export const sponsorshipAgreementSchema = z.object({
  sponsor: sponsorSchema,
  workYearId: z.number().int().positive(),
  amount: z.number().positive(),
  paymentReceived: z.boolean(),
  paymentMethod: paymentMethodEnumSchema.optional(),
  paymentDate: z.date().optional(),
});

export type SponsorshipAgreement = z.infer<typeof sponsorshipAgreementSchema>;

export const sponsorshipAgreementInsertSchema = sponsorshipAgreementSchema;

export type SponsorshipAgreementInsert = z.infer<
  typeof sponsorshipAgreementInsertSchema
>;
