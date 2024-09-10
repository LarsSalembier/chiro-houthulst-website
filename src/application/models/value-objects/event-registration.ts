import { z } from "zod";
import { paymentMethodEnumSchema } from "../enums/payment-method";

export const eventRegistrationSchema = z.object({
  memberId: z.number().int().positive(),
  paymentReceived: z.boolean(),
  paymentMethod: paymentMethodEnumSchema.optional(),
  paymentDate: z.date().optional(),
});

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;
