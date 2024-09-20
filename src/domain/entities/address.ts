import { z } from "zod";

export const addressSchema = z.object({
  id: z.number().int().positive(),
  street: z.string(),
  houseNumber: z.string(),
  box: z.string().nullable(),
  municipality: z.string(),
  postalCode: z.number().int().positive(),
});

export type Address = z.infer<typeof addressSchema>;

export const addressInsertSchema = addressSchema.omit({
  id: true,
});

export type AddressInsert = z.infer<typeof addressInsertSchema>;
