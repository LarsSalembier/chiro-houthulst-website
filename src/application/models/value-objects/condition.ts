import { z } from "zod";

export const conditionSchema = z.object({
  hasCondition: z.boolean(),
  info: z.string().optional(),
});
