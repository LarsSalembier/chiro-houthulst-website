import { z } from "zod";
import {
  MAX_ADDRESS_BOX_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
  MAX_MUNICIPALITY_LENGTH,
  MAX_STREET_LENGTH,
} from "~/server/db/schema";

export const addressSchema = z.object({
  id: z.number().int().positive(),
  street: z.string().trim().min(3).max(MAX_STREET_LENGTH),
  houseNumber: z
    .string()
    .trim()
    .toUpperCase()
    .min(1)
    .max(MAX_HOUSE_NUMBER_LENGTH),
  box: z.string().trim().min(1).max(MAX_ADDRESS_BOX_LENGTH).nullable(),
  municipality: z.string().trim().min(1).max(MAX_MUNICIPALITY_LENGTH),
  postalCode: z.number().int().positive().min(1000).max(9999),
});

export type Address = z.infer<typeof addressSchema>;

export const addressInsertSchema = addressSchema.omit({
  id: true,
});

export type AddressInsert = z.infer<typeof addressInsertSchema>;
