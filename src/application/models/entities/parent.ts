import { z } from "zod";
import { addressSchema } from "../value-objects/address";
import { nameSchema } from "../value-objects/name";
import { phoneNumberSchema } from "../value-objects/phone-number";

export const parentSchema = z.object({
  id: z.number().int().positive(),
  type: z.enum(["MOTHER", "FATHER", "GUARDIAN", "PLUSFATHER", "PLUSMOTHER"]),
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  emailAddress: z.string().email(),
  address: addressSchema,
});
