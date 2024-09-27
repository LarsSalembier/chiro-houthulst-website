import { z } from "zod";
import { paymentMethodEnumSchema } from "../enums/payment-method";

export const eventRegistrationSchema = z.object({
  eventId: z.number().int().positive(),
  memberId: z.number().int().positive(),
  paymentReceived: z.boolean(),
  paymentMethod: paymentMethodEnumSchema.nullable(),
  paymentDate: z.date().nullable(),
});

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;

export const eventRegistrationInsertSchema = eventRegistrationSchema;

export type EventRegistrationInsert = z.infer<
  typeof eventRegistrationInsertSchema
>;

export const eventRegistrationUpdateSchema = eventRegistrationSchema.omit({
  eventId: true,
  memberId: true,
});

export type EventRegistrationUpdate = z.infer<
  typeof eventRegistrationUpdateSchema
>;
