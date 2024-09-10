import { z } from "zod";
import { nameSchema } from "./name";
import { phoneNumberSchema } from "./phone-number";

export const emergencyContactSchema = z.object({
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  relationship: z.string().optional(),
});
