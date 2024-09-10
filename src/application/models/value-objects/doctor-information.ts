import { z } from "zod";
import { phoneNumberSchema } from "./phone-number";
import { nameSchema } from "./name";

export const doctorInformationSchema = z.object({
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
});
