import { injectable } from "inversify";
import { type IEmergencyContactsRepository } from "~/application/repositories/emergency-contacts.repository.interface";
import {
  type EmergencyContact,
  type EmergencyContactInsert,
} from "~/domain/entities/emergency-contact";
import {
  EmergencyContactNotFoundError,
  MemberAlreadyHasEmergencyContactError,
} from "~/domain/errors/emergency-contacts";
import { MemberNotFoundError } from "~/domain/errors/members";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";
import { type RecursivePartial } from "~/types/recursive-partial";

@injectable()
export class MockEmergencyContactsRepository
  implements IEmergencyContactsRepository
{
  private _emergencyContacts: EmergencyContact[] = [];
  private _membersRepository: IMembersRepository;

  constructor(membersRepository: IMembersRepository) {
    this._membersRepository = membersRepository;
  }

  private mapToEntity(
    emergencyContact: EmergencyContactInsert,
  ): EmergencyContact {
    return {
      ...emergencyContact,
      name: {
        firstName: emergencyContact.name.firstName,
        lastName: emergencyContact.name.lastName,
      },
    };
  }

  /**
   * Creates a new emergency contact for a member.
   *
   * @param emergencyContact The emergency contact data to insert.
   * @returns The created emergency contact.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberAlreadyHasEmergencyContactError} If the member already has an emergency contact.
   */
  async createEmergencyContact(
    emergencyContact: EmergencyContactInsert,
  ): Promise<EmergencyContact> {
    // Check if the member exists
    const memberExists = await this._membersRepository.getMember(
      emergencyContact.memberId,
    );

    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    // Check if the member already has an emergency contact
    const existingContact = this._emergencyContacts.find(
      (contact) => contact.memberId === emergencyContact.memberId,
    );

    if (existingContact) {
      throw new MemberAlreadyHasEmergencyContactError(
        "Member already has an emergency contact",
      );
    }

    // Create and store the new emergency contact
    const newContact = this.mapToEntity(emergencyContact);
    this._emergencyContacts.push(newContact);
    return newContact;
  }

  /**
   * Gets an emergency contact by its member ID.
   *
   * @param memberId The ID of the member whose emergency contact to retrieve.
   * @returns The emergency contact if found, undefined otherwise.
   * @throws {MemberNotFoundError} If the member is not found.
   */
  async getEmergencyContact(
    memberId: number,
  ): Promise<EmergencyContact | undefined> {
    // Check if the member exists
    const memberExists = await this._membersRepository.getMember(memberId);

    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    return this._emergencyContacts.find(
      (contact) => contact.memberId === memberId,
    );
  }

  /**
   * Updates an existing emergency contact.
   *
   * @param memberId The ID of the member whose emergency contact to update.
   * @param emergencyContact The updated emergency contact data.
   * @returns The updated emergency contact.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {EmergencyContactNotFoundError} If the emergency contact is not found.
   */
  async updateEmergencyContact(
    memberId: number,
    emergencyContact: RecursivePartial<EmergencyContactInsert>,
  ): Promise<EmergencyContact> {
    // Check if the member exists
    const memberExists = await this._membersRepository.getMember(memberId);

    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const index = this._emergencyContacts.findIndex(
      (contact) => contact.memberId === memberId,
    );

    if (index === -1) {
      throw new EmergencyContactNotFoundError("Emergency contact not found");
    }

    // Update the emergency contact
    const existingContact = this._emergencyContacts[index]!;
    const updatedContact = {
      ...existingContact,
      ...emergencyContact,
      name: {
        ...existingContact.name,
        ...emergencyContact.name,
      },
    };

    this._emergencyContacts[index] = updatedContact;
    return updatedContact;
  }

  /**
   * Deletes an emergency contact by its member ID.
   *
   * @param memberId The ID of the member whose emergency contact to delete.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {EmergencyContactNotFoundError} If the emergency contact is not found.
   */
  async deleteEmergencyContact(memberId: number): Promise<void> {
    // Check if the member exists
    const memberExists = await this._membersRepository.getMember(memberId);

    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const index = this._emergencyContacts.findIndex(
      (contact) => contact.memberId === memberId,
    );

    if (index === -1) {
      throw new EmergencyContactNotFoundError("Emergency contact not found");
    }

    this._emergencyContacts.splice(index, 1);
  }
}
