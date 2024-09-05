import { z } from "zod";

export const createMedicalInformationSchema = z.object({
  pastMedicalHistory: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(1000, "Medische geschiedenis is te lang.").optional(),
  ),
  tetanusVaccination: z.boolean().default(false),
  tetanusVaccinationYear: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .number()
      .int("Jaar moet een geheel getal zijn.")
      .min(1900, "Jaar is te vroeg.")
      .max(new Date().getFullYear(), "Jaar kan niet in de toekomst zijn.")
      .optional(),
  ),
  asthma: z.boolean().default(false),
  asthmaInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  bedwetting: z.boolean().default(false),
  bedwettingInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  epilepsy: z.boolean().default(false),
  epilepsyInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  heartCondition: z.boolean().default(false),
  heartConditionInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  hayFever: z.boolean().default(false),
  hayFeverInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  skinCondition: z.boolean().default(false),
  skinConditionInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  rheumatism: z.boolean().default(false),
  rheumatismInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  sleepwalking: z.boolean().default(false),
  sleepwalkingInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  diabetes: z.boolean().default(false),
  diabetesInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  foodAllergies: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(1000, "Informatie is te lang.").optional(),
  ),
  substanceAllergies: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(1000, "Informatie is te lang.").optional(),
  ),
  medicationAllergies: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(1000, "Informatie is te lang.").optional(),
  ),
  medicationDuringStay: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(1000, "Informatie is te lang.").optional(),
  ),
  getsTiredQuickly: z.boolean().default(false),
  getsTiredQuicklyInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  canParticipateSports: z.boolean().default(true),
  canParticipateSportsInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  canSwim: z.boolean().default(false),
  canSwimInfo: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(255, "Informatie is te lang.").optional(),
  ),
  otherRemarks: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(1000, "Opmerkingen zijn te lang.").optional(),
  ),
  permissionMedication: z.boolean().default(false),
});

export type CreateMedicalInformationData = z.infer<
  typeof createMedicalInformationSchema
>;

export const updateMedicalInformationSchema = createMedicalInformationSchema;

export type UpdateMedicalInformationData = z.infer<
  typeof updateMedicalInformationSchema
>;
