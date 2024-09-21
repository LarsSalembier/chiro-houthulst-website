import { captureException, startSpan } from "@sentry/nextjs";

import { getInjection } from "di/container";
import { type RegistrationFormData } from "~/app/(public)/ledenportaal/nieuw-lid-inschrijven/schemas";
import { type Address } from "~/domain/entities/address";
import { AddressAlreadyExistsError } from "~/domain/errors/addresses";
import { MemberAlreadyHasEmergencyContactError } from "~/domain/errors/emergency-contacts";
import { MemberAlreadyHasMedicalInformationError } from "~/domain/errors/medical-information";
import { MemberAlreadyExistsError } from "~/domain/errors/members";
import {
  ParentAlreadyExistsError,
  ParentAlreadyLinkedToMemberError,
} from "~/domain/errors/parents";
import { MemberAlreadyHasYearlyMembershipError } from "~/domain/errors/yearly-memberships";
import { isLeiding, isLoggedIn } from "~/lib/auth";

export function signUpMemberUseCase(input: { formData: RegistrationFormData }) {
  return startSpan(
    { name: "signUpMember Use Case", op: "function" },

    async () => {
      try {
        const membersRepository = getInjection("IMembersRepository");
        const parentsRepository = getInjection("IParentsRepository");
        const addressesRepository = getInjection("IAddressesRepository");
        const emergencyContactsRepository = getInjection(
          "IEmergencyContactsRepository",
        );
        const medicalInformationRepository = getInjection(
          "IMedicalInformationRepository",
        );
        const yearlyMembershipsRepository = getInjection(
          "IYearlyMembershipsRepository",
        );

        if (!isLoggedIn()) {
          return { error: "Je moet ingelogd zijn om een lid in te schrijven." };
        }

        if (!isLeiding()) {
          return {
            error:
              "Je moet leiding zijn om een lid in te schrijven. Als je denkt dat dit een fout is, neem dan contact op met de beheerder.",
          };
        }

        let member;

        // Aanmaken van lid
        try {
          member = await membersRepository.createMember({
            name: {
              firstName: input.formData.memberFirstName,
              lastName: input.formData.memberLastName,
            },
            gender: input.formData.memberGender,
            dateOfBirth: input.formData.memberDateOfBirth,
            phoneNumber: input.formData.memberPhoneNumber ?? null,
            emailAddress: input.formData.memberEmailAddress ?? null,
            gdprPermissionToPublishPhotos: input.formData.permissionPhotos,
          });
        } catch (error) {
          if (error instanceof MemberAlreadyExistsError) {
            // Update existing member
            const member =
              await membersRepository.getMemberByNameAndDateOfBirth(
                input.formData.memberFirstName,
                input.formData.memberLastName,
                input.formData.memberDateOfBirth,
              );

            if (member) {
              await membersRepository.updateMember(member.id, {
                name: {
                  firstName: input.formData.memberFirstName,
                  lastName: input.formData.memberLastName,
                },
                dateOfBirth: input.formData.memberDateOfBirth,
                gender: input.formData.memberGender,
                phoneNumber: input.formData.memberPhoneNumber ?? null,
                emailAddress: input.formData.memberEmailAddress ?? null,
                gdprPermissionToPublishPhotos: input.formData.permissionPhotos,
              });
            }

            return;
          }

          throw error;
        }

        // Aanmaken van ouders
        for (let i = 0; i < input.formData.parents.length; i++) {
          const parent = input.formData.parents[i]!;
          const isPrimary = i === 0;

          let address: Address;

          try {
            address = await addressesRepository.createAddress({
              street: parent.street,
              houseNumber: parent.houseNumber,
              box: parent.bus ?? null,
              postalCode: parent.postalCode,
              municipality: parent.municipality,
            });
          } catch (error) {
            if (error instanceof AddressAlreadyExistsError) {
              const result = await addressesRepository.getAddress(
                parent.street,
                parent.houseNumber,
                parent.bus ?? null,
                parent.municipality,
                parent.postalCode,
              );

              if (result) {
                address = result;
              } else {
                throw error;
              }
            } else {
              throw error;
            }
          }

          try {
            const createdParent = await parentsRepository.createParent({
              name: {
                firstName: parent.firstName,
                lastName: parent.lastName,
              },
              phoneNumber: parent.phoneNumber,
              emailAddress: parent.emailAddress,
              relationship: parent.type,
              addressId: address.id,
            });

            await parentsRepository.addMemberToParent(
              member.id,
              createdParent.id,
              isPrimary,
            );
          } catch (error) {
            if (error instanceof ParentAlreadyExistsError) {
              const result = await parentsRepository.getParentByEmail(
                parent.emailAddress,
              );

              if (result) {
                // Update existing parent
                await parentsRepository.updateParent(result.id, {
                  name: {
                    firstName: parent.firstName,
                    lastName: parent.lastName,
                  },
                  phoneNumber: parent.phoneNumber,
                  emailAddress: parent.emailAddress,
                  relationship: parent.type,
                  addressId: address.id,
                });

                try {
                  await parentsRepository.addMemberToParent(
                    member.id,
                    result.id,
                    isPrimary,
                  );
                } catch (error) {
                  if (error instanceof ParentAlreadyLinkedToMemberError) {
                    // Do nothing
                  }
                }
              }

              return;
            }

            if (error instanceof ParentAlreadyLinkedToMemberError) {
              return;
            }

            throw error;
          }
        }

        // Aanmaken van extra contactpersoon
        try {
          await emergencyContactsRepository.createEmergencyContact({
            memberId: member.id,
            name: {
              firstName: input.formData.extraContactPersonFirstName,
              lastName: input.formData.extraContactPersonLastName,
            },
            phoneNumber: input.formData.extraContactPersonPhoneNumber,
            relationship: input.formData.extraContactPersonRelationship ?? null,
          });
        } catch (error) {
          if (error instanceof MemberAlreadyHasEmergencyContactError) {
            // update existing emergency contact
            await emergencyContactsRepository.updateEmergencyContact(
              member.id,
              {
                name: {
                  firstName: input.formData.extraContactPersonFirstName,
                  lastName: input.formData.extraContactPersonLastName,
                },
                phoneNumber: input.formData.extraContactPersonPhoneNumber,
                relationship:
                  input.formData.extraContactPersonRelationship ?? null,
              },
            );

            return;
          }

          throw error;
        }

        // Aanmaken van medische informatie
        try {
          await medicalInformationRepository.createMedicalInformation({
            memberId: member.id,
            pastMedicalHistory: input.formData.pastMedicalHistory ?? null,
            tetanusVaccination:
              input.formData.tetanusVaccination === "true" ? true : false,
            tetanusVaccinationYear:
              input.formData.tetanusVaccinationYear ?? null,
            asthma: {
              hasCondition: input.formData.asthma,
              info: input.formData.asthmaInfo ?? null,
            },
            bedwetting: {
              hasCondition: input.formData.bedwetting,
              info: input.formData.bedwettingInfo ?? null,
            },
            epilepsy: {
              hasCondition: input.formData.epilepsy,
              info: input.formData.epilepsyInfo ?? null,
            },
            heartCondition: {
              hasCondition: input.formData.heartCondition,
              info: input.formData.heartConditionInfo ?? null,
            },
            hayFever: {
              hasCondition: input.formData.hayFever,
              info: input.formData.hayFeverInfo ?? null,
            },
            skinCondition: {
              hasCondition: input.formData.skinCondition,
              info: input.formData.skinConditionInfo ?? null,
            },
            rheumatism: {
              hasCondition: input.formData.rheumatism,
              info: input.formData.rheumatismInfo ?? null,
            },
            sleepwalking: {
              hasCondition: input.formData.sleepwalking,
              info: input.formData.sleepwalkingInfo ?? null,
            },
            diabetes: {
              hasCondition: input.formData.diabetes,
              info: input.formData.diabetesInfo ?? null,
            },
            otherMedicalConditions:
              input.formData.otherMedicalConditions ?? null,
            foodAllergies: input.formData.foodAllergiesInfo ?? null,
            substanceAllergies: input.formData.substanceAllergiesInfo ?? null,
            medicationAllergies: input.formData.medicationAllergiesInfo ?? null,
            medication: input.formData.medication ?? null,
            getsTiredQuickly:
              input.formData.getsTiredQuickly === "true" ? true : false,
            canParticipateSports:
              input.formData.canParticipateSports === "true" ? true : false,
            canSwim: input.formData.canSwim === "true" ? true : false,
            otherRemarks: input.formData.otherRemarks ?? null,
            permissionMedication:
              input.formData.hasToTakeMedication === "true" ? true : false,
            doctor: {
              name: {
                firstName: input.formData.doctorFirstName,
                lastName: input.formData.doctorLastName,
              },
              phoneNumber: input.formData.doctorPhoneNumber,
            },
          });
        } catch (error) {
          if (error instanceof MemberAlreadyHasMedicalInformationError) {
            // Update existing medical information
            await medicalInformationRepository.updateMedicalInformation(
              member.id,
              {
                pastMedicalHistory: input.formData.pastMedicalHistory ?? null,
                tetanusVaccination:
                  input.formData.tetanusVaccination === "true" ? true : false,
                tetanusVaccinationYear:
                  input.formData.tetanusVaccinationYear ?? null,
                asthma: {
                  hasCondition: input.formData.asthma,
                  info: input.formData.asthmaInfo ?? null,
                },
                bedwetting: {
                  hasCondition: input.formData.bedwetting,
                  info: input.formData.bedwettingInfo ?? null,
                },
                epilepsy: {
                  hasCondition: input.formData.epilepsy,
                  info: input.formData.epilepsyInfo ?? null,
                },
                heartCondition: {
                  hasCondition: input.formData.heartCondition,
                  info: input.formData.heartConditionInfo ?? null,
                },
                hayFever: {
                  hasCondition: input.formData.hayFever,
                  info: input.formData.hayFeverInfo ?? null,
                },
                skinCondition: {
                  hasCondition: input.formData.skinCondition,
                  info: input.formData.skinConditionInfo ?? null,
                },
                rheumatism: {
                  hasCondition: input.formData.rheumatism,
                  info: input.formData.rheumatismInfo ?? null,
                },
                sleepwalking: {
                  hasCondition: input.formData.sleepwalking,
                  info: input.formData.sleepwalkingInfo ?? null,
                },
                diabetes: {
                  hasCondition: input.formData.diabetes,
                  info: input.formData.diabetesInfo ?? null,
                },
                otherMedicalConditions:
                  input.formData.otherMedicalConditions ?? null,
                foodAllergies: input.formData.foodAllergiesInfo ?? null,
                substanceAllergies:
                  input.formData.substanceAllergiesInfo ?? null,
                medicationAllergies:
                  input.formData.medicationAllergiesInfo ?? null,
                medication: input.formData.medication ?? null,
                getsTiredQuickly:
                  input.formData.getsTiredQuickly === "true" ? true : false,
                canParticipateSports:
                  input.formData.canParticipateSports === "true" ? true : false,
                canSwim: input.formData.canSwim === "true" ? true : false,
                otherRemarks: input.formData.otherRemarks ?? null,
                permissionMedication:
                  input.formData.hasToTakeMedication === "true" ? true : false,
                doctor: {
                  name: {
                    firstName: input.formData.doctorFirstName,
                    lastName: input.formData.doctorLastName,
                  },
                  phoneNumber: input.formData.doctorPhoneNumber,
                },
              },
            );
          }
        }

        // Get the current workyear
        const workYearsRepository = getInjection("IWorkyearsRepository");
        const currentWorkYear = await workYearsRepository.getWorkyearByDate(
          new Date(),
        );

        if (!currentWorkYear) {
          return {
            error:
              "Er is nog geen werkjaar opgestart, dus je kan geen lid inschrijven.",
          };
        }

        // Aanmaken van inschrijving voor huidig werkjaar
        try {
          await yearlyMembershipsRepository.createYearlyMembership({
            memberId: member.id,
            groupId: input.formData.memberGroupId,
            workYearId: currentWorkYear.id,
            paymentReceived: false,
            paymentMethod: null,
            paymentDate: null,
          });
        } catch (error) {
          if (error instanceof MemberAlreadyHasYearlyMembershipError) {
            return;
          }

          throw error;
        }

        return member;
      } catch (error) {
        captureException(error);
        return {
          error:
            "Er is een onbekende fout opgetreden bij het aanmaken van het lid. De beheerder is op de hoogte gebracht. Probeer het later opnieuw.",
        };
      }
    },
  );
}
