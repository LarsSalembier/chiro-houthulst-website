import { z } from "zod";

const calculateAge = (birthday: Date) => {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const createMemberSchema = z
  .object({
    firstName: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .trim()
        .min(2, "Voornaam is te kort.")
        .max(255, "Voornaam is te lang."),
    ),
    lastName: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .trim()
        .min(2, "Achternaam is te kort.")
        .max(255, "Achternaam is te lang."),
    ),
    gender: z.enum(["M", "F", "X"], {
      errorMap: () => ({ message: "Kies een geldig geslacht." }),
    }),
    dateOfBirth: z.date({
      required_error: "Geef een geldige geboortedatum in.",
    }),
    emailAddress: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().email("Geef een geldig e-mailadres in.").optional(),
    ),
    phoneNumber: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .trim()
        .regex(
          /^\d{3,4} \d{2} \d{2} \d{2}$/,
          "Geef een geldig telefoonnummer in in het formaat 0495 12 34 56 of 051 12 34 56",
        )
        .optional(),
    ),
    permissionPhotos: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const age = calculateAge(data.dateOfBirth);
      if (age >= 15) {
        return data.emailAddress && data.phoneNumber;
      }
      return true;
    },
    {
      message:
        "E-mailadres en telefoonnummer zijn verplicht voor leden van 15 jaar en ouder.",
      path: ["emailAddress", "phoneNumber"],
    },
  );

export type CreateMemberData = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = createMemberSchema;

export type UpdateMemberData = z.infer<typeof updateMemberSchema>;
