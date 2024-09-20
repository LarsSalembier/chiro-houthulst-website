import { z } from "zod";
import { paymentMethodEnumSchema } from "../enums/payment-method";

export const eventRegistrationSchema = z.object({
  memberId: z.number().int().positive(),
  paymentReceived: z.boolean(),
  paymentMethod: paymentMethodEnumSchema.nullable(),
  paymentDate: z.date().nullable(),
});

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;
