import {
  type MedicalInformationUpdate,
  type MedicalInformation,
  type MedicalInformationInsert,
} from "~/domain/entities/medical-information";

export interface IMedicalInformationRepository {
  /**
   * Creates new medical information for a member.
   *
   * @param medicalInformation The medical information data to insert.
   * @returns The created medical information.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberAlreadyHasMedicalInformationError} If the member already has medical information.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createMedicalInformation(
    medicalInformation: MedicalInformationInsert,
  ): Promise<MedicalInformation>;

  /**
   * Gets medical information for a member.
   *
   * @param memberId The ID of the member whose medical information to retrieve.
   * @returns The medical information if found, undefined otherwise.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMedicalInformation(
    memberId: number,
  ): Promise<MedicalInformation | undefined>;

  /**
   * Updates an existing medical information for a member.
   *
   * @param memberId The ID of the member whose medical information to update.
   * @param medicalInformation The updated medical information data.
   * @returns The updated medical information.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MedicalInformationNotFoundError} If the medical information is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  updateMedicalInformation(
    memberId: number,
    medicalInformation: MedicalInformationUpdate,
  ): Promise<MedicalInformation>;

  /**
   * Deletes medical information for a member.
   *
   * @param memberId The ID of the member whose medical information to delete.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MedicalInformationNotFoundError} If the medical information is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteMedicalInformation(memberId: number): Promise<void>;
}
