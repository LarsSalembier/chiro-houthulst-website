import { z } from "zod";
import { conditionSchema } from "../value-objects/condition";
import { doctorInformationSchema } from "../value-objects/doctor-information";
import { type RecursivePartial } from "~/types/recursive-partial";

export const medicalInformationSchema = z.object({
  memberId: z.number().int().positive(),
  pastMedicalHistory: z.string().trim().min(3).nullable(),
  tetanusVaccination: z.boolean(),
  tetanusVaccinationYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .nullable(),
  asthma: conditionSchema,
  bedwetting: conditionSchema,
  epilepsy: conditionSchema,
  heartCondition: conditionSchema,
  hayFever: conditionSchema,
  skinCondition: conditionSchema,
  rheumatism: conditionSchema,
  sleepwalking: conditionSchema,
  diabetes: conditionSchema,
  otherMedicalConditions: z.string().trim().min(3).nullable(),
  foodAllergies: z.string().trim().min(3).nullable(),
  substanceAllergies: z.string().trim().min(3).nullable(),
  medicationAllergies: z.string().trim().min(3).nullable(),
  medication: z.string().trim().min(3).nullable(),
  getsTiredQuickly: z.boolean(),
  canParticipateSports: z.boolean(),
  canSwim: z.boolean(),
  otherRemarks: z.string().trim().min(3).nullable(),
  permissionMedication: z.boolean(),
  doctor: doctorInformationSchema,
});

export type MedicalInformation = z.infer<typeof medicalInformationSchema>;

export const medicalInformationInsertSchema = medicalInformationSchema;

export type MedicalInformationInsert = z.infer<
  typeof medicalInformationInsertSchema
>;

export type MedicalInformationUpdate = RecursivePartial<
  Omit<z.infer<typeof medicalInformationInsertSchema>, "memberId">
>;
