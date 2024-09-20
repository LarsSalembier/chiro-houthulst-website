import { startSpan } from "@sentry/nextjs";

import { getInjection } from "di/container";
import { type RegistrationFormValues } from "~/app/(public)/ledenportaal/nieuw-lid-inschrijven/schemas";
import { type Address } from "~/domain/entities/address";
import { type Member } from "~/domain/entities/member";
import { AddressAlreadyExistsError } from "~/domain/errors/addresses";
import { isLoggedIn } from "~/lib/auth";

export function signUpMemberUseCase(input: {
  registrationFormValues: RegistrationFormValues;
}): Promise<Member> {
  return startSpan(
    { name: "signUpMember Use Case", op: "function" },
    async () => {
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
        throw new Error("User is not logged in");
      }

      // Aanmaken van lid
      const member = await membersRepository.createMember({
        name: {
          firstName: input.registrationFormValues.memberFirstName,
          lastName: input.registrationFormValues.memberLastName,
        },
        gender: input.registrationFormValues.memberGender,
        dateOfBirth: input.registrationFormValues.memberDateOfBirth,
        phoneNumber: input.registrationFormValues.memberPhoneNumber ?? null,
        emailAddress: input.registrationFormValues.memberEmailAddress ?? null,
        gdprPermissionToPublishPhotos:
          input.registrationFormValues.permissionPhotos,
      });

      // Aanmaken van ouders
      for (let i = 0; i < input.registrationFormValues.parents.length; i++) {
        const parent = input.registrationFormValues.parents[i]!;
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
      }

      // Aanmaken van extra contactpersoon
      await emergencyContactsRepository.createEmergencyContact({
        memberId: member.id,
        name: {
          firstName: input.registrationFormValues.extraContactPersonFirstName,
          lastName: input.registrationFormValues.extraContactPersonLastName,
        },
        phoneNumber: input.registrationFormValues.extraContactPersonPhoneNumber,
        relationship:
          input.registrationFormValues.extraContactPersonRelationship ?? null,
      });

      // Aanmaken van medische informatie
      await medicalInformationRepository.createMedicalInformation({
        memberId: member.id,
        pastMedicalHistory:
          input.registrationFormValues.pastMedicalHistory ?? null,
        tetanusVaccination:
          input.registrationFormValues.tetanusVaccination === "true"
            ? true
            : false,
        tetanusVaccinationYear:
          input.registrationFormValues.tetanusVaccinationYear ?? null,
        asthma: {
          hasCondition: input.registrationFormValues.asthma,
          info: input.registrationFormValues.asthmaInfo ?? null,
        },
        bedwetting: {
          hasCondition: input.registrationFormValues.bedwetting,
          info: input.registrationFormValues.bedwettingInfo ?? null,
        },
        epilepsy: {
          hasCondition: input.registrationFormValues.epilepsy,
          info: input.registrationFormValues.epilepsyInfo ?? null,
        },
        heartCondition: {
          hasCondition: input.registrationFormValues.heartCondition,
          info: input.registrationFormValues.heartConditionInfo ?? null,
        },
        hayFever: {
          hasCondition: input.registrationFormValues.hayFever,
          info: input.registrationFormValues.hayFeverInfo ?? null,
        },
        skinCondition: {
          hasCondition: input.registrationFormValues.skinCondition,
          info: input.registrationFormValues.skinConditionInfo ?? null,
        },
        rheumatism: {
          hasCondition: input.registrationFormValues.rheumatism,
          info: input.registrationFormValues.rheumatismInfo ?? null,
        },
        sleepwalking: {
          hasCondition: input.registrationFormValues.sleepwalking,
          info: input.registrationFormValues.sleepwalkingInfo ?? null,
        },
        diabetes: {
          hasCondition: input.registrationFormValues.diabetes,
          info: input.registrationFormValues.diabetesInfo ?? null,
        },
        otherMedicalConditions:
          input.registrationFormValues.otherMedicalConditions ?? null,
        foodAllergies: input.registrationFormValues.foodAllergiesInfo ?? null,
        substanceAllergies:
          input.registrationFormValues.substanceAllergiesInfo ?? null,
        medicationAllergies:
          input.registrationFormValues.medicationAllergiesInfo ?? null,
        medication: input.registrationFormValues.medication ?? null,
        getsTiredQuickly:
          input.registrationFormValues.getsTiredQuickly === "true"
            ? true
            : false,
        canParticipateSports:
          input.registrationFormValues.canParticipateSports === "true"
            ? true
            : false,
        canSwim: input.registrationFormValues.canSwim === "true" ? true : false,
        otherRemarks: input.registrationFormValues.otherRemarks ?? null,
        permissionMedication:
          input.registrationFormValues.hasToTakeMedication === "true"
            ? true
            : false,
        doctor: {
          name: {
            firstName: input.registrationFormValues.doctorFirstName,
            lastName: input.registrationFormValues.doctorLastName,
          },
          phoneNumber: input.registrationFormValues.doctorPhoneNumber,
        },
      });

      // Get the current workyear
      const workYearsRepository = getInjection("IWorkyearsRepository");
      const currentWorkYear = await workYearsRepository.getWorkyearByDate(
        new Date(),
      );

      if (!currentWorkYear) {
        throw new Error(
          "Er is nog geen werkjaar gestart. Je kan nog niet inschrijven.",
        );
      }

      // Aanmaken van inschrijving voor huidig werkjaar
      await yearlyMembershipsRepository.createYearlyMembership({
        memberId: member.id,
        groupId: input.registrationFormValues.memberGroupId,
        workYearId: currentWorkYear.id,
        paymentReceived: false,
        paymentMethod: null,
        paymentDate: null,
      });

      return member;
    },
  );
}
