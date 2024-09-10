import { z } from "zod";

export const paymentMethodEnumValues = [
  "CASH",
  "BANK_TRANSFER",
  "PAYCONIQ",
  "OTHER",
] as const;

export const paymentMethodEnumSchema = z.enum(paymentMethodEnumValues);
