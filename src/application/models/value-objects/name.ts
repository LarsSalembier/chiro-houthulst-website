import { z } from "zod";

export const nameSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});
