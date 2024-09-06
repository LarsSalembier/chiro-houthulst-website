import { z } from "zod";

export const createAddressSchema = z.object({
  street: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(3, "Straatnaam is te kort.")
      .max(255, "Straatnaam is te lang."),
  ),
  houseNumber: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(1, "Huisnummer is te kort.")
      .max(10, "Huisnummer is te lang."),
  ),
  box: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(10, "Busnummer is te lang.").optional(),
  ),
  municipality: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(3, "Gemeente is te kort.")
      .max(255, "Gemeente is te lang."),
  ),
  postalCode: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(/^\d{4}$/, "Geef een geldige postcode in."),
  ),
});

export type CreateAddressData = z.infer<typeof createAddressSchema>;

export const updateAddressSchema = createAddressSchema;

export type UpdateAddressData = z.infer<typeof updateAddressSchema>;
