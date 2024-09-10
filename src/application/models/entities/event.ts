import { z } from "zod";
import { eventTypeEnumSchema } from "../enums/event-type";

export const eventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().optional(),
  facebookEventUrl: z.string().url().optional(),
  eventType: eventTypeEnumSchema,
  price: z.number().optional(),
  canSignUp: z.boolean(),
  signUpDeadline: z.date().optional(),
  flyerUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  groupNames: z.array(z.string()),
});

export type Event_ = z.infer<typeof eventSchema>;

export const eventInsertSchema = eventSchema.omit({
  id: true,
});

export type EventInsert = z.infer<typeof eventInsertSchema>;
