import { z } from "zod";

export const eventTypeEnumValues = [
  "CHIRO",
  "SPECIAL_CHIRO",
  "MEMBER_EVENT",
  "PUBLIC_EVENT",
  "CAMP",
] as const;

export const eventTypeEnumSchema = z.enum(eventTypeEnumValues);

export type EventType = z.infer<typeof eventTypeEnumSchema>;
