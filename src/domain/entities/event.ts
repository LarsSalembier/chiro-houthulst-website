import { z } from "zod";
import { eventTypeEnumSchema } from "../enums/event-type";

export const eventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().nullable(),
  facebookEventUrl: z.string().url().nullable(),
  eventType: eventTypeEnumSchema,
  price: z.number().nullable(),
  canSignUp: z.boolean(),
  signUpDeadline: z.date().nullable(),
  flyerUrl: z.string().url().nullable(),
  coverImageUrl: z.string().url().nullable(),
});

export type Event_ = z.infer<typeof eventSchema>;

export const eventInsertSchema = eventSchema.omit({
  id: true,
});

export type EventInsert = z.infer<typeof eventInsertSchema>;

export type EventUpdate = Partial<EventInsert>;
