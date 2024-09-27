import {
  type MedicalInformation,
  type MedicalInformationInsert,
  type MedicalInformationUpdate,
} from "~/domain/entities/medical-information";

/**
 * Repository interface for accessing and managing medical information.
 */
export interface IMedicalInformationRepository {
  /**
   * Creates new medical information for a member.
   *
   * @param medicalInformation The medical information data to insert.
   * @returns The created medical information.
   *
   * @throws {MemberAlreadyHasMedicalInformationError} If medical information for the given member already exists.
   * @throws {MemberNotFoundError} If the member the medical information belongs to does not exist.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createMedicalInformation(
    medicalInformation: MedicalInformationInsert,
  ): Promise<MedicalInformation>;

  /**
   * Retrieves the medical information for a specific member.
   *
   * @param memberId The ID of the member to retrieve medical information for.
   * @returns The medical information for the specified member, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getMedicalInformationByMemberId(
    memberId: number,
  ): Promise<MedicalInformation | undefined>;

  /**
   * Retrieves all medical information records.
   *
   * @returns A list of all medical information records.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllMedicalInformation(): Promise<MedicalInformation[]>;

  /**
   * Updates the medical information for a specific member.
   *
   * @param memberId The ID of the member whose medical information should be updated.
   * @param medicalInformation The medical information data to apply as updates.
   * @returns The updated medical information.
   *
   * @throws {MedicalInformationNotFoundError} If no medical information is found for the specified member.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateMedicalInformation(
    memberId: number,
    medicalInformation: MedicalInformationUpdate,
  ): Promise<MedicalInformation>;

  /**
   * Deletes the medical information for a specific member.
   *
   * @param memberId The ID of the member whose medical information should be deleted.
   *
   * @throws {MedicalInformationNotFoundError} If no medical information is found for the specified member.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteMedicalInformation(memberId: number): Promise<void>;

  /**
   * Deletes all medical information records.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  deleteAllMedicalInformation(): Promise<void>;
}
