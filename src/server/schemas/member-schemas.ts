import { z } from "zod";

export const createMemberSchema = z.object({
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
  gender: z.enum(["M", "F", "X"], {
    errorMap: () => ({ message: "Kies een geldig geslacht." }),
  }),
  dateOfBirth: z.date({
    required_error: "Geef een geldige geboortedatum in.",
  }),
  permissionPhotos: z.boolean().default(false),
});

export type CreateMemberData = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = createMemberSchema;

export type UpdateMemberData = z.infer<typeof updateMemberSchema>;
