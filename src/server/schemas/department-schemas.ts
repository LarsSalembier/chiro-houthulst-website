import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Vul de naam van de afdeling in.")
    .max(255, "Naam van de afdeling is te lang.")
    .regex(
      /^[a-zA-Z0-9\s'-]+$/,
      "De naam van de afdeling mag alleen letters, cijfers, - en ' en bevatten.",
    ),
  color: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Geef een geldige hexadecimale kleurcode in (bijv. #FF0000).",
      )
      .optional(),
  ),
  description: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(1000, "Beschrijving is te lang.").optional(),
  ),
});

export type CreateDepartmentData = z.infer<typeof createDepartmentSchema>;
