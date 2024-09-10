import { z } from "zod";
import { paymentMethodEnumSchema } from "../enums/payment-method";

export const yearlyMembershipSchema = z.object({
  groupName: z.string(),
  workYearId: z.number().int().positive(),
  paymentReceived: z.boolean(),
  paymentMethod: paymentMethodEnumSchema.optional(),
  paymentDate: z.date().optional(),
});
