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
import { genderEnumSchema } from "~/domain/enums/gender";
import { parentRelationshipEnumSchema } from "~/domain/enums/parent-relationship";
import { paymentMethodEnumSchema } from "~/domain/enums/payment-method";

export function calculateAge(birthday: Date) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function formatName(value: string): string {
  value = value.toLowerCase();

  if (!value) {
    return value;
  }

  return value
    .split(" ")
    .map((word) => {
      if (!word) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

const conditionSchema = z
  .object({
    hasCondition: z.boolean().default(false),
    info: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .trim()
        .min(3, {
          message: "De informatie moet minstens 3 karakters lang zijn",
        })
        .nullable(),
    ),
  })
  .transform((data) => {
    if (!data.hasCondition) {
      return {
        hasCondition: data.hasCondition,
        info: null,
      };
    }

    return data;
  });

export const registerMemberSchema = z.object({
  memberData: z.object({
    name: z.object({
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
        .min(2, {
          message: "De achternaam moet minstens 2 karakters lang zijn",
        })
        .max(MAX_NAME_LENGTH, {
          message: `De achternaam mag maximaal ${MAX_NAME_LENGTH} karakters lang zijn`,
        })
        .transform(formatName),
    }),
    phoneNumber: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .min(2, {
          message: "Het telefoonnummer moet minstens 2 karakters lang zijn",
        })
        .max(MAX_PHONE_NUMBER_LENGTH, {
          message: `Het telefoonnummer mag maximaal ${MAX_PHONE_NUMBER_LENGTH} karakters lang zijn`,
        })
        .regex(
          /^\d{3,4} \d{2} \d{2} \d{2}$/,
          "Geef een geldig telefoonnummer op in de vorm '1234 56 78 90' of '123 45 67 89'",
        )
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
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
      (val) => (val ? null : val),
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
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
    gdprPermissionToPublishPhotos: z.boolean({
      required_error: "Geef aan of u toestemming geeft om foto's te publiceren",
    }),
  }),
  // .refine(
  //   (data) => {
  //     const age = calculateAge(data.dateOfBirth);
  //     if (age >= 15) {
  //       return data.phoneNumber !== undefined;
  //     }
  //     return true;
  //   },
  //   {
  //     message: "GSM-nummer is verplicht voor leden van 15 jaar en ouder.",
  //     path: ["phoneNumber"],
  //   },
  // )
  // .refine(
  //   (data) => {
  //     const age = calculateAge(data.dateOfBirth);
  //     if (age >= 15) {
  //       return data.emailAddress !== undefined;
  //     }
  //     return true;
  //   },
  //   {
  //     message: "E-mailadres is verplicht voor leden van 15 jaar en ouder.",
  //     path: ["emailAddress"],
  //   },
  // ),
  parentsWithAddresses: z
    .array(
      z.object({
        parent: z.object({
          name: z.object({
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
          }),
          phoneNumber: z
            .string({
              required_error: "Geef een telefoonnummer op",
            })
            .trim()
            .min(2, {
              message: "Het telefoonnummer moet minstens 2 karakters lang zijn",
            })
            .max(MAX_PHONE_NUMBER_LENGTH, {
              message: `Het telefoonnummer mag maximaal ${MAX_PHONE_NUMBER_LENGTH} karakters lang zijn`,
            })
            .regex(
              /^\d{3,4} \d{2} \d{2} \d{2}$/,
              "Geef een geldig telefoonnummer op in de vorm '1234 56 78 90' of '123 45 67 89'",
            ),
          emailAddress: z
            .string({
              required_error: "Geef een e-mailadres op",
            })
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
            .toLowerCase(),
          relationship: parentRelationshipEnumSchema,
        }),
        address: z.object({
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
            }),
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
          box: z.preprocess(
            (val) => (val ? null : val),
            z
              .string()
              .trim()
              .max(MAX_ADDRESS_BOX_LENGTH, {
                message: `De bus mag maximaal ${MAX_ADDRESS_BOX_LENGTH} karakters lang zijn`,
              })
              .nullable(),
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
            }),
        }),
      }),
    )
    .min(1, {
      message: "Geef minstens 1 ouder/voogd op",
    }),
  emergencyContact: z.object({
    name: z.object({
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
    }),
    phoneNumber: z
      .string({
        required_error: "Geef een telefoonnummer op",
      })
      .trim()
      .min(2, {
        message: "Het telefoonnummer moet minstens 2 karakters lang zijn",
      })
      .max(MAX_PHONE_NUMBER_LENGTH, {
        message: `Het telefoonnummer mag maximaal ${MAX_PHONE_NUMBER_LENGTH} karakters lang zijn`,
      })
      .regex(
        /^\d{3,4} \d{2} \d{2} \d{2}$/,
        "Geef een geldig telefoonnummer op in de vorm '1234 56 78 90' of '123 45 67 89'",
      ),
    relationship: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .trim()
        .min(2, {
          message: "De relatie moet minstens 2 karakters lang zijn",
        })
        .max(MAX_EMERGENCY_CONTACT_RELATIONSHIP_LENGTH, {
          message: `De relatie mag maximaal ${MAX_EMERGENCY_CONTACT_RELATIONSHIP_LENGTH} karakters lang zijn`,
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
  }),
  medicalInformation: z.object({
    pastMedicalHistory: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .trim()
        .min(3, {
          message:
            "De medische geschiedenis moet minstens 3 karakters lang zijn",
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
    tetanusVaccination: z.boolean().default(false),
    tetanusVaccinationYear: z.preprocess(
      (val) => (val ? null : val),
      z
        .number()
        .int()
        .min(1900, {
          message: "Het jaar van de tetanusvaccinatie moet na 1900 liggen",
        })
        .max(new Date().getFullYear(), {
          message:
            "Het jaar van de tetanusvaccinatie mag niet in de toekomst liggen",
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
    asthma: conditionSchema,
    bedwetting: conditionSchema,
    epilepsy: conditionSchema,
    heartCondition: conditionSchema,
    hayFever: conditionSchema,
    skinCondition: conditionSchema,
    rheumatism: conditionSchema,
    sleepwalking: conditionSchema,
    diabetes: conditionSchema,
    otherMedicalConditions: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .trim()
        .min(3, {
          message:
            "De andere medische aandoeningen moeten minstens 3 karakters lang zijn",
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
    foodAllergies: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .trim()
        .min(3, {
          message: "De voedselallergieën moeten minstens 3 karakters lang zijn",
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
    substanceAllergies: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .trim()
        .min(3, {
          message: "De stofallergieën moeten minstens 3 karakters lang zijn",
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
    medicationAllergies: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .trim()
        .min(3, {
          message:
            "De medicatieallergieën moeten minstens 3 karakters lang zijn",
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
    medication: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .trim()
        .min(3, {
          message: "De medicatie moet minstens 3 karakters lang zijn",
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
    getsTiredQuickly: z.boolean().default(false),
    canParticipateSports: z.boolean().default(false),
    canSwim: z.boolean().default(false),
    otherRemarks: z.preprocess(
      (val) => (val ? null : val),
      z
        .string()
        .trim()
        .min(3, {
          message:
            "De andere opmerkingen moeten minstens 3 karakters lang zijn",
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
    permissionMedication: z.boolean().default(false),
    doctor: z.object({
      name: z.object({
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
      }),
      phoneNumber: z
        .string({
          required_error: "Geef een telefoonnummer op",
        })
        .trim()
        .min(2, {
          message: "Het telefoonnummer moet minstens 2 karakters lang zijn",
        })
        .max(MAX_PHONE_NUMBER_LENGTH, {
          message: `Het telefoonnummer mag maximaal ${MAX_PHONE_NUMBER_LENGTH} karakters lang zijn`,
        })
        .regex(
          /^\d{3,4} \d{2} \d{2} \d{2}$/,
          "Geef een geldig telefoonnummer op in de vorm '1234 56 78 90' of '123 45 67 89'",
        ),
    }),
  }),
  groupId: z.number().int().positive(),
  yearlyMembership: z.object({
    paymentReceived: z.boolean(),
    paymentMethod: paymentMethodEnumSchema
      .optional()
      .nullable()
      .transform((value) => (value === undefined ? null : value)),
    paymentDate: z.preprocess(
      (val) => (val ? null : val),
      z
        .date({
          required_error: "Geef een betalingsdatum op",
          invalid_type_error: "Geef een geldige betalingsdatum op",
        })
        .min(new Date(1970, 0, 1), {
          message: "De betalingsdatum moet na 01/01/1970 liggen",
        })
        .nullable()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
    ),
  }),
});

export type RegisterMemberInput = z.infer<typeof registerMemberSchema>;
