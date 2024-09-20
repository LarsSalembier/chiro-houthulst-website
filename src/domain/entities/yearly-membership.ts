import { z } from "zod";
import { paymentMethodEnumSchema } from "../enums/payment-method";

export const yearlyMembershipSchema = z.object({
  memberId: z.number().int().positive(),
  groupId: z.number().int().positive(),
  workYearId: z.number().int().positive(),
  paymentReceived: z.boolean(),
  paymentMethod: paymentMethodEnumSchema.nullable(),
  paymentDate: z.date().nullable(),
});

export type YearlyMembership = z.infer<typeof yearlyMembershipSchema>;

export const yearlyMembershipInsertSchema = yearlyMembershipSchema;

export type YearlyMembershipInsert = z.infer<
  typeof yearlyMembershipInsertSchema
>;
