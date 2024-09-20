import {
  type EmergencyContactUpdate,
  type EmergencyContact,
  type EmergencyContactInsert,
} from "~/domain/entities/emergency-contact";

export interface IEmergencyContactsRepository {
  createEmergencyContact(
    emergencyContact: EmergencyContactInsert,
  ): Promise<EmergencyContact>;
  getEmergencyContact(memberId: number): Promise<EmergencyContact | undefined>;
  updateEmergencyContact(
    memberId: number,
    emergencyContact: EmergencyContactUpdate,
  ): Promise<EmergencyContact>;
  deleteEmergencyContact(memberId: number): Promise<void>;
}
