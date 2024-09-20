import { injectable } from "inversify";
import { type IMedicalInformationRepository } from "~/application/repositories/medical-information.repository.interface";
import {
  type MedicalInformation,
  type MedicalInformationInsert,
  type MedicalInformationUpdate,
} from "~/domain/entities/medical-information";
import {
  MedicalInformationNotFoundError,
  MemberAlreadyHasMedicalInformationError,
} from "~/domain/errors/medical-information";
import { MemberNotFoundError } from "~/domain/errors/members";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";

@injectable()
export class MockMedicalInformationRepository
  implements IMedicalInformationRepository
{
  private _medicalInformationStore = new Map<number, MedicalInformation>();

  constructor(private readonly membersRepository: IMembersRepository) {}

  private mapToEntity(
    medicalInfo: MedicalInformationInsert,
  ): MedicalInformation {
    return {
      ...medicalInfo,
      asthma: {
        hasCondition: medicalInfo.asthma.hasCondition,
        info: medicalInfo.asthma.info,
      },
      bedwetting: {
        hasCondition: medicalInfo.bedwetting.hasCondition,
        info: medicalInfo.bedwetting.info,
      },
      epilepsy: {
        hasCondition: medicalInfo.epilepsy.hasCondition,
        info: medicalInfo.epilepsy.info,
      },
      heartCondition: {
        hasCondition: medicalInfo.heartCondition.hasCondition,
        info: medicalInfo.heartCondition.info,
      },
      hayFever: {
        hasCondition: medicalInfo.hayFever.hasCondition,
        info: medicalInfo.hayFever.info,
      },
      skinCondition: {
        hasCondition: medicalInfo.skinCondition.hasCondition,
        info: medicalInfo.skinCondition.info,
      },
      rheumatism: {
        hasCondition: medicalInfo.rheumatism.hasCondition,
        info: medicalInfo.rheumatism.info,
      },
      sleepwalking: {
        hasCondition: medicalInfo.sleepwalking.hasCondition,
        info: medicalInfo.sleepwalking.info,
      },
      diabetes: {
        hasCondition: medicalInfo.diabetes.hasCondition,
        info: medicalInfo.diabetes.info,
      },
      doctor: {
        name: {
          firstName: medicalInfo.doctor.name.firstName,
          lastName: medicalInfo.doctor.name.lastName,
        },
        phoneNumber: medicalInfo.doctor.phoneNumber,
      },
    };
  }

  /**
   * Creates new medical information for a member.
   *
   * @param medicalInformation The medical information data to insert.
   * @returns The created medical information.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberAlreadyHasMedicalInformationError} If the member already has medical information.
   */
  async createMedicalInformation(
    medicalInformation: MedicalInformationInsert,
  ): Promise<MedicalInformation> {
    // Check if the member exists
    const memberExists = await this.membersRepository.getMember(
      medicalInformation.memberId,
    );

    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    // Check if medical information already exists for this member
    if (this._medicalInformationStore.has(medicalInformation.memberId)) {
      throw new MemberAlreadyHasMedicalInformationError(
        "Member already has medical information",
      );
    }

    // Create and store the medical information
    const newMedicalInfo = this.mapToEntity(medicalInformation);
    this._medicalInformationStore.set(
      medicalInformation.memberId,
      newMedicalInfo,
    );
    return newMedicalInfo;
  }

  /**
   * Gets medical information for a member.
   *
   * @param memberId The ID of the member whose medical information to retrieve.
   * @returns The medical information if found, undefined otherwise.
   * @throws {MemberNotFoundError} If the member is not found.
   */
  async getMedicalInformation(
    memberId: number,
  ): Promise<MedicalInformation | undefined> {
    // Check if the member exists
    const memberExists = await this.membersRepository.getMember(memberId);

    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    return this._medicalInformationStore.get(memberId);
  }

  /**
   * Updates an existing medical information for a member.
   *
   * @param memberId The ID of the member whose medical information to update.
   * @param medicalInformation The updated medical information data.
   * @returns The updated medical information.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MedicalInformationNotFoundError} If the medical information is not found.
   */
  async updateMedicalInformation(
    memberId: number,
    medicalInformation: MedicalInformationUpdate,
  ): Promise<MedicalInformation> {
    // Check if the member exists
    const memberExists = await this.membersRepository.getMember(memberId);

    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const existingMedicalInfo = this._medicalInformationStore.get(memberId);

    if (!existingMedicalInfo) {
      throw new MedicalInformationNotFoundError(
        "Medical information not found",
      );
    }

    // Update the medical information
    const updatedMedicalInfo: MedicalInformation = {
      ...existingMedicalInfo,
      ...medicalInformation,
      asthma: {
        ...existingMedicalInfo.asthma,
        ...medicalInformation.asthma,
      },
      bedwetting: {
        ...existingMedicalInfo.bedwetting,
        ...medicalInformation.bedwetting,
      },
      epilepsy: {
        ...existingMedicalInfo.epilepsy,
        ...medicalInformation.epilepsy,
      },
      heartCondition: {
        ...existingMedicalInfo.heartCondition,
        ...medicalInformation.heartCondition,
      },
      hayFever: {
        ...existingMedicalInfo.hayFever,
        ...medicalInformation.hayFever,
      },
      skinCondition: {
        ...existingMedicalInfo.skinCondition,
        ...medicalInformation.skinCondition,
      },
      rheumatism: {
        ...existingMedicalInfo.rheumatism,
        ...medicalInformation.rheumatism,
      },
      sleepwalking: {
        ...existingMedicalInfo.sleepwalking,
        ...medicalInformation.sleepwalking,
      },
      diabetes: {
        ...existingMedicalInfo.diabetes,
        ...medicalInformation.diabetes,
      },
      doctor: {
        ...existingMedicalInfo.doctor,
        ...medicalInformation.doctor,
        name: {
          ...existingMedicalInfo.doctor.name,
          ...medicalInformation.doctor?.name,
        },
      },
    };

    this._medicalInformationStore.set(memberId, updatedMedicalInfo);
    return updatedMedicalInfo;
  }

  /**
   * Deletes medical information for a member.
   *
   * @param memberId The ID of the member whose medical information to delete.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MedicalInformationNotFoundError} If the medical information is not found.
   */
  async deleteMedicalInformation(memberId: number): Promise<void> {
    // Check if the member exists
    const memberExists = await this.membersRepository.getMember(memberId);

    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const existingMedicalInfo = this._medicalInformationStore.get(memberId);

    if (!existingMedicalInfo) {
      throw new MedicalInformationNotFoundError(
        "Medical information not found",
      );
    }

    this._medicalInformationStore.delete(memberId);
  }
}
