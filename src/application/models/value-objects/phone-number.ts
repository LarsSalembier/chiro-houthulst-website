import { z } from "zod";

export const phoneNumberSchema = z.string().max(20);
