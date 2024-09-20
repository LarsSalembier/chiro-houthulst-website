import {
  type MedicalInformationUpdate,
  type MedicalInformation,
  type MedicalInformationInsert,
} from "~/domain/entities/medical-information";

export interface IMedicalInformationRepository {
  createMedicalInformation(
    medicalInformation: MedicalInformationInsert,
  ): Promise<MedicalInformation>;
  getMedicalInformation(
    memberId: number,
  ): Promise<MedicalInformation | undefined>;
  updateMedicalInformation(
    memberId: number,
    medicalInformation: MedicalInformationUpdate,
  ): Promise<MedicalInformation>;
  deleteMedicalInformation(memberId: number): Promise<void>;
}
