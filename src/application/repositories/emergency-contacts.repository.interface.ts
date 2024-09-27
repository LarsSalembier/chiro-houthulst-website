import {
  type EmergencyContact,
  type EmergencyContactInsert,
  type EmergencyContactUpdate,
} from "~/domain/entities/emergency-contact";

/**
 * Repository interface for accessing and managing emergency contacts.
 */
export interface IEmergencyContactsRepository {
  /**
   * Creates a new emergency contact.
   *
   * @param emergencyContact - The emergency contact data to insert.
   * @returns The created emergency contact.
   *
   * @throws {MemberAlreadyHasEmergencyContactError} If the member already has an emergency contact.
   * @throws {MemberNotFoundError} If the member associated with the emergency contact is not found.
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  createEmergencyContact(
    emergencyContact: EmergencyContactInsert,
  ): Promise<EmergencyContact>;

  /**
   * Retrieves an emergency contact by the member ID they are associated with.
   *
   * @param memberId - The ID of the member to retrieve the emergency contact for.
   * @returns The emergency contact associated with the member ID, or `undefined` if not found.
   *
   * @throws {MemberNotFoundError} If no member is associated with the given ID.
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getEmergencyContactByMemberId(
    memberId: number,
  ): Promise<EmergencyContact | undefined>;

  /**
   * Retrieves all emergency contacts.
   *
   * @returns A list of all emergency contacts.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllEmergencyContacts(): Promise<EmergencyContact[]>;

  /**
   * Updates an existing emergency contact.
   *
   * @param memberId - The ID of the member whose emergency contact should be updated.
   * @param emergencyContact - The emergency contact data to apply as updates.
   * @returns The updated emergency contact.
   *
   * @throws {EmergencyContactNotFoundError} If no emergency contact is associated with the given member ID.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateEmergencyContact(
    memberId: number,
    emergencyContact: EmergencyContactUpdate,
  ): Promise<EmergencyContact>;

  /**
   * Deletes an emergency contact by the ID of the member they are associated with.
   *
   * @param memberId - The ID of the member whose emergency contact should be deleted.
   *
   * @throws {EmergencyContactNotFoundError} If no emergency contact is associated with the given member ID.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteEmergencyContact(memberId: number): Promise<void>;

  /**
   * Deletes all emergency contacts.
   *
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteAllEmergencyContacts(): Promise<void>;
}
