import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().email(),
  role: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.omit({ id: true });

export type CreateUser = z.infer<typeof createUserSchema>;
