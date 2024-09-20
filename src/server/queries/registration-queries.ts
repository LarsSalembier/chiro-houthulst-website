import { auth } from "@clerk/nextjs/server";
import { type RegistrationFormValues } from "~/app/(public)/ledenportaal/nieuw-lid-inschrijven/schemas";
import { isLoggedIn } from "~/lib/auth";
import { AuthenticationError } from "~/lib/errors";
import { db } from "../../../drizzle";
import {
  addresses,
  auditLogs,
  extraContactPersons,
  medicalInformation,
  memberExtraContactPersons,
  members,
  membersParents,
  parentAddresses,
  parents,
} from "../../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function getMembersForLoggedInUser() {
  if (!isLoggedIn()) throw new AuthenticationError();

  const member = await db.query.members.findMany({
    where: eq(members.userId, auth().userId!),
    with: {
      membersParents: {
        with: {
          parent: {
            with: {
              parentAddresses: {
                with: {
                  address: true,
                },
              },
            },
          },
        },
      },
      memberExtraContactPersons: {
        with: {
          extraContactPerson: true,
        },
      },
      medicalInformation: true,
    },
  });

  return member;
}

export async function createMemberRegistration(data: RegistrationFormValues) {
  if (!isLoggedIn()) throw new AuthenticationError();

  const userId = auth().userId!;

  return await db.transaction(async (tx) => {
    // Create member
    const [member] = await tx
      .insert(members)
      .values({
        firstName: data.memberFirstName,
        lastName: data.memberLastName,
        gender: data.memberGender,
        dateOfBirth: data.memberDateOfBirth,
        emailAddress: data.memberEmailAddress,
        phoneNumber: data.memberPhoneNumber,
        permissionPhotos: data.permissionPhotos,
        userId: userId,
      })
      .returning();

    if (!member) throw new Error("Failed to create member");

    for (const parentData of data.parents) {
      const [parent] = await tx
        .insert(parents)
        .values({
          type: parentData.type,
          firstName: parentData.firstName,
          lastName: parentData.lastName,
          phoneNumber: parentData.phoneNumber,
          emailAddress: parentData.emailAddress,
          userId: userId,
        })
        .returning();

      if (!parent) throw new Error("Failed to create parent");

      const [address] = await tx
        .insert(addresses)
        .values({
          street: parentData.street,
          houseNumber: parentData.houseNumber,
          box: parentData.bus,
          municipality: parentData.municipality,
          postalCode: parentData.postalCode,
        })
        .returning();

      if (!address) throw new Error("Failed to create address");

      const [parentAddress] = await tx
        .insert(parentAddresses)
        .values({
          parentId: parent.id,
          addressId: address.id,
        })
        .returning();

      if (!parentAddress) throw new Error("Failed to link parent and address");

      const [memberParent] = await tx
        .insert(membersParents)
        .values({
          memberId: member.id,
          parentId: parent.id,
          isPrimary: data.parents.indexOf(parentData) === 0,
        })
        .returning();

      if (!memberParent) throw new Error("Failed to link member and parent");

      const [extraContactPerson] = await tx
        .insert(extraContactPersons)
        .values({
          firstName: data.extraContactPersonFirstName,
          lastName: data.extraContactPersonLastName,
          phoneNumber: data.extraContactPersonPhoneNumber,
          relationship: data.extraContactPersonRelationship,
        })
        .returning();

      if (!extraContactPerson)
        throw new Error("Failed to create extra contact person");

      // Link member and extra contact person
      const [memberExtraContactPerson] = await tx
        .insert(memberExtraContactPersons)
        .values({
          memberId: member.id,
          extraContactPersonId: extraContactPerson.id,
        })
        .returning();

      if (!memberExtraContactPerson)
        throw new Error("Failed to link member and extra contact person");

      // Create medical information
      const [medicalInfo] = await tx.insert(medicalInformation).values({
        memberId: member.id,
        pastMedicalHistory: data.pastMedicalHistory,
        tetanusVaccination: data.tetanusVaccination === "true" ? true : false,
        tetanusVaccinationYear: data.tetanusVaccinationYear,
        asthma: data.asthma,
        asthmaInfo: data.asthmaInfo,
        bedwetting: data.bedwetting,
        bedwettingInfo: data.bedwettingInfo,
        epilepsy: data.epilepsy,
        epilepsyInfo: data.epilepsyInfo,
        heartCondition: data.heartCondition,
        heartConditionInfo: data.heartConditionInfo,
        hayFever: data.hayFever,
        hayFeverInfo: data.hayFeverInfo,
        skinCondition: data.skinCondition,
        skinConditionInfo: data.skinConditionInfo,
        rheumatism: data.rheumatism,
        rheumatismInfo: data.rheumatismInfo,
        sleepwalking: data.sleepwalking,
        sleepwalkingInfo: data.sleepwalkingInfo,
        diabetes: data.diabetes,
        diabetesInfo: data.diabetesInfo,
        foodAllergies: data.foodAllergiesInfo,
        substanceAllergies: data.substanceAllergiesInfo,
        medicationAllergies: data.medicationAllergiesInfo,
        medication: data.medication,
        otherMedicalConditions: data.otherMedicalConditions,
        getsTiredQuickly: data.getsTiredQuickly === "true" ? true : false,
        canParticipateSports:
          data.canParticipateSports === "true" ? true : false,
        canSwim: data.canSwim === "true" ? true : false,
        otherRemarks: data.otherRemarks,
        permissionMedication:
          data.permissionMedication === "true" ? true : false,
        doctorFirstName: data.doctorFirstName,
        doctorLastName: data.doctorLastName,
        doctorPhoneNumber: data.doctorPhoneNumber,
      });

      //Audit log everything
      await tx.insert(auditLogs).values({
        tableName: "members",
        recordId: member.id,
        action: "INSERT",
        newValues: JSON.stringify(member),
        userId: userId,
      });

      await tx.insert(auditLogs).values({
        tableName: "parents",
        recordId: parent.id,
        action: "INSERT",
        newValues: JSON.stringify(parent),
        userId: userId,
      });

      await tx.insert(auditLogs).values({
        tableName: "addresses",
        recordId: address.id,
        action: "INSERT",
        newValues: JSON.stringify(address),
        userId: userId,
      });

      await tx.insert(auditLogs).values({
        tableName: "parent_addresses",
        recordId: parent.id,
        action: "INSERT",
        newValues: JSON.stringify(parentAddress),
        userId: userId,
      });

      await tx.insert(auditLogs).values({
        tableName: "members_parents",
        recordId: parent.id,
        action: "INSERT",
        newValues: JSON.stringify(memberParent),
        userId: userId,
      });

      await tx.insert(auditLogs).values({
        tableName: "extra_contact_persons",
        recordId: extraContactPerson.id,
        action: "INSERT",
        newValues: JSON.stringify(extraContactPerson),
        userId: userId,
      });

      await tx.insert(auditLogs).values({
        tableName: "member_extra_contact_persons",
        recordId: extraContactPerson.id,
        action: "INSERT",
        newValues: JSON.stringify(memberExtraContactPerson),
        userId: userId,
      });

      await tx.insert(auditLogs).values({
        tableName: "medical_information",
        recordId: member.id,
        action: "INSERT",
        newValues: JSON.stringify(medicalInfo),
        userId: userId,
      });
    }
  });
}
