import {
  type EmergencyContactUpdate,
  type EmergencyContact,
  type EmergencyContactInsert,
} from "~/domain/entities/emergency-contact";

export interface IEmergencyContactsRepository {
  /**
   * Creates a new emergency contact for a member.
   *
   * @param emergencyContact The emergency contact data to insert.
   * @returns The created emergency contact.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberAlreadyHasEmergencyContactError} If the member already has an emergency contact.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createEmergencyContact(
    emergencyContact: EmergencyContactInsert,
  ): Promise<EmergencyContact>;

  /**
   * Gets an emergency contact by its member ID.
   *
   * @param memberId The ID of the member whose emergency contact to retrieve.
   * @returns The emergency contact if found, undefined otherwise.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getEmergencyContact(memberId: number): Promise<EmergencyContact | undefined>;

  /**
   * Updates an existing emergency contact.
   *
   * @param memberId The ID of the member whose emergency contact to update.
   * @param emergencyContact The updated emergency contact data.
   * @returns The updated emergency contact.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {EmergencyContactNotFoundError} If the emergency contact is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  updateEmergencyContact(
    memberId: number,
    emergencyContact: EmergencyContactUpdate,
  ): Promise<EmergencyContact>;

  /**
   * Deletes an emergency contact by its member ID.
   *
   * @param memberId The ID of the member whose emergency contact to delete.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {EmergencyContactNotFoundError} If the emergency contact is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteEmergencyContact(memberId: number): Promise<void>;
}
