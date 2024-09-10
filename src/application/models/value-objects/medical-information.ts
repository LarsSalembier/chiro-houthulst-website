import { z } from "zod";
import { doctorInformationSchema } from "./doctor-information";
import { conditionSchema } from "./condition";

export const medicalInformationSchema = z.object({
  pastMedicalHistory: z.string().optional(),
  tetanusVaccination: z.boolean(),
  tetanusVaccinationYear: z.number().int().optional(),
  asthma: conditionSchema,
  bedwetting: conditionSchema,
  epilepsy: conditionSchema,
  heartCondition: conditionSchema,
  hayFever: conditionSchema,
  skinCondition: conditionSchema,
  rheumatism: conditionSchema,
  sleepwalking: conditionSchema,
  diabetes: conditionSchema,
  otherMedicalConditions: z.string().optional(),
  foodAllergies: z.string().optional(),
  substanceAllergies: z.string().optional(),
  medicationAllergies: z.string().optional(),
  medication: z.string().optional(),
  getsTiredQuickly: z.boolean(),
  canParticipateSports: z.boolean(),
  canSwim: z.boolean(),
  otherRemarks: z.string().optional(),
  permissionMedication: z.boolean(),
  doctor: doctorInformationSchema,
});
