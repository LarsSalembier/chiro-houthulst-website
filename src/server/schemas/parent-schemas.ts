import { z } from "zod";

export const createParentSchema = z.object({
  type: z.enum(["MOTHER", "FATHER", "GUARDIAN"], {
    errorMap: () => ({ message: "Kies een geldig type ouder/voogd." }),
  }),
  firstName: z
    .string()
    .trim()
    .min(2, "Voornaam is te kort.")
    .max(255, "Voornaam is te lang."),
  lastName: z
    .string()
    .trim()
    .min(2, "Achternaam is te kort.")
    .max(255, "Achternaam is te lang."),
  phone: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(
        /^\d{4} \d{2} \d{2} \d{2}$/,
        "Geef een geldig telefoonnummer in in het formaat 0495 12 34 56",
      ),
  ),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .email("Geef een geldig e-mailadres in.")
      .max(255, "E-mailadres is te lang."),
  ),
});

export type CreateParentData = z.infer<typeof createParentSchema>;

export const updateParentSchema = createParentSchema;

export type UpdateParentData = z.infer<typeof updateParentSchema>;
