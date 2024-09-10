import { z } from "zod";
import { dateRangeSchema } from "../value-objects/date-range";

export const eventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().optional(),
  dateRange: dateRangeSchema,
  location: z.string().optional(),
  facebookEventUrl: z.string().url().optional(),
  eventType: z.enum([
    "CHIRO",
    "SPECIAL_CHIRO",
    "MEMBER_EVENT",
    "PUBLIC_EVENT",
    "CAMP",
  ]),
});
