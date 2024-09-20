import { z } from "zod";
import { MAX_NAME_LENGTH } from "drizzle/schema";

export const nameSchema = z.object({
  firstName: z.string().trim().min(3).max(MAX_NAME_LENGTH),
  lastName: z.string().trim().min(3).max(MAX_NAME_LENGTH),
});
