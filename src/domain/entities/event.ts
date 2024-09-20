import { z } from "zod";
import { eventTypeEnumSchema } from "../enums/event-type";
import {
  MAX_EVENT_LOCATION_LENGTH,
  MAX_EVENT_TITLE_LENGTH,
  MAX_URL_LENGTH,
} from "~/server/db/schema";

export const eventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(3).max(MAX_EVENT_TITLE_LENGTH),
  description: z.string().trim().min(3).nullable(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().trim().min(3).max(MAX_EVENT_LOCATION_LENGTH).nullable(),
  facebookEventUrl: z
    .string()
    .url()
    .trim()
    .min(3)
    .max(MAX_URL_LENGTH)
    .nullable(),
  eventType: eventTypeEnumSchema,
  price: z.number().positive().max(10000).nullable(),
  canSignUp: z.boolean().default(false),
  signUpDeadline: z.date().nullable(),
  flyerUrl: z.string().url().trim().min(3).max(MAX_URL_LENGTH).nullable(),
  coverImageUrl: z.string().url().trim().min(3).max(MAX_URL_LENGTH).nullable(),
});

export type Event_ = z.infer<typeof eventSchema>;

export const eventInsertSchema = eventSchema.omit({
  id: true,
});

export type EventInsert = z.infer<typeof eventInsertSchema>;

export type EventUpdate = Partial<EventInsert>;
