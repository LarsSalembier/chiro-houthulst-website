import {
  MAX_NAME_LENGTH,
  MAX_PHONE_NUMBER_LENGTH,
  MAX_EMAIL_ADDRESS_LENGTH,
  MAX_STREET_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
  MAX_ADDRESS_BOX_LENGTH,
  MAX_MUNICIPALITY_LENGTH,
  MAX_EMERGENCY_CONTACT_RELATIONSHIP_LENGTH,
} from "drizzle/schema";
import { z } from "zod";
import { decisionEnumSchema } from "~/domain/enums/decision";
import { genderEnumSchema } from "~/domain/enums/gender";
import { parentRelationshipEnumSchema } from "~/domain/enums/parent-relationship";
import { paymentMethodEnumSchema } from "~/domain/enums/payment-method";

export function calculateAge(birthday: Date) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function formatName(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "",
    )
    .join(" ");
}

const optionalString = (
  minLength: number,
  maxLength: number,
  message: string,
) =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(minLength, { message })
      .max(maxLength, { message })
      .optional()
      .transform((value) => value ?? null),
  );

const phoneNumberSchema = z
  .string({
    required_error: "Geef een telefoonnummer op",
  })
  .trim()
  .max(MAX_PHONE_NUMBER_LENGTH, {
    message: `Het telefoonnummer mag maximaal ${MAX_PHONE_NUMBER_LENGTH} karakters lang zijn`,
  });

const nameSchema = z
  .object({
    firstName: z
      .string({
        required_error: "Geef een voornaam op",
      })
      .trim()
      .min(2, {
        message: "De voornaam moet minstens 2 karakters lang zijn",
      })
      .max(MAX_NAME_LENGTH, {
        message: `De voornaam mag maximaal ${MAX_NAME_LENGTH} karakters lang zijn`,
      })
      .transform(formatName),
    lastName: z
      .string({
        required_error: "Geef een achternaam op",
      })
      .trim()
      .min(2, {
        message: "De achternaam moet minstens 2 karakters lang zijn",
      })
      .max(MAX_NAME_LENGTH, {
        message: `De achternaam mag maximaal ${MAX_NAME_LENGTH} karakters lang zijn`,
      })
      .transform(formatName),
  })
  .required();

const addressSchema = z
  .object({
    street: z
      .string({
        required_error: "Geef een straatnaam op",
      })
      .trim()
      .min(2, {
        message: "De straatnaam moet minstens 2 karakters lang zijn",
      })
      .max(MAX_STREET_LENGTH, {
        message: `De straatnaam mag maximaal ${MAX_STREET_LENGTH} karakters lang zijn`,
      })
      .transform(formatName),
    houseNumber: z
      .string({
        required_error: "Geef een huisnummer op",
      })
      .trim()
      .min(1, {
        message: "Het huisnummer moet minstens 1 karakter lang zijn",
      })
      .max(MAX_HOUSE_NUMBER_LENGTH, {
        message: `Het huisnummer mag maximaal ${MAX_HOUSE_NUMBER_LENGTH} karakters lang zijn`,
      }),
    box: optionalString(
      1,
      MAX_ADDRESS_BOX_LENGTH,
      `De bus mag maximaal ${MAX_ADDRESS_BOX_LENGTH} karakters lang zijn`,
    ),
    postalCode: z.coerce
      .number({
        required_error: "Geef een postcode op",
      })
      .int({
        message: "De postcode moet een getal zijn",
      })
      .min(1000, {
        message: "De postcode is ongeldig",
      })
      .max(9999, {
        message: "De postcode is ongeldig",
      }),
    municipality: z
      .string({
        required_error: "Geef de gemeente op",
      })
      .trim()
      .min(2, {
        message: "De gemeente moet minstens 2 karakters lang zijn",
      })
      .max(MAX_MUNICIPALITY_LENGTH, {
        message: `De gemeente mag maximaal ${MAX_MUNICIPALITY_LENGTH} karakters lang zijn`,
      })
      .transform(formatName),
  })
  .required();

const conditionSchema = z
  .object({
    hasCondition: z.boolean().default(false),
    info: optionalString(
      3,
      1000,
      "De informatie moet minstens 3 karakters lang zijn",
    ),
  })
  .required()
  .transform((data) => {
    if (!data.hasCondition) {
      return {
        hasCondition: data.hasCondition,
        info: null,
      };
    }

    return data;
  });

export const registerMemberSchema = z
  .object({
    memberData: z
      .object({
        name: nameSchema,
        phoneNumber: z.preprocess(
          (val) => (val === "" ? undefined : val),
          phoneNumberSchema.optional().transform((v) => v ?? null),
        ),
        gender: genderEnumSchema,
        dateOfBirth: z
          .date({
            required_error: "Geef een geboortedatum op",
            invalid_type_error: "Geef een geldige geboortedatum op",
          })
          .min(new Date(1900, 0, 1), {
            message: "De geboortedatum moet na 01/01/1900 liggen",
          })
          .max(new Date(), {
            message: "De geboortedatum mag niet in de toekomst liggen",
          }),
        emailAddress: z.preprocess(
          (val) => (val === "" ? undefined : val),
          z
            .string()
            .trim()
            .email({
              message: "Geef een geldig e-mailadres op",
            })
            .min(3, {
              message: "Het e-mailadres moet minstens 3 karakters lang zijn",
            })
            .max(MAX_EMAIL_ADDRESS_LENGTH, {
              message: `Het e-mailadres mag maximaal ${MAX_EMAIL_ADDRESS_LENGTH} karakters lang zijn`,
            })
            .toLowerCase()
            .optional()
            .transform((value) => value ?? null),
        ),
        gdprPermissionToPublishPhotos: decisionEnumSchema.transform((value) =>
          value === "YES" ? true : false,
        ),
      })
      .required()
      .refine(
        (data) => {
          const age = calculateAge(data.dateOfBirth);
          return !(age >= 15 && data.phoneNumber === null);
        },
        {
          message: "GSM-nummer is verplicht voor leden van 15 jaar en ouder.",
          path: ["phoneNumber"],
        },
      )
      .refine(
        (data) => {
          const age = calculateAge(data.dateOfBirth);
          return !(age >= 15 && data.emailAddress === null);
        },
        {
          message: "E-mailadres is verplicht voor leden van 15 jaar en ouder.",
          path: ["emailAddress"],
        },
      ),
    parentsWithAddresses: z
      .array(
        z
          .object({
            parent: z
              .object({
                name: nameSchema,
                phoneNumber: phoneNumberSchema.trim(),
                emailAddress: z
                  .string({
                    required_error: "Geef een e-mailadres op",
                  })
                  .trim()
                  .email({
                    message: "Geef een geldig e-mailadres op",
                  })
                  .min(3, {
                    message:
                      "Het e-mailadres moet minstens 3 karakters lang zijn",
                  })
                  .max(MAX_EMAIL_ADDRESS_LENGTH, {
                    message: `Het e-mailadres mag maximaal ${MAX_EMAIL_ADDRESS_LENGTH} karakters lang zijn`,
                  })
                  .toLowerCase(),
                relationship: parentRelationshipEnumSchema,
              })
              .required(),
            address: addressSchema,
          })
          .required(),
      )
      .min(1, {
        message: "Geef minstens 1 ouder/voogd op",
      }),
    emergencyContact: z
      .object({
        name: nameSchema,
        phoneNumber: phoneNumberSchema,
        relationship: optionalString(
          2,
          MAX_EMERGENCY_CONTACT_RELATIONSHIP_LENGTH,
          "De relatie moet minstens 2 karakters lang zijn",
        ),
      })
      .required(),
    medicalInformation: z
      .object({
        pastMedicalHistory: optionalString(
          3,
          1000,
          "De medische geschiedenis moet minstens 3 karakters lang zijn",
        ),
        tetanusVaccination: decisionEnumSchema.transform((value) =>
          value === "YES" ? true : false,
        ),
        tetanusVaccinationYear: z.coerce
          .number()
          .int()
          .min(1900, {
            message: "Het jaar van de tetanusvaccinatie moet na 1900 liggen",
          })
          .max(new Date().getFullYear(), {
            message:
              "Het jaar van de tetanusvaccinatie mag niet in de toekomst liggen",
          })
          .optional()
          .transform((value) => value ?? null),
        asthma: conditionSchema,
        bedwetting: conditionSchema,
        epilepsy: conditionSchema,
        heartCondition: conditionSchema,
        hayFever: conditionSchema,
        skinCondition: conditionSchema,
        rheumatism: conditionSchema,
        sleepwalking: conditionSchema,
        diabetes: conditionSchema,
        otherMedicalConditions: optionalString(
          3,
          1000,
          "De andere medische aandoeningen moeten minstens 3 karakters lang zijn",
        ),
        foodAllergies: optionalString(
          3,
          1000,
          "De voedselallergieën moeten minstens 3 karakters lang zijn",
        ),
        substanceAllergies: optionalString(
          3,
          1000,
          "De stofallergieën moeten minstens 3 karakters lang zijn",
        ),
        medicationAllergies: optionalString(
          3,
          1000,
          "De medicatieallergieën moeten minstens 3 karakters lang zijn",
        ),
        medication: optionalString(
          3,
          1000,
          "De medicatie moet minstens 3 karakters lang zijn",
        ),
        getsTiredQuickly: decisionEnumSchema.transform((value) =>
          value === "YES" ? true : false,
        ),
        canParticipateSports: decisionEnumSchema.transform((value) =>
          value === "YES" ? true : false,
        ),
        canSwim: decisionEnumSchema.transform((value) =>
          value === "YES" ? true : false,
        ),
        otherRemarks: optionalString(
          3,
          1000,
          "De andere opmerkingen moeten minstens 3 karakters lang zijn",
        ),
        permissionMedication: decisionEnumSchema.transform((value) =>
          value === "YES" ? true : false,
        ),
        doctor: z.object({
          name: nameSchema,
          phoneNumber: phoneNumberSchema
            .trim()
            .transform((v) => v ?? null)
            .optional()
            .transform((v) => v ?? "reeds gekend"),
        }),
      })
      .required(),
    groupId: z.number().int().positive(),
    yearlyMembership: z
      .object({
        paymentReceived: decisionEnumSchema.transform((value) =>
          value === "YES" ? true : false,
        ),
        paymentMethod: paymentMethodEnumSchema
          .optional()
          .transform((value) => value ?? null),
        paymentDate: z
          .date({
            required_error: "Geef een betalingsdatum op",
            invalid_type_error: "Geef een geldige betalingsdatum op",
          })
          .min(new Date(1970, 0, 1), {
            message: "De betalingsdatum moet na 01/01/1970 liggen",
          })
          .optional()
          .transform((value) => value ?? null),
      })
      .required(),
  })
  .required();

export type RegisterMemberInput = z.infer<typeof registerMemberSchema>;
