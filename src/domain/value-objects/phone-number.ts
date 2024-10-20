import { z } from "zod";
import { MAX_PHONE_NUMBER_LENGTH } from "drizzle/schema";

export const phoneNumberSchema = z
  .string()
  .trim()
  .min(3)
  .max(MAX_PHONE_NUMBER_LENGTH);
