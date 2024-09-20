import { z } from "zod";

export const conditionSchema = z.object({
  hasCondition: z.boolean(),
  info: z.string().trim().min(3).nullable(),
});
