import { z } from "zod";
import { calculateAge } from "./calculate-age";

const phoneRegex = /^\d{3,4} \d{2} \d{2} \d{2}$/;

const createStringSchema = (fieldName: string, maxLength = 255) =>
  z
    .string({
      required_error: `${fieldName} ontbreekt!`,
    })
    .trim()
    .min(1, `${fieldName} ontbreekt!`)
    .max(maxLength, `${fieldName} is te lang.`);

const createOptionalStringSchema = (maxLength = 255) =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(maxLength, "Informatie is te lang.").optional(),
  );

const createPhoneSchema = () =>
  z
    .string({
      required_error: "GSM-nummer ontbreekt!",
    })
    .trim()
    .regex(
      phoneRegex,
      "Geef een geldig GSM-nummer in in het formaat 0495 12 34 56 of 051 12 34 56",
    );

const createBooleanSchema = () => z.boolean().default(false);

export const parentSchema = z.object({
  type: z.enum(["MOTHER", "FATHER", "GUARDIAN", "PLUSMOTHER", "PLUSFATHER"], {
    required_error: "Kies een type ouder/voogd.",
  }),
  firstName: createStringSchema("Voornaam"),
  lastName: createStringSchema("Achternaam"),
  phoneNumber: createPhoneSchema(),
  emailAddress: z
    .string({
      required_error: "E-mailadres ontbreekt!",
    })
    .email("Geef een geldig e-mailadres in."),
  street: createStringSchema("Straatnaam"),
  houseNumber: createStringSchema("Huisnummer", 10),
  bus: createOptionalStringSchema(10),
  postalCode: z
    .string({
      required_error: "Postcode ontbreekt!",
    })
    .regex(/^\d{4}$/, "Geef een geldige postcode in."),
  municipality: createStringSchema("Gemeente"),
});

export const memberSchema = z.object({
  memberFirstName: createStringSchema("Voornaam"),
  memberLastName: createStringSchema("Achternaam"),
  memberGender: z.enum(["M", "F", "X"], {
    required_error: "Kies een geslacht.",
  }),
  memberDateOfBirth: z.date({
    required_error: "Geef een geldige geboortedatum in.",
  }),
  memberEmailAddress: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().email("Geef een geldig e-mailadres in.").optional(),
  ),
  memberPhoneNumber: z.preprocess(
    (val) => (val === "" ? undefined : val),
    createPhoneSchema().optional(),
  ),
});

export const extraContactPersonSchema = z.object({
  extraContactPersonFirstName: createStringSchema("Voornaam"),
  extraContactPersonLastName: createStringSchema("Achternaam"),
  extraContactPersonPhoneNumber: createPhoneSchema(),
  extraContactPersonRelationship: createOptionalStringSchema(),
});

export const permissionsSchema = z.object({
  permissionPhotos: z.boolean().default(true),
  permissionMedication: createBooleanSchema(),
});

export const allergiesSchema = z.object({
  foodAllergies: createBooleanSchema(),
  foodAllergiesInfo: createOptionalStringSchema(1000),
  substanceAllergies: createBooleanSchema(),
  substanceAllergiesInfo: createOptionalStringSchema(1000),
  medicationAllergies: createBooleanSchema(),
  medicationAllergiesInfo: createOptionalStringSchema(1000),
  hayFever: createBooleanSchema(),
  hayFeverInfo: createOptionalStringSchema(),
});

export const medicalConditionsSchema = z.object({
  asthma: createBooleanSchema(),
  asthmaInfo: createOptionalStringSchema(),
  bedwetting: createBooleanSchema(),
  bedwettingInfo: createOptionalStringSchema(),
  epilepsy: createBooleanSchema(),
  epilepsyInfo: createOptionalStringSchema(),
  heartCondition: createBooleanSchema(),
  heartConditionInfo: createOptionalStringSchema(),
  skinCondition: createBooleanSchema(),
  skinConditionInfo: createOptionalStringSchema(),
  rheumatism: createBooleanSchema(),
  rheumatismInfo: createOptionalStringSchema(),
  sleepwalking: createBooleanSchema(),
  sleepwalkingInfo: createOptionalStringSchema(),
  diabetes: createBooleanSchema(),
  diabetesInfo: createOptionalStringSchema(),
  otherMedicalConditions: createOptionalStringSchema(1000),
});

export const medicalHistorySchema = z.object({
  pastMedicalHistory: createOptionalStringSchema(1000),
  hasToTakeMedication: createBooleanSchema(),
  medication: createOptionalStringSchema(1000),
  tetanusVaccination: createBooleanSchema(),
  tetanusVaccinationYear: z.preprocess(
    (val) => (val ? undefined : val),
    z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  ),
});

export const sportsAndActivitiesSchema = z.object({
  getsTiredQuickly: createBooleanSchema(),
  canParticipateSports: createBooleanSchema(),
  canSwim: createBooleanSchema(),
});

export const doctorSchema = z.object({
  doctorFirstName: createStringSchema("Voornaam"),
  doctorLastName: createStringSchema("Achternaam"),
  doctorPhoneNumber: createPhoneSchema(),
});

export const remarksSchema = z.object({
  otherRemarks: createOptionalStringSchema(),
});

export const registrationFormSchema = z
  .object({
    ...memberSchema.shape,
    parents: z
      .array(parentSchema, {
        required_error: "Voeg minstens één ouder toe.",
      })
      .min(1, "Voeg minstens één ouder toe."),
    ...extraContactPersonSchema.shape,
    ...permissionsSchema.shape,
    ...allergiesSchema.shape,
    ...medicalConditionsSchema.shape,
    ...medicalHistorySchema.shape,
    ...sportsAndActivitiesSchema.shape,
    ...doctorSchema.shape,
    ...remarksSchema.shape,
  })
  .refine(
    (data) => {
      const age = calculateAge(data.memberDateOfBirth);
      if (age >= 15) {
        return data.memberPhoneNumber;
      }
      return true;
    },
    {
      message: "GSM-nummer is verplicht voor leden van 15 jaar en ouder.",
      path: ["memberPhoneNumber"],
    },
  )
  .refine(
    (data) => {
      const age = calculateAge(data.memberDateOfBirth);
      if (age >= 15) {
        return data.memberEmailAddress;
      }
      return true;
    },
    {
      message: "E-mailadres is verplicht voor leden van 15 jaar en ouder.",
      path: ["memberEmailAddress"],
    },
  )
  .refine(
    (data) => {
      if (data.substanceAllergies && !data.substanceAllergiesInfo) {
        return false;
      }
      return true;
    },
    {
      message: "Welke stofallergieën heeft uw kind?",
      path: ["substanceAllergiesInfo"],
    },
  )
  .refine(
    (data) => {
      if (data.medicationAllergies && !data.medicationAllergiesInfo) {
        return false;
      }
      return true;
    },
    {
      message: "Welke medicatieallergieën heeft uw kind?",
      path: ["medicationAllergiesInfo"],
    },
  )
  .refine(
    (data) => {
      if (data.foodAllergies && !data.foodAllergiesInfo) {
        return false;
      }
      return true;
    },
    {
      message: "Welke voedselallergieën heeft uw kind?",
      path: ["foodAllergiesInfo"],
    },
  )
  .refine(
    (data) => {
      if (data.hasToTakeMedication && !data.medication) {
        return false;
      }
      return true;
    },
    {
      message: "Welke medicatie moet uw kind nemen?",
      path: ["medication"],
    },
  );

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;