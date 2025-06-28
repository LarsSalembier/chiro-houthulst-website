"use server";

import {
  MEMBER_QUERIES,
  MEMBER_MUTATIONS,
} from "~/server/db/queries/member-queries";
import { ADDRESS_MUTATIONS } from "~/server/db/queries/address-queries";
import { GROUP_QUERIES } from "~/server/db/queries/group-queries";
import {
  type PaymentMethod,
  type Gender,
  type ParentRelationship,
  members,
  emergencyContacts,
  medicalInformation,
  membersParents,
  parents,
  yearlyMemberships,
  type Group,
} from "~/server/db/schema";
import { db } from "~/server/db/db";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface UpdateMemberData {
  member: {
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: Date;
    emailAddress?: string;
    phoneNumber?: string;
    gdprPermissionToPublishPhotos: boolean;
  };
  parents: Array<{
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    relationship: ParentRelationship;
    address: {
      street: string;
      houseNumber: string;
      postalCode: number;
      municipality: string;
    };
    isPrimary: boolean;
  }>;
  emergencyContact: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    relationship: string;
  };
  medicalInformation: {
    doctorFirstName: string;
    doctorLastName: string;
    doctorPhoneNumber: string;
    tetanusVaccination: boolean;
    asthma: boolean;
    asthmaDescription: string;
    bedwetting: boolean;
    bedwettingDescription: string;
    epilepsy: boolean;
    epilepsyDescription: string;
    heartCondition: boolean;
    heartConditionDescription: string;
    hayFever: boolean;
    hayFeverDescription: string;
    skinCondition: boolean;
    skinConditionDescription: string;
    rheumatism: boolean;
    rheumatismDescription: string;
    sleepwalking: boolean;
    sleepwalkingDescription: string;
    diabetes: boolean;
    diabetesDescription: string;
    hasFoodAllergies: boolean;
    foodAllergies: string;
    hasSubstanceAllergies: boolean;
    substanceAllergies: string;
    hasMedicationAllergies: boolean;
    medicationAllergies: string;
    hasMedication: boolean;
    medication: string;
    hasOtherMedicalConditions: boolean;
    otherMedicalConditions: string;
    getsTiredQuickly: boolean;
    canParticipateSports: boolean;
    canSwim: boolean;
    otherRemarks: string;
    permissionMedication: boolean;
  };
  payment: {
    paymentReceived: boolean;
    paymentMethod?: PaymentMethod;
    paymentDate?: Date;
  };
  groupId?: number;
}

// Helper function to convert empty strings to undefined
function emptyStringToUndefined(value: string | undefined): string | undefined {
  return value?.trim() === "" ? undefined : value?.trim();
}

export async function getFullMemberDetails(memberId: number) {
  try {
    const member = await MEMBER_QUERIES.getFullMemberDetails(memberId);
    return member;
  } catch (error) {
    console.error("Error fetching member details:", error);
    throw new Error("Failed to fetch member details");
  }
}

export async function updateMember(memberId: number, data: UpdateMemberData) {
  try {
    // Sanitize the data before passing to the mutation
    const sanitizedData = {
      firstName: data.member.firstName.trim(),
      lastName: data.member.lastName.trim(),
      gender: data.member.gender,
      dateOfBirth: data.member.dateOfBirth,
      emailAddress: emptyStringToUndefined(data.member.emailAddress),
      phoneNumber: emptyStringToUndefined(data.member.phoneNumber),
      gdprPermissionToPublishPhotos: data.member.gdprPermissionToPublishPhotos,
      parents: data.parents.map((parent) => ({
        firstName: parent.firstName.trim(),
        lastName: parent.lastName.trim(),
        emailAddress: parent.emailAddress.trim(),
        phoneNumber: parent.phoneNumber.trim(),
        relationship: parent.relationship,
        address: {
          street: parent.address.street.trim(),
          houseNumber: parent.address.houseNumber.trim(),
          postalCode: parent.address.postalCode,
          municipality: parent.address.municipality.trim(),
        },
        isPrimary: parent.isPrimary,
      })),
      emergencyContact: data.emergencyContact
        ? {
            firstName: data.emergencyContact.firstName.trim(),
            lastName: data.emergencyContact.lastName.trim(),
            phoneNumber: data.emergencyContact.phoneNumber.trim(),
            relationship: emptyStringToUndefined(
              data.emergencyContact.relationship,
            ),
          }
        : undefined,
      medicalInformation: data.medicalInformation
        ? {
            ...data.medicalInformation,
            doctorFirstName: data.medicalInformation.doctorFirstName.trim(),
            doctorLastName: data.medicalInformation.doctorLastName.trim(),
            doctorPhoneNumber: data.medicalInformation.doctorPhoneNumber.trim(),
            asthmaDescription: data.medicalInformation.asthmaDescription.trim(),
            bedwettingDescription:
              data.medicalInformation.bedwettingDescription.trim(),
            epilepsyDescription:
              data.medicalInformation.epilepsyDescription.trim(),
            heartConditionDescription:
              data.medicalInformation.heartConditionDescription.trim(),
            hayFeverDescription:
              data.medicalInformation.hayFeverDescription.trim(),
            skinConditionDescription:
              data.medicalInformation.skinConditionDescription.trim(),
            rheumatismDescription:
              data.medicalInformation.rheumatismDescription.trim(),
            sleepwalkingDescription:
              data.medicalInformation.sleepwalkingDescription.trim(),
            diabetesDescription:
              data.medicalInformation.diabetesDescription.trim(),
            foodAllergies: data.medicalInformation.foodAllergies.trim(),
            substanceAllergies:
              data.medicalInformation.substanceAllergies.trim(),
            medicationAllergies:
              data.medicalInformation.medicationAllergies.trim(),
            medication: data.medicalInformation.medication.trim(),
            otherMedicalConditions:
              data.medicalInformation.otherMedicalConditions.trim(),
            otherRemarks: data.medicalInformation.otherRemarks.trim(),
          }
        : undefined,
      workYearId: 0, // This will be ignored in the update function
      paymentReceived: data.payment.paymentReceived,
      paymentMethod: data.payment.paymentMethod,
      paymentDate: data.payment.paymentDate,
      groupId: data.groupId,
    };

    // Use the smart update function
    const updatedMember = await MEMBER_MUTATIONS.updateMember(
      memberId,
      sanitizedData,
    );

    // Revalidate relevant paths after successful update
    revalidatePath(`/leidingsportaal/leden/${memberId}`);
    revalidatePath(`/leidingsportaal/leden`);
    revalidatePath(`/leidingsportaal/groepen`);

    return updatedMember;
  } catch (error) {
    console.error("Error updating member:", error);
    throw new Error("Failed to update member");
  }
}

// Kamp Inschrijving Actions
export async function subscribeToCamp(
  memberId: number,
  workYearId: number,
  paymentMethod?: PaymentMethod,
) {
  await MEMBER_QUERIES.subscribeToCamp(memberId, workYearId, paymentMethod);
  revalidatePath(`/leidingsportaal/leden/${memberId}`);
}

export async function unsubscribeFromCamp(
  memberId: number,
  workYearId: number,
) {
  await MEMBER_QUERIES.unsubscribeFromCamp(memberId, workYearId);
  revalidatePath(`/leidingsportaal/leden/${memberId}`);
}

export async function markCampPaymentReceived(
  memberId: number,
  workYearId: number,
  paymentReceived: boolean,
  paymentMethod?: PaymentMethod,
  paymentDate?: Date,
) {
  await MEMBER_QUERIES.markCampPaymentReceived(
    memberId,
    workYearId,
    paymentReceived,
    paymentMethod,
    paymentDate,
  );
  revalidatePath(`/leidingsportaal/leden/${memberId}`);
}

export async function getAllGroups(): Promise<Group[]> {
  try {
    return await GROUP_QUERIES.getAll({ activeOnly: true });
  } catch (error) {
    console.error("Error getting all groups:", error);
    return [];
  }
}
