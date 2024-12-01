import {
  members as membersTable,
  addresses as addressesTable,
  parents as parentsTable,
  membersParents as membersParentsTable,
  emergencyContacts as emergencyContactsTable,
  medicalInformation as medicalInformationTable,
  yearlyMemberships as yearlyMembershipsTable,
} from "drizzle/schema";
import { db } from "drizzle";
import { type RegistrationFormInputData } from "~/app/(public)/leidingsportaal/lid-inschrijven/registration-form-input-data";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

export async function registerMember(data: RegistrationFormInputData) {
  const insertedMembers = await db
    .insert(membersTable)
    .values({
      firstName: data.memberFirstName,
      lastName: data.memberLastName,
      gender: data.memberGender,
      dateOfBirth: data.memberDateOfBirth,
      emailAddress: data.memberEmailAddress,
      phoneNumber: data.memberPhoneNumber,
      gdprPermissionToPublishPhotos: data.gdprPermissionToPublishPhotos,
    })
    .onConflictDoUpdate({
      target: [
        membersTable.firstName,
        membersTable.lastName,
        membersTable.dateOfBirth,
      ],
      set: {
        gender: data.memberGender,
        emailAddress: data.memberEmailAddress,
        phoneNumber: data.memberPhoneNumber,
        gdprPermissionToPublishPhotos: data.gdprPermissionToPublishPhotos,
      },
    })
    .returning();

  let member = insertedMembers[0];
  if (!member) {
    // Get the existing member
    member = await db.query.members.findFirst({
      where: (members, { eq, and }) =>
        and(
          eq(members.firstName, data.memberFirstName),
          eq(members.lastName, data.memberLastName),
          eq(members.dateOfBirth, data.memberDateOfBirth),
        ),
    });

    console.log("Retrieved existing member", member);
  }

  if (!member) {
    throw new Error("Member that should exist, was not found");
  }

  for (const parentWithAddress of data.parentsWithAddresses) {
    console.log("Processing parent with address:", {
      street: parentWithAddress.street,
      houseNumber: parentWithAddress.houseNumber,
    });

    // Create the address if it doesn't exist yet
    const insertedAddresses = await db
      .insert(addressesTable)
      .values({
        street: parentWithAddress.street,
        houseNumber: parentWithAddress.houseNumber,
        box: parentWithAddress.box,
        postalCode: parentWithAddress.postalCode,
        municipality: parentWithAddress.municipality,
      })
      .onConflictDoNothing()
      .returning();

    console.log("Address insertion result:", {
      inserted: insertedAddresses.length > 0,
      addressId: insertedAddresses[0]?.id,
    });

    let address = insertedAddresses[0];
    if (!address) {
      console.log("Address already exists, fetching existing record");

      // Get the existing address
      address = await db.query.addresses.findFirst({
        where: (addresses, { and, eq, isNull }) =>
          and(
            eq(addresses.street, parentWithAddress.street),
            eq(addresses.houseNumber, parentWithAddress.houseNumber),
            parentWithAddress.box === null
              ? isNull(addresses.box)
              : eq(addressesTable.box, parentWithAddress.box),
            eq(addresses.postalCode, parentWithAddress.postalCode),
            eq(addresses.municipality, parentWithAddress.municipality),
          ),
      });
    }

    console.log("Existing address found:", {
      addressId: address?.id,
      street: address?.street,
      houseNumber: address?.houseNumber,
    });

    if (!address) {
      throw new Error("Address that should exist, was not found");
    }

    console.log("Creating parent record with address:", {
      addressId: address.id,
      firstName: parentWithAddress.firstName,
      lastName: parentWithAddress.lastName,
    });

    // Create the parent if it doesn't exist yet
    const insertedParents = await db
      .insert(parentsTable)
      .values({
        firstName: parentWithAddress.firstName,
        lastName: parentWithAddress.lastName,
        phoneNumber: parentWithAddress.phoneNumber,
        emailAddress: parentWithAddress.emailAddress,
        relationship: parentWithAddress.relationship,
        addressId: address.id,
      })
      .onConflictDoUpdate({
        target: [
          parentsTable.firstName,
          parentsTable.lastName,
          parentsTable.addressId,
        ],
        set: {
          phoneNumber: parentWithAddress.phoneNumber,
          emailAddress: parentWithAddress.emailAddress,
          relationship: parentWithAddress.relationship,
        },
      })
      .returning();

    console.log("Parent creation result:", {
      success: insertedParents.length > 0,
      parentId: insertedParents[0]?.id,
    });

    let parent = insertedParents[0];
    if (!parent) {
      // Get the existing parent
      parent = await db.query.parents.findFirst({
        where: (parents, { and, eq }) =>
          and(
            eq(parents.firstName, parentWithAddress.firstName),
            eq(parents.lastName, parentWithAddress.lastName),
            eq(parents.addressId, address.id),
          ),
      });
    }

    if (!parent) {
      throw new Error("Parent that should exist, was not found");
    }

    console.log("Linking parent to child:", {
      parentId: insertedParents[0]?.id,
      memberId: member.id,
    });

    // Create the relation between the parent and the member
    await db
      .insert(membersParentsTable)
      .values({
        memberId: member.id,
        parentId: parent.id,
        isPrimary: data.parentsWithAddresses[0] === parentWithAddress,
      })
      .onConflictDoUpdate({
        target: [membersParentsTable.memberId, membersParentsTable.parentId],
        set: {
          isPrimary: data.parentsWithAddresses[0] === parentWithAddress,
        },
      });

    console.log("Parent-child relationship created successfully");
  }

  // Create the emergency contact if it doesn't exist yet
  const insertedEmergencyContacts = await db
    .insert(emergencyContactsTable)
    .values({
      memberId: member.id,
      firstName: data.emergencyContactFirstName,
      lastName: data.emergencyContactLastName,
      phoneNumber: data.emergencyContactPhoneNumber,
      relationship: data.emergencyContactRelationship,
    })
    .onConflictDoUpdate({
      target: emergencyContactsTable.memberId,
      set: {
        firstName: data.emergencyContactFirstName,
        lastName: data.emergencyContactLastName,
        phoneNumber: data.emergencyContactPhoneNumber,
        relationship: data.emergencyContactRelationship,
      },
    })
    .returning();

  console.log("Emergency contact insertion result:", {
    success: insertedEmergencyContacts.length > 0,
  });

  let emergencyContact = insertedEmergencyContacts[0];
  if (!emergencyContact) {
    // Get the existing emergency contact
    emergencyContact = await db.query.emergencyContacts.findFirst({
      where: (emergencyContacts, { eq }) =>
        eq(emergencyContacts.memberId, member.id),
    });
  }

  if (!emergencyContact) {
    throw new Error("Emergency contact that should exist, was not found");
  }

  // Create the medical information if it doesn't exist yet
  const insertedMedicalInformation = await db
    .insert(medicalInformationTable)
    .values({
      memberId: member.id,
      pastMedicalHistory: data.pastMedicalHistory,
      tetanusVaccination: data.tetanusVaccination,
      tetanusVaccinationYear: null,
      asthma: data.asthma.hasCondition,
      asthmaInformation: data.asthma.info,
      bedwetting: data.bedwetting.hasCondition,
      bedwettingInformation: data.bedwetting.info,
      epilepsy: data.epilepsy.hasCondition,
      epilepsyInformation: data.epilepsy.info,
      heartCondition: data.heartCondition.hasCondition,
      heartConditionInformation: data.heartCondition.info,
      hayFever: data.hayFever.hasCondition,
      hayFeverInformation: data.hayFever.info,
      skinCondition: data.skinCondition.hasCondition,
      skinConditionInformation: data.skinCondition.info,
      rheumatism: data.rheumatism.hasCondition,
      rheumatismInformation: data.rheumatism.info,
      sleepwalking: data.sleepwalking.hasCondition,
      sleepwalkingInformation: data.sleepwalking.info,
      diabetes: data.diabetes.hasCondition,
      diabetesInformation: data.diabetes.info,
      foodAllergies: data.foodAllergies,
      substanceAllergies: data.substanceAllergies,
      medicationAllergies: data.medicationAllergies,
      medication: data.medication,
      otherMedicalConditions: data.otherMedicalConditions,
      getsTiredQuickly: data.getsTiredQuickly,
      canParticipateSports: data.canParticipateSports,
      canSwim: data.canSwim,
      otherRemarks: data.otherRemarks,
      permissionMedication: data.permissionMedication,
      doctorFirstName: data.doctor.firstName,
      doctorLastName: data.doctor.lastName,
      doctorPhoneNumber: data.doctor.phoneNumber,
    })
    .onConflictDoUpdate({
      target: medicalInformationTable.memberId,
      set: {
        pastMedicalHistory: data.pastMedicalHistory,
        tetanusVaccination: data.tetanusVaccination,
        tetanusVaccinationYear: null,
        asthma: data.asthma.hasCondition,
        asthmaInformation: data.asthma.info,
        bedwetting: data.bedwetting.hasCondition,
        bedwettingInformation: data.bedwetting.info,
        epilepsy: data.epilepsy.hasCondition,
        epilepsyInformation: data.epilepsy.info,
        heartCondition: data.heartCondition.hasCondition,
        heartConditionInformation: data.heartCondition.info,
        hayFever: data.hayFever.hasCondition,
        hayFeverInformation: data.hayFever.info,
        skinCondition: data.skinCondition.hasCondition,
        skinConditionInformation: data.skinCondition.info,
        rheumatism: data.rheumatism.hasCondition,
        rheumatismInformation: data.rheumatism.info,
        sleepwalking: data.sleepwalking.hasCondition,
        sleepwalkingInformation: data.sleepwalking.info,
        diabetes: data.diabetes.hasCondition,
        diabetesInformation: data.diabetes.info,
        foodAllergies: data.foodAllergies,
        substanceAllergies: data.substanceAllergies,
        medicationAllergies: data.medicationAllergies,
        medication: data.medication,
        otherMedicalConditions: data.otherMedicalConditions,
        getsTiredQuickly: data.getsTiredQuickly,
        canParticipateSports: data.canParticipateSports,
        canSwim: data.canSwim,
        otherRemarks: data.otherRemarks,
        permissionMedication: data.permissionMedication,
        doctorFirstName: data.doctor.firstName,
        doctorLastName: data.doctor.lastName,
        doctorPhoneNumber: data.doctor.phoneNumber,
      },
    })
    .returning();

  console.log("Medical information insertion result:", {
    success: insertedMedicalInformation.length > 0,
  });

  let medicalInformation = insertedMedicalInformation[0];
  if (!medicalInformation) {
    // Get the existing medical information
    medicalInformation = await db.query.medicalInformation.findFirst({
      where: (medicalInformation, { eq }) =>
        eq(medicalInformation.memberId, member.id),
    });
  }

  if (!medicalInformation) {
    throw new Error("Medical information that should exist, was not found");
  }

  // Find the current work year
  const today = new Date();

  const currentWorkYear = await db.query.workYears.findFirst({
    where: (workYears, { and, lt, gt }) =>
      and(lt(workYears.startDate, today), gt(workYears.endDate, today)),
  });

  if (!currentWorkYear) {
    throw new Error(
      "There is no current work year, so the member cannot be registered",
    );
  }

  // Create the yearly membership
  const insertedYearlyMembership = await db
    .insert(yearlyMembershipsTable)
    .values({
      memberId: member.id,
      workYearId: currentWorkYear.id,
      groupId: data.groupId,
      paymentReceived: data.yearlyMembership.paymentReceived,
      paymentMethod: data.yearlyMembership.paymentMethod,
      paymentDate: data.yearlyMembership.paymentDate,
    })
    .returning();

  console.log("Yearly membership insertion result:", {
    success: insertedYearlyMembership.length > 0,
  });

  let yearlyMembership = insertedYearlyMembership[0];
  if (!yearlyMembership) {
    // Get the existing yearly membership
    yearlyMembership = await db.query.yearlyMemberships.findFirst({
      where: (yearlyMemberships, { eq }) =>
        eq(yearlyMemberships.memberId, member.id),
    });
  }

  if (!yearlyMembership) {
    throw new Error("Yearly membership that should exist, was not found");
  }

  return member;
}

export async function registerMemberOld(data: RegisterMemberInput) {
  const insertedMembers = await db
    .insert(membersTable)
    .values({
      firstName: data.memberData.name.firstName,
      lastName: data.memberData.name.lastName,
      gender: data.memberData.gender,
      dateOfBirth: data.memberData.dateOfBirth,
      emailAddress: data.memberData.emailAddress,
      phoneNumber: data.memberData.phoneNumber,
      gdprPermissionToPublishPhotos:
        data.memberData.gdprPermissionToPublishPhotos,
    })
    .onConflictDoUpdate({
      target: [
        membersTable.firstName,
        membersTable.lastName,
        membersTable.dateOfBirth,
      ],
      set: {
        gender: data.memberData.gender,
        emailAddress: data.memberData.emailAddress,
        phoneNumber: data.memberData.phoneNumber,
        gdprPermissionToPublishPhotos:
          data.memberData.gdprPermissionToPublishPhotos,
      },
    })
    .returning();

  let member = insertedMembers[0];
  if (!member) {
    // Get the existing member
    member = await db.query.members.findFirst({
      where: (members, { eq, and }) =>
        and(
          eq(members.firstName, data.memberData.name.firstName),
          eq(members.lastName, data.memberData.name.lastName),
          eq(members.dateOfBirth, data.memberData.dateOfBirth),
        ),
    });

    console.log("Retrieved existing member", member);
  }

  if (!member) {
    throw new Error("Member that should exist, was not found");
  }

  for (const parentWithAddress of data.parentsWithAddresses) {
    console.log("Processing parent with address:", {
      street: parentWithAddress.address.street,
      houseNumber: parentWithAddress.address.houseNumber,
    });

    // Create the address if it doesn't exist yet
    const insertedAddresses = await db
      .insert(addressesTable)
      .values({
        street: parentWithAddress.address.street,
        houseNumber: parentWithAddress.address.houseNumber,
        box: parentWithAddress.address.box,
        postalCode: parentWithAddress.address.postalCode,
        municipality: parentWithAddress.address.municipality,
      })
      .onConflictDoNothing()
      .returning();

    console.log("Address insertion result:", {
      inserted: insertedAddresses.length > 0,
      addressId: insertedAddresses[0]?.id,
    });

    let address = insertedAddresses[0];
    if (!address) {
      console.log("Address already exists, fetching existing record");

      // Get the existing address
      address = await db.query.addresses.findFirst({
        where: (addresses, { and, eq, isNull }) =>
          and(
            eq(addresses.street, parentWithAddress.address.street),
            eq(addresses.houseNumber, parentWithAddress.address.houseNumber),
            parentWithAddress.address.box === null
              ? isNull(addresses.box)
              : eq(addressesTable.box, parentWithAddress.address.box),
            eq(addresses.postalCode, parentWithAddress.address.postalCode),
            eq(addresses.municipality, parentWithAddress.address.municipality),
          ),
      });
    }

    console.log("Existing address found:", {
      addressId: address?.id,
      street: address?.street,
      houseNumber: address?.houseNumber,
    });

    if (!address) {
      throw new Error("Address that should exist, was not found");
    }

    console.log("Creating parent record with address:", {
      addressId: address.id,
      firstName: parentWithAddress.parent.name.firstName,
      lastName: parentWithAddress.parent.name.lastName,
    });

    // Create the parent if it doesn't exist yet
    const insertedParents = await db
      .insert(parentsTable)
      .values({
        firstName: parentWithAddress.parent.name.firstName,
        lastName: parentWithAddress.parent.name.lastName,
        phoneNumber: parentWithAddress.parent.phoneNumber,
        emailAddress: parentWithAddress.parent.emailAddress,
        relationship: parentWithAddress.parent.relationship,
        addressId: address.id,
      })
      .onConflictDoUpdate({
        target: [
          parentsTable.firstName,
          parentsTable.lastName,
          parentsTable.addressId,
        ],
        set: {
          phoneNumber: parentWithAddress.parent.phoneNumber,
          emailAddress: parentWithAddress.parent.emailAddress,
          relationship: parentWithAddress.parent.relationship,
        },
      })
      .returning();

    console.log("Parent creation result:", {
      success: insertedParents.length > 0,
      parentId: insertedParents[0]?.id,
    });

    let parent = insertedParents[0];
    if (!parent) {
      // Get the existing parent
      parent = await db.query.parents.findFirst({
        where: (parents, { and, eq }) =>
          and(
            eq(parents.firstName, parentWithAddress.parent.name.firstName),
            eq(parents.lastName, parentWithAddress.parent.name.lastName),
            eq(parents.addressId, address.id),
          ),
      });
    }

    if (!parent) {
      throw new Error("Parent that should exist, was not found");
    }

    console.log("Linking parent to child:", {
      parentId: insertedParents[0]?.id,
      memberId: member.id,
    });

    // Create the relation between the parent and the member
    await db
      .insert(membersParentsTable)
      .values({
        memberId: member.id,
        parentId: parent.id,
        isPrimary: data.parentsWithAddresses[0] === parentWithAddress,
      })
      .onConflictDoUpdate({
        target: [membersParentsTable.memberId, membersParentsTable.parentId],
        set: {
          isPrimary: data.parentsWithAddresses[0] === parentWithAddress,
        },
      });

    console.log("Parent-child relationship created successfully");
  }

  // Create the emergency contact if it doesn't exist yet
  const insertedEmergencyContacts = await db
    .insert(emergencyContactsTable)
    .values({
      memberId: member.id,
      firstName: data.emergencyContact.name.firstName,
      lastName: data.emergencyContact.name.lastName,
      phoneNumber: data.emergencyContact.phoneNumber,
      relationship: data.emergencyContact.relationship,
    })
    .onConflictDoUpdate({
      target: emergencyContactsTable.memberId,
      set: {
        firstName: data.emergencyContact.name.firstName,
        lastName: data.emergencyContact.name.lastName,
        phoneNumber: data.emergencyContact.phoneNumber,
        relationship: data.emergencyContact.relationship,
      },
    })
    .returning();

  console.log("Emergency contact insertion result:", {
    success: insertedEmergencyContacts.length > 0,
  });

  let emergencyContact = insertedEmergencyContacts[0];
  if (!emergencyContact) {
    // Get the existing emergency contact
    emergencyContact = await db.query.emergencyContacts.findFirst({
      where: (emergencyContacts, { eq }) =>
        eq(emergencyContacts.memberId, member.id),
    });
  }

  if (!emergencyContact) {
    throw new Error("Emergency contact that should exist, was not found");
  }

  // Create the medical information if it doesn't exist yet
  const insertedMedicalInformation = await db
    .insert(medicalInformationTable)
    .values({
      memberId: member.id,
      pastMedicalHistory: data.medicalInformation.pastMedicalHistory,
      tetanusVaccination: data.medicalInformation.tetanusVaccination,
      tetanusVaccinationYear: data.medicalInformation.tetanusVaccinationYear,
      asthma: data.medicalInformation.asthma.hasCondition,
      asthmaInformation: data.medicalInformation.asthma.info,
      bedwetting: data.medicalInformation.bedwetting.hasCondition,
      bedwettingInformation: data.medicalInformation.bedwetting.info,
      epilepsy: data.medicalInformation.epilepsy.hasCondition,
      epilepsyInformation: data.medicalInformation.epilepsy.info,
      heartCondition: data.medicalInformation.heartCondition.hasCondition,
      heartConditionInformation: data.medicalInformation.heartCondition.info,
      hayFever: data.medicalInformation.hayFever.hasCondition,
      hayFeverInformation: data.medicalInformation.hayFever.info,
      skinCondition: data.medicalInformation.skinCondition.hasCondition,
      skinConditionInformation: data.medicalInformation.skinCondition.info,
      rheumatism: data.medicalInformation.rheumatism.hasCondition,
      rheumatismInformation: data.medicalInformation.rheumatism.info,
      sleepwalking: data.medicalInformation.sleepwalking.hasCondition,
      sleepwalkingInformation: data.medicalInformation.sleepwalking.info,
      diabetes: data.medicalInformation.diabetes.hasCondition,
      diabetesInformation: data.medicalInformation.diabetes.info,
      foodAllergies: data.medicalInformation.foodAllergies,
      substanceAllergies: data.medicalInformation.substanceAllergies,
      medicationAllergies: data.medicalInformation.medicationAllergies,
      medication: data.medicalInformation.medication,
      otherMedicalConditions: data.medicalInformation.otherMedicalConditions,
      getsTiredQuickly: data.medicalInformation.getsTiredQuickly,
      canParticipateSports: data.medicalInformation.canParticipateSports,
      canSwim: data.medicalInformation.canSwim,
      otherRemarks: data.medicalInformation.otherRemarks,
      permissionMedication: data.medicalInformation.permissionMedication,
      doctorFirstName: data.medicalInformation.doctor.name.firstName,
      doctorLastName: data.medicalInformation.doctor.name.lastName,
      doctorPhoneNumber: data.medicalInformation.doctor.phoneNumber,
    })
    .onConflictDoUpdate({
      target: medicalInformationTable.memberId,
      set: {
        pastMedicalHistory: data.medicalInformation.pastMedicalHistory,
        tetanusVaccination: data.medicalInformation.tetanusVaccination,
        tetanusVaccinationYear: data.medicalInformation.tetanusVaccinationYear,
        asthma: data.medicalInformation.asthma.hasCondition,
        asthmaInformation: data.medicalInformation.asthma.info,
        bedwetting: data.medicalInformation.bedwetting.hasCondition,
        bedwettingInformation: data.medicalInformation.bedwetting.info,
        epilepsy: data.medicalInformation.epilepsy.hasCondition,
        epilepsyInformation: data.medicalInformation.epilepsy.info,
        heartCondition: data.medicalInformation.heartCondition.hasCondition,
        heartConditionInformation: data.medicalInformation.heartCondition.info,
        hayFever: data.medicalInformation.hayFever.hasCondition,
        hayFeverInformation: data.medicalInformation.hayFever.info,
        skinCondition: data.medicalInformation.skinCondition.hasCondition,
        skinConditionInformation: data.medicalInformation.skinCondition.info,
        rheumatism: data.medicalInformation.rheumatism.hasCondition,
        rheumatismInformation: data.medicalInformation.rheumatism.info,
        sleepwalking: data.medicalInformation.sleepwalking.hasCondition,
        sleepwalkingInformation: data.medicalInformation.sleepwalking.info,
        diabetes: data.medicalInformation.diabetes.hasCondition,
        diabetesInformation: data.medicalInformation.diabetes.info,
        foodAllergies: data.medicalInformation.foodAllergies,
        substanceAllergies: data.medicalInformation.substanceAllergies,
        medicationAllergies: data.medicalInformation.medicationAllergies,
        medication: data.medicalInformation.medication,
        otherMedicalConditions: data.medicalInformation.otherMedicalConditions,
        getsTiredQuickly: data.medicalInformation.getsTiredQuickly,
        canParticipateSports: data.medicalInformation.canParticipateSports,
        canSwim: data.medicalInformation.canSwim,
        otherRemarks: data.medicalInformation.otherRemarks,
        permissionMedication: data.medicalInformation.permissionMedication,
        doctorFirstName: data.medicalInformation.doctor.name.firstName,
        doctorLastName: data.medicalInformation.doctor.name.lastName,
        doctorPhoneNumber: data.medicalInformation.doctor.phoneNumber,
      },
    })
    .returning();

  console.log("Medical information insertion result:", {
    success: insertedMedicalInformation.length > 0,
  });

  let medicalInformation = insertedMedicalInformation[0];
  if (!medicalInformation) {
    // Get the existing medical information
    medicalInformation = await db.query.medicalInformation.findFirst({
      where: (medicalInformation, { eq }) =>
        eq(medicalInformation.memberId, member.id),
    });
  }

  if (!medicalInformation) {
    throw new Error("Medical information that should exist, was not found");
  }

  // Find the current work year
  const today = new Date();

  const currentWorkYear = await db.query.workYears.findFirst({
    where: (workYears, { and, lt, gt }) =>
      and(lt(workYears.startDate, today), gt(workYears.endDate, today)),
  });

  if (!currentWorkYear) {
    throw new Error(
      "There is no current work year, so the member cannot be registered",
    );
  }

  // Create the yearly membership
  const insertedYearlyMembership = await db
    .insert(yearlyMembershipsTable)
    .values({
      memberId: member.id,
      workYearId: currentWorkYear.id,
      groupId: data.groupId,
      paymentReceived: data.yearlyMembership.paymentReceived,
      paymentMethod: data.yearlyMembership.paymentMethod,
      paymentDate: data.yearlyMembership.paymentDate,
    })
    .returning();

  console.log("Yearly membership insertion result:", {
    success: insertedYearlyMembership.length > 0,
  });

  let yearlyMembership = insertedYearlyMembership[0];
  if (!yearlyMembership) {
    // Get the existing yearly membership
    yearlyMembership = await db.query.yearlyMemberships.findFirst({
      where: (yearlyMemberships, { eq }) =>
        eq(yearlyMemberships.memberId, member.id),
    });
  }

  if (!yearlyMembership) {
    throw new Error("Yearly membership that should exist, was not found");
  }

  return member;
}
