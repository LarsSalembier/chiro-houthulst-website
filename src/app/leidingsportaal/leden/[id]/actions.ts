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
}

// Helper function to convert empty strings to null
function emptyStringToNull(value: string | undefined): string | null {
  return value?.trim() === "" ? null : (value?.trim() ?? null);
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
  let groupChanged = false;
  let oldGroupId: number | null = null;
  let newGroupId: number | null = null;

  const result = await db.transaction(async (tx) => {
    try {
      // 1. Update basic member info with null conversion
      const memberData = {
        ...data.member,
        emailAddress: emptyStringToNull(data.member.emailAddress) ?? undefined,
        phoneNumber: emptyStringToNull(data.member.phoneNumber) ?? undefined,
      };
      await MEMBER_MUTATIONS.updateMemberDetails(memberId, memberData);

      // 2. Check if group needs to be updated based on new birthdate/gender
      const currentYearlyMembership = await tx
        .select()
        .from(yearlyMemberships)
        .where(eq(yearlyMemberships.memberId, memberId))
        .limit(1)
        .execute();

      if (currentYearlyMembership[0]) {
        oldGroupId = currentYearlyMembership[0].groupId;
        const newGroup = await GROUP_QUERIES.findGroupForMember(
          data.member.dateOfBirth,
          data.member.gender,
        );

        // If a new group is found and it's different from the current group, update it
        if (newGroup && newGroup.id !== currentYearlyMembership[0].groupId) {
          newGroupId = newGroup.id;
          groupChanged = true;
          await tx
            .update(yearlyMemberships)
            .set({ groupId: newGroup.id })
            .where(eq(yearlyMemberships.memberId, memberId))
            .execute();
        }
      }

      // 3. Update emergency contact with null conversion
      const emergencyContactData = {
        firstName: data.emergencyContact.firstName.trim(),
        lastName: data.emergencyContact.lastName.trim(),
        phoneNumber: data.emergencyContact.phoneNumber.trim(),
        relationship: emptyStringToNull(data.emergencyContact.relationship),
      };
      await tx
        .insert(emergencyContacts)
        .values({
          memberId: memberId,
          ...emergencyContactData,
        })
        .onConflictDoUpdate({
          target: emergencyContacts.memberId,
          set: emergencyContactData,
        })
        .execute();

      // 4. Update medical information with null conversion and field mapping
      const medicalData = {
        doctorFirstName: data.medicalInformation.doctorFirstName.trim(),
        doctorLastName: data.medicalInformation.doctorLastName.trim(),
        doctorPhoneNumber: data.medicalInformation.doctorPhoneNumber.trim(),
        tetanusVaccination: data.medicalInformation.tetanusVaccination,
        asthma: data.medicalInformation.asthma,
        asthmaInformation: data.medicalInformation.asthma
          ? emptyStringToNull(data.medicalInformation.asthmaDescription)
          : null,
        bedwetting: data.medicalInformation.bedwetting,
        bedwettingInformation: data.medicalInformation.bedwetting
          ? emptyStringToNull(data.medicalInformation.bedwettingDescription)
          : null,
        epilepsy: data.medicalInformation.epilepsy,
        epilepsyInformation: data.medicalInformation.epilepsy
          ? emptyStringToNull(data.medicalInformation.epilepsyDescription)
          : null,
        heartCondition: data.medicalInformation.heartCondition,
        heartConditionInformation: data.medicalInformation.heartCondition
          ? emptyStringToNull(data.medicalInformation.heartConditionDescription)
          : null,
        hayFever: data.medicalInformation.hayFever,
        hayFeverInformation: data.medicalInformation.hayFever
          ? emptyStringToNull(data.medicalInformation.hayFeverDescription)
          : null,
        skinCondition: data.medicalInformation.skinCondition,
        skinConditionInformation: data.medicalInformation.skinCondition
          ? emptyStringToNull(data.medicalInformation.skinConditionDescription)
          : null,
        rheumatism: data.medicalInformation.rheumatism,
        rheumatismInformation: data.medicalInformation.rheumatism
          ? emptyStringToNull(data.medicalInformation.rheumatismDescription)
          : null,
        sleepwalking: data.medicalInformation.sleepwalking,
        sleepwalkingInformation: data.medicalInformation.sleepwalking
          ? emptyStringToNull(data.medicalInformation.sleepwalkingDescription)
          : null,
        diabetes: data.medicalInformation.diabetes,
        diabetesInformation: data.medicalInformation.diabetes
          ? emptyStringToNull(data.medicalInformation.diabetesDescription)
          : null,
        foodAllergies: data.medicalInformation.hasFoodAllergies
          ? emptyStringToNull(data.medicalInformation.foodAllergies)
          : null,
        substanceAllergies: data.medicalInformation.hasSubstanceAllergies
          ? emptyStringToNull(data.medicalInformation.substanceAllergies)
          : null,
        medicationAllergies: data.medicalInformation.hasMedicationAllergies
          ? emptyStringToNull(data.medicalInformation.medicationAllergies)
          : null,
        medication: data.medicalInformation.hasMedication
          ? emptyStringToNull(data.medicalInformation.medication)
          : null,
        otherMedicalConditions: data.medicalInformation
          .hasOtherMedicalConditions
          ? emptyStringToNull(data.medicalInformation.otherMedicalConditions)
          : null,
        getsTiredQuickly: data.medicalInformation.getsTiredQuickly,
        canParticipateSports: data.medicalInformation.canParticipateSports,
        canSwim: data.medicalInformation.canSwim,
        otherRemarks: emptyStringToNull(data.medicalInformation.otherRemarks),
        permissionMedication: data.medicalInformation.permissionMedication,
      };

      await tx
        .insert(medicalInformation)
        .values({
          memberId: memberId,
          ...medicalData,
        })
        .onConflictDoUpdate({
          target: medicalInformation.memberId,
          set: medicalData,
        })
        .execute();

      // 5. Handle parents - this is complex because we need to:
      // - Remove parents that are no longer in the list
      // - Update existing parents
      // - Add new parents
      // - Handle addresses properly

      // Get current parents for this member
      const currentMemberParents = await tx
        .select()
        .from(membersParents)
        .where(eq(membersParents.memberId, memberId))
        .execute();

      // Create a map of current parent IDs for easy lookup
      const currentParentIds = new Set(
        currentMemberParents.map((mp) => mp.parentId),
      );

      // Process each parent in the new data
      for (const parentData of data.parents) {
        // Find or create address
        const addressData = {
          street: parentData.address.street.trim(),
          houseNumber: parentData.address.houseNumber.trim(),
          postalCode: parentData.address.postalCode,
          municipality: parentData.address.municipality.trim(),
        };
        const address = await ADDRESS_MUTATIONS.findOrCreate(addressData, tx);

        // Try to find existing parent by email (unique identifier)
        const existingParent = await tx
          .select()
          .from(parents)
          .where(eq(parents.emailAddress, parentData.emailAddress.trim()))
          .limit(1)
          .execute();

        let parent = existingParent[0];

        if (parent) {
          // Update existing parent
          await tx
            .update(parents)
            .set({
              firstName: parentData.firstName.trim(),
              lastName: parentData.lastName.trim(),
              phoneNumber: parentData.phoneNumber.trim(),
              relationship: parentData.relationship,
              addressId: address.id,
            })
            .where(eq(parents.id, parent.id))
            .execute();
        } else {
          // Create new parent
          const [newParent] = await tx
            .insert(parents)
            .values({
              firstName: parentData.firstName.trim(),
              lastName: parentData.lastName.trim(),
              emailAddress: parentData.emailAddress.trim(),
              phoneNumber: parentData.phoneNumber.trim(),
              relationship: parentData.relationship,
              addressId: address.id,
            })
            .returning()
            .execute();

          if (!newParent) throw new Error("Failed to create parent");
          parent = newParent;
        }

        // Update or create member-parent relationship
        await tx
          .insert(membersParents)
          .values({
            memberId: memberId,
            parentId: parent.id,
            isPrimary: parentData.isPrimary,
          })
          .onConflictDoUpdate({
            target: [membersParents.memberId, membersParents.parentId],
            set: { isPrimary: parentData.isPrimary },
          })
          .execute();

        // Remove from current parent IDs set
        currentParentIds.delete(parent.id);
      }

      // Remove parents that are no longer in the list
      for (const parentId of currentParentIds) {
        await MEMBER_MUTATIONS.removeParentFromMember(memberId, parentId);

        // Check if this parent is used by other members
        const otherMembers = await tx
          .select()
          .from(membersParents)
          .where(eq(membersParents.parentId, parentId))
          .execute();

        if (otherMembers.length === 0) {
          // Parent is not used by any other members, can be deleted
          const parentResult = await tx
            .select()
            .from(parents)
            .where(eq(parents.id, parentId))
            .limit(1)
            .execute();

          const parent = parentResult[0];

          if (parent) {
            await tx.delete(parents).where(eq(parents.id, parentId)).execute();

            // Check if address is used by other parents
            const otherParents = await tx
              .select()
              .from(parents)
              .where(eq(parents.addressId, parent.addressId))
              .execute();

            if (otherParents.length === 0) {
              // Address is not used by any other parents, can be deleted
              await ADDRESS_MUTATIONS.remove(parent.addressId, tx);
            }
          }
        }
      }

      // 6. Update payment information in yearlyMemberships
      const yearlyMembershipResult = await tx
        .select()
        .from(yearlyMemberships)
        .where(eq(yearlyMemberships.memberId, memberId))
        .limit(1)
        .execute();

      const yearlyMembership = yearlyMembershipResult[0];

      if (yearlyMembership) {
        await tx
          .update(yearlyMemberships)
          .set({
            paymentReceived: data.payment.paymentReceived,
            paymentMethod: data.payment.paymentMethod ?? null,
            paymentDate: data.payment.paymentDate ?? null,
          })
          .where(eq(yearlyMemberships.memberId, memberId))
          .execute();
      }

      // Return updated member
      return await MEMBER_QUERIES.getFullMemberDetails(memberId);
    } catch (error) {
      console.error("Error updating member:", error);
      throw new Error("Failed to update member");
    }
  });

  // Revalidate relevant paths after successful update
  revalidatePath(`/leidingsportaal/leden/${memberId}`);
  revalidatePath(`/leidingsportaal/leden`);
  revalidatePath(`/leidingsportaal/groepen`);

  return result;
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
