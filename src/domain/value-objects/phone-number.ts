import { z } from "zod";
import { MAX_PHONE_NUMBER_LENGTH } from "drizzle/schema";

export const phoneNumberSchema = z
  .string()
  .trim()
  .min(3)
  .max(MAX_PHONE_NUMBER_LENGTH)
  .regex(
    /^\d{3,4} \d{2} \d{2} \d{2}$/,
    "Phone number must be in the format '1234 56 78 90' or '123 45 67 89'",
  );
