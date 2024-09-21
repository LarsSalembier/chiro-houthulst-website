import { z } from "zod";
import { calculateAge } from "./calculate-age";
import {
  MAX_ADDRESS_BOX_LENGTH,
  MAX_EMERGENCY_CONTACT_RELATIONSHIP_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
  MAX_NAME_LENGTH,
  MAX_PHONE_NUMBER_LENGTH,
  MAX_STREET_LENGTH,
  MAX_STRING_LENGTH,
} from "drizzle/schema";

const phoneRegex = /^\d{3,4} \d{2} \d{2} \d{2}$/;

const createStringSchema = (fieldName: string, maxLength = MAX_STRING_LENGTH) =>
  z
    .string({
      required_error: `${fieldName} ontbreekt!`,
    })
    .trim()
    .min(1, `${fieldName} ontbreekt!`)
    .max(maxLength, `${fieldName} is te lang.`);

const createOptionalStringSchema = (maxLength = MAX_STRING_LENGTH) =>
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
    )
    .max(MAX_PHONE_NUMBER_LENGTH, "GSM-nummer is te lang.");

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
  street: createStringSchema("Straatnaam", MAX_STREET_LENGTH),
  houseNumber: createStringSchema("Huisnummer", MAX_HOUSE_NUMBER_LENGTH),
  bus: createOptionalStringSchema(MAX_ADDRESS_BOX_LENGTH),
  postalCode: z.coerce
    .number({
      required_error: "Postcode ontbreekt!",
    })
    .int({
      message: "Postcode moet een getal zijn.",
    })
    .min(1000, "Postcode is ongeldig.")
    .max(9999, "Postcode is ongeldig."),
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
  memberGroupId: z.number().int().positive("Selecteer een groep."),
});

export const extraContactPersonSchema = z.object({
  extraContactPersonFirstName: createStringSchema("Voornaam", MAX_NAME_LENGTH),
  extraContactPersonLastName: createStringSchema("Achternaam", MAX_NAME_LENGTH),
  extraContactPersonPhoneNumber: createPhoneSchema(),
  extraContactPersonRelationship: createOptionalStringSchema(
    MAX_EMERGENCY_CONTACT_RELATIONSHIP_LENGTH,
  ),
});

export const permissionsSchema = z.object({
  permissionPhotos: z.boolean().default(true),
  permissionMedication: z.enum(["true", "false"], {
    required_error: "Gelieve een keuze te maken voor toestemming medicatie",
  }),
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
  hasToTakeMedication: z.enum(["true", "false"], {
    required_error: "Gelieve aan te geven of uw kind medicatie moet nemen",
  }),
  medication: createOptionalStringSchema(1000),
  tetanusVaccination: z.enum(["true", "false"], {
    required_error:
      "Gelieve aan te geven of uw kind gevaccineerd is tegen tetanus",
  }),
  tetanusVaccinationYear: z.preprocess(
    (val) => (val ? undefined : val),
    z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  ),
});

export const sportsAndActivitiesSchema = z.object({
  getsTiredQuickly: z.enum(["true", "false"], {
    required_error: "Gelieve aan te geven of uw kind snel moe is",
  }),
  canParticipateSports: z.enum(["true", "false"], {
    required_error:
      "Gelieve aan te geven of uw kind kan deelnemen aan sport en spel afgestemd op zijn/haar leeftijd",
  }),
  canSwim: z.enum(["true", "false"], {
    required_error: "Gelieve aan te geven of uw kind kan zwemmen",
  }),
});

export const doctorSchema = z.object({
  doctorFirstName: createStringSchema("Voornaam", MAX_NAME_LENGTH),
  doctorLastName: createStringSchema("Achternaam", MAX_NAME_LENGTH),
  doctorPhoneNumber: createPhoneSchema(),
});

export const remarksSchema = z.object({
  otherRemarks: createOptionalStringSchema(),
});

export const registrationFormSchema = z.object({
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
});
// .refine(
//   (data) => {
//     const age = calculateAge(data.memberDateOfBirth);
//     if (age >= 15) {
//       return data.memberPhoneNumber;
//     }
//     return true;
//   },
//   {
//     message: "GSM-nummer is verplicht voor leden van 15 jaar en ouder.",
//     path: ["memberPhoneNumber"],
//   },
// )
// .refine(
//   (data) => {
//     const age = calculateAge(data.memberDateOfBirth);
//     if (age >= 15) {
//       return data.memberEmailAddress;
//     }
//     return true;
//   },
//   {
//     message: "E-mailadres is verplicht voor leden van 15 jaar en ouder.",
//     path: ["memberEmailAddress"],
//   },
// )
// .refine(
//   (data) => {
//     if (data.substanceAllergies && !data.substanceAllergiesInfo) {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: "Welke stofallergieën heeft uw kind?",
//     path: ["substanceAllergiesInfo"],
//   },
// )
// .refine(
//   (data) => {
//     if (data.medicationAllergies && !data.medicationAllergiesInfo) {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: "Welke medicatieallergieën heeft uw kind?",
//     path: ["medicationAllergiesInfo"],
//   },
// )
// .refine(
//   (data) => {
//     if (data.foodAllergies && !data.foodAllergiesInfo) {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: "Welke voedselallergieën heeft uw kind?",
//     path: ["foodAllergiesInfo"],
//   },
// )
// .refine(
//   (data) => {
//     if (data.hasToTakeMedication && !data.medication) {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: "Welke medicatie moet uw kind nemen?",
//     path: ["medication"],
//   },
// );

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;
