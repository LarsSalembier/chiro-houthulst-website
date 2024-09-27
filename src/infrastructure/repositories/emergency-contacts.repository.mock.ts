import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IEmergencyContactsRepository } from "~/application/repositories/emergency-contacts.repository.interface";
import {
  EmergencyContact,
  EmergencyContactInsert,
  EmergencyContactUpdate,
} from "~/domain/entities/emergency-contact";
import {
  EmergencyContactNotFoundError,
  MemberAlreadyHasEmergencyContactError,
} from "~/domain/errors/emergency-contacts";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockEmergencyContactsRepository
  implements IEmergencyContactsRepository
{
  private emergencyContacts: EmergencyContact[] = mockData.emergencyContacts;

  async createEmergencyContact(
    emergencyContact: EmergencyContactInsert,
  ): Promise<EmergencyContact> {
    return startSpan(
      { name: "MockEmergencyContactsRepository > createEmergencyContact" },
      () => {
        const existingEmergencyContact = this.emergencyContacts.find(
          (ec) => ec.memberId === emergencyContact.memberId,
        );

        if (existingEmergencyContact) {
          throw new MemberAlreadyHasEmergencyContactError(
            "Member already has an emergency contact",
          );
        }

        const newEmergencyContact: EmergencyContact = {
          memberId: emergencyContact.memberId,
          name: {
            firstName: emergencyContact.name.firstName,
            lastName: emergencyContact.name.lastName,
          },
          phoneNumber: emergencyContact.phoneNumber,
          relationship: emergencyContact.relationship,
        };

        this.emergencyContacts.push(newEmergencyContact);
        return newEmergencyContact;
      },
    );
  }

  async getEmergencyContactByMemberId(
    memberId: number,
  ): Promise<EmergencyContact | undefined> {
    return startSpan(
      {
        name: "MockEmergencyContactsRepository > getEmergencyContactByMemberId",
      },
      () => {
        const emergencyContact = this.emergencyContacts.find(
          (ec) => ec.memberId === memberId,
        );
        return emergencyContact;
      },
    );
  }

  async getAllEmergencyContacts(): Promise<EmergencyContact[]> {
    return startSpan(
      {
        name: "MockEmergencyContactsRepository > getAllEmergencyContacts",
      },
      () => {
        return this.emergencyContacts;
      },
    );
  }

  async updateEmergencyContact(
    memberId: number,
    emergencyContact: EmergencyContactUpdate,
  ): Promise<EmergencyContact> {
    return startSpan(
      { name: "MockEmergencyContactsRepository > updateEmergencyContact" },
      () => {
        const emergencyContactIndex = this.emergencyContacts.findIndex(
          (ec) => ec.memberId === memberId,
        );
        if (emergencyContactIndex === -1) {
          throw new EmergencyContactNotFoundError(
            "Emergency contact not found",
          );
        }

        this.emergencyContacts[emergencyContactIndex] = {
          ...this.emergencyContacts[emergencyContactIndex]!,
          ...emergencyContact,
          name: {
            firstName:
              emergencyContact.name?.firstName ??
              this.emergencyContacts[emergencyContactIndex]!.name.firstName,
            lastName:
              emergencyContact.name?.lastName ??
              this.emergencyContacts[emergencyContactIndex]!.name.lastName,
          },
        };

        return this.emergencyContacts[emergencyContactIndex];
      },
    );
  }

  async deleteEmergencyContact(memberId: number): Promise<void> {
    return startSpan(
      { name: "MockEmergencyContactsRepository > deleteEmergencyContact" },
      () => {
        const emergencyContactIndex = this.emergencyContacts.findIndex(
          (ec) => ec.memberId === memberId,
        );
        if (emergencyContactIndex === -1) {
          throw new EmergencyContactNotFoundError(
            "Emergency contact not found",
          );
        }

        this.emergencyContacts.splice(emergencyContactIndex, 1);
      },
    );
  }

  async deleteAllEmergencyContacts(): Promise<void> {
    return startSpan(
      {
        name: "MockEmergencyContactsRepository > deleteAllEmergencyContacts",
      },
      () => {
        this.emergencyContacts = [];
      },
    );
  }
}
