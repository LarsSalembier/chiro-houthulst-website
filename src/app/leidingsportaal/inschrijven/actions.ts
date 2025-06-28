"use server";

import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import {
  type FullNewMemberData,
  MEMBER_MUTATIONS,
} from "~/server/db/queries/member-queries";
import { GROUP_QUERIES } from "~/server/db/queries/group-queries";
import { type WorkYear, type Group, type Gender } from "~/server/db/schema";

// Helper function to convert empty strings to undefined
function emptyStringToUndefined(value: string | undefined): string | undefined {
  return value?.trim() === "" ? undefined : value?.trim();
}

export async function getCurrentWorkYear(): Promise<WorkYear | null> {
  try {
    return await WORK_YEAR_QUERIES.getByDate();
  } catch (error) {
    console.error("Error getting current work year:", error);
    return null;
  }
}

export async function registerNewMember(memberData: FullNewMemberData) {
  try {
    // Sanitize the data before passing to the mutation
    const sanitizedData: FullNewMemberData = {
      ...memberData,
      // Sanitize member data
      firstName: memberData.firstName.trim(),
      lastName: memberData.lastName.trim(),
      emailAddress: emptyStringToUndefined(memberData.emailAddress),
      phoneNumber: emptyStringToUndefined(memberData.phoneNumber),

      // Sanitize parents data
      parents: memberData.parents.map((parent) => ({
        ...parent,
        firstName: parent.firstName.trim(),
        lastName: parent.lastName.trim(),
        emailAddress: parent.emailAddress.trim(),
        phoneNumber: parent.phoneNumber.trim(),
        address: {
          street: parent.address.street.trim(),
          houseNumber: parent.address.houseNumber.trim(),
          postalCode: parent.address.postalCode,
          municipality: parent.address.municipality.trim(),
        },
      })),

      // Sanitize emergency contact data
      emergencyContact: memberData.emergencyContact
        ? {
            ...memberData.emergencyContact,
            firstName: memberData.emergencyContact.firstName.trim(),
            lastName: memberData.emergencyContact.lastName.trim(),
            phoneNumber: memberData.emergencyContact.phoneNumber.trim(),
            relationship: emptyStringToUndefined(
              memberData.emergencyContact.relationship,
            ),
          }
        : undefined,

      // Sanitize medical information data
      medicalInformation: memberData.medicalInformation
        ? {
            ...memberData.medicalInformation,
            doctorFirstName:
              memberData.medicalInformation.doctorFirstName.trim(),
            doctorLastName: memberData.medicalInformation.doctorLastName.trim(),
            doctorPhoneNumber:
              memberData.medicalInformation.doctorPhoneNumber.trim(),
            asthmaDescription:
              memberData.medicalInformation.asthmaDescription.trim(),
            bedwettingDescription:
              memberData.medicalInformation.bedwettingDescription.trim(),
            epilepsyDescription:
              memberData.medicalInformation.epilepsyDescription.trim(),
            heartConditionDescription:
              memberData.medicalInformation.heartConditionDescription.trim(),
            hayFeverDescription:
              memberData.medicalInformation.hayFeverDescription.trim(),
            skinConditionDescription:
              memberData.medicalInformation.skinConditionDescription.trim(),
            rheumatismDescription:
              memberData.medicalInformation.rheumatismDescription.trim(),
            sleepwalkingDescription:
              memberData.medicalInformation.sleepwalkingDescription.trim(),
            diabetesDescription:
              memberData.medicalInformation.diabetesDescription.trim(),
            foodAllergies: memberData.medicalInformation.foodAllergies.trim(),
            substanceAllergies:
              memberData.medicalInformation.substanceAllergies.trim(),
            medicationAllergies:
              memberData.medicalInformation.medicationAllergies.trim(),
            medication: memberData.medicalInformation.medication.trim(),
            otherMedicalConditions:
              memberData.medicalInformation.otherMedicalConditions.trim(),
            otherRemarks: memberData.medicalInformation.otherRemarks.trim(),
          }
        : undefined,
    };

    return await MEMBER_MUTATIONS.registerMember(sanitizedData);
  } catch (error) {
    console.error("Error registering member:", error);
    throw error;
  }
}

export async function findGroupForMember(
  dateOfBirth: Date,
  gender: Gender,
): Promise<Group | null> {
  try {
    return await GROUP_QUERIES.findGroupForMember(dateOfBirth, gender);
  } catch (error) {
    console.error("Error finding group for member:", error);
    return null;
  }
}

export async function getAllGroups(): Promise<Group[]> {
  try {
    return await GROUP_QUERIES.getAll({ activeOnly: true });
  } catch (error) {
    console.error("Error getting all groups:", error);
    return [];
  }
}
