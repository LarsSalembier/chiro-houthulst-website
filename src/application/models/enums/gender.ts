import { z } from "zod";

export const genderEnumValues = ["M", "F", "X"] as const;

export const genderEnumSchema = z.enum(genderEnumValues);
