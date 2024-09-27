import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IMedicalInformationRepository } from "~/application/repositories/medical-information.repository.interface";
import {
  MedicalInformation,
  MedicalInformationInsert,
  MedicalInformationUpdate,
} from "~/domain/entities/medical-information";
import {
  MedicalInformationNotFoundError,
  MemberAlreadyHasMedicalInformationError,
} from "~/domain/errors/medical-information";
import { MemberNotFoundError } from "~/domain/errors/members";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockMedicalInformationRepository
  implements IMedicalInformationRepository
{
  private medicalInformation: MedicalInformation[] =
    mockData.medicalInformation;

  async createMedicalInformation(
    medicalInformation: MedicalInformationInsert,
  ): Promise<MedicalInformation> {
    return startSpan(
      {
        name: "MockMedicalInformationRepository > createMedicalInformation",
      },
      () => {
        const member = mockData.members.find(
          (m) => m.id === medicalInformation.memberId,
        );

        if (!member) {
          throw new MemberNotFoundError("Member not found");
        }

        const existingMedicalInformation = this.medicalInformation.find(
          (mi) => mi.memberId === medicalInformation.memberId,
        );
        if (existingMedicalInformation) {
          throw new MemberAlreadyHasMedicalInformationError(
            "Member already has medical information",
          );
        }

        this.medicalInformation.push(medicalInformation);
        return medicalInformation;
      },
    );
  }

  async getMedicalInformationByMemberId(
    memberId: number,
  ): Promise<MedicalInformation | undefined> {
    return startSpan(
      {
        name: "MockMedicalInformationRepository > getMedicalInformationByMemberId",
      },
      () => {
        return this.medicalInformation.find((mi) => mi.memberId === memberId);
      },
    );
  }

  async getAllMedicalInformation(): Promise<MedicalInformation[]> {
    return startSpan(
      {
        name: "MockMedicalInformationRepository > getAllMedicalInformation",
      },
      () => {
        return this.medicalInformation;
      },
    );
  }

  async updateMedicalInformation(
    memberId: number,
    medicalInformation: MedicalInformationUpdate,
  ): Promise<MedicalInformation> {
    return startSpan(
      {
        name: "MockMedicalInformationRepository > updateMedicalInformation",
      },
      () => {
        const medicalInformationIndex = this.medicalInformation.findIndex(
          (mi) => mi.memberId === memberId,
        );
        if (medicalInformationIndex === -1) {
          throw new MedicalInformationNotFoundError(
            "Medical information not found",
          );
        }

        this.medicalInformation[medicalInformationIndex] = {
          ...this.medicalInformation[medicalInformationIndex]!,
          ...medicalInformation,
          asthma: {
            hasCondition:
              medicalInformation.asthma?.hasCondition ??
              this.medicalInformation[medicalInformationIndex]!.asthma
                .hasCondition,
            info:
              medicalInformation.asthma?.info ??
              this.medicalInformation[medicalInformationIndex]!.asthma.info,
          },
          bedwetting: {
            hasCondition:
              medicalInformation.bedwetting?.hasCondition ??
              this.medicalInformation[medicalInformationIndex]!.bedwetting
                .hasCondition,
            info:
              medicalInformation.bedwetting?.info ??
              this.medicalInformation[medicalInformationIndex]!.bedwetting.info,
          },
          diabetes: {
            hasCondition:
              medicalInformation.diabetes?.hasCondition ??
              this.medicalInformation[medicalInformationIndex]!.diabetes
                .hasCondition,
            info:
              medicalInformation.diabetes?.info ??
              this.medicalInformation[medicalInformationIndex]!.diabetes.info,
          },
          doctor: {
            name: {
              firstName:
                medicalInformation.doctor?.name?.firstName ??
                this.medicalInformation[medicalInformationIndex]!.doctor.name
                  .firstName,
              lastName:
                medicalInformation.doctor?.name?.lastName ??
                this.medicalInformation[medicalInformationIndex]!.doctor.name
                  .lastName,
            },
            phoneNumber:
              medicalInformation.doctor?.phoneNumber ??
              this.medicalInformation[medicalInformationIndex]!.doctor
                .phoneNumber,
          },
          epilepsy: {
            hasCondition:
              medicalInformation.epilepsy?.hasCondition ??
              this.medicalInformation[medicalInformationIndex]!.epilepsy
                .hasCondition,
            info:
              medicalInformation.epilepsy?.info ??
              this.medicalInformation[medicalInformationIndex]!.epilepsy.info,
          },
          hayFever: {
            hasCondition:
              medicalInformation.hayFever?.hasCondition ??
              this.medicalInformation[medicalInformationIndex]!.hayFever
                .hasCondition,
            info:
              medicalInformation.hayFever?.info ??
              this.medicalInformation[medicalInformationIndex]!.hayFever.info,
          },
          heartCondition: {
            hasCondition:
              medicalInformation.heartCondition?.hasCondition ??
              this.medicalInformation[medicalInformationIndex]!.heartCondition
                .hasCondition,
            info:
              medicalInformation.heartCondition?.info ??
              this.medicalInformation[medicalInformationIndex]!.heartCondition
                .info,
          },
          rheumatism: {
            hasCondition:
              medicalInformation.rheumatism?.hasCondition ??
              this.medicalInformation[medicalInformationIndex]!.rheumatism
                .hasCondition,
            info:
              medicalInformation.rheumatism?.info ??
              this.medicalInformation[medicalInformationIndex]!.rheumatism.info,
          },
          skinCondition: {
            hasCondition:
              medicalInformation.skinCondition?.hasCondition ??
              this.medicalInformation[medicalInformationIndex]!.skinCondition
                .hasCondition,
            info:
              medicalInformation.skinCondition?.info ??
              this.medicalInformation[medicalInformationIndex]!.skinCondition
                .info,
          },
          sleepwalking: {
            hasCondition:
              medicalInformation.sleepwalking?.hasCondition ??
              this.medicalInformation[medicalInformationIndex]!.sleepwalking
                .hasCondition,
            info:
              medicalInformation.sleepwalking?.info ??
              this.medicalInformation[medicalInformationIndex]!.sleepwalking
                .info,
          },
        };
        return this.medicalInformation[medicalInformationIndex];
      },
    );
  }

  async deleteMedicalInformation(memberId: number): Promise<void> {
    return startSpan(
      {
        name: "MockMedicalInformationRepository > deleteMedicalInformation",
      },
      () => {
        const medicalInformationIndex = this.medicalInformation.findIndex(
          (mi) => mi.memberId === memberId,
        );
        if (medicalInformationIndex === -1) {
          throw new MedicalInformationNotFoundError(
            "Medical information not found",
          );
        }

        this.medicalInformation.splice(medicalInformationIndex, 1);
      },
    );
  }

  async deleteAllMedicalInformation(): Promise<void> {
    return startSpan(
      {
        name: "MockMedicalInformationRepository > deleteAllMedicalInformation",
      },
      () => {
        this.medicalInformation = [];
      },
    );
  }
}
