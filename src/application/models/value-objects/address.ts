import { z } from "zod";

export const addressSchema = z.object({
  street: z.string(),
  houseNumber: z.string(),
  box: z.string().optional(),
  municipality: z.string(),
  postalCode: z.string(),
});
