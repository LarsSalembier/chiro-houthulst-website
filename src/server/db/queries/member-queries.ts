import { asc, desc, eq, and, or, ilike, sql, exists, ne } from "drizzle-orm";
import * as schema from "~/server/db/schema";
import {
  type Member,
  type NewMember,
  InsertMemberSchema,
  type NewEmergencyContact,
  type NewMedicalInformation,
  type NewParent,
  type NewAddress,
  InsertParentSchema,
} from "~/server/db/schema";
import { ADDRESS_MUTATIONS } from "./address-queries"; // Importeer address mutaties
import { GROUP_QUERIES } from "./group-queries"; // Om groep te vinden
import { db } from "../db";
import { z } from "zod";

// Type voor complexe member data input
export type FullNewMemberData = NewMember & {
  parents: Array<
    Omit<NewParent, "addressId"> & { address: NewAddress; isPrimary: boolean }
  >;
  emergencyContact?: Omit<NewEmergencyContact, "memberId">;
  medicalInformation?: {
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
  workYearId: number; // Het werkjaar waarvoor ingeschreven wordt
  groupId?: number; // Optionele groep ID voor handmatige selectie
  paymentReceived: boolean;
  paymentMethod?: schema.PaymentMethod;
  paymentDate?: Date;
};

export const MEMBER_QUERIES = {
  // Haal alle leden op voor een specifiek werkjaar, eventueel gefilterd op groep
  getMembersForWorkYear: async (workYearId: number, groupId?: number) => {
    const members = await db.query.members.findMany({
      with: {
        yearlyMemberships: {
          where: and(
            eq(schema.yearlyMemberships.workYearId, workYearId),
            groupId ? eq(schema.yearlyMemberships.groupId, groupId) : undefined,
          ),
          with: {
            group: true,
          },
        },
        membersParents: {
          with: {
            parent: {
              with: {
                address: true,
              },
            },
          },
        },
        medicalInformation: true,
        emergencyContact: true,
      },
      orderBy: [asc(schema.members.lastName), asc(schema.members.firstName)],
    });

    // Filter members to only include those with yearly memberships for the specified criteria
    const filteredMembers = members.filter(
      (member) => member.yearlyMemberships.length > 0,
    );

    return filteredMembers.map((m) => ({
      ...m,
      parents: m.membersParents.map((mp) => ({
        ...mp.parent,
        isPrimary: mp.isPrimary,
      })),
      yearlyMembership: m.yearlyMemberships[0],
    }));
  },

  // Haal een specifiek lid op met alle gerelateerde gegevens
  getFullMemberDetails: async (
    memberId: number,
  ): Promise<
    | (Member & {
        parents: Array<
          schema.Parent & { address: schema.Address; isPrimary: boolean }
        >;
        emergencyContact: schema.EmergencyContact | null;
        medicalInformation: schema.MedicalInformation | null;
        yearlyMemberships: Array<
          schema.YearlyMembership & {
            workYear: schema.WorkYear;
            group: schema.Group;
          }
        >;
        eventRegistrations: Array<
          schema.EventRegistration & { event: schema.Event }
        >;
      })
    | null
  > => {
    const member = await db.query.members.findFirst({
      where: eq(schema.members.id, memberId),
      with: {
        membersParents: {
          with: {
            parent: {
              with: {
                address: true,
              },
            },
          },
        },
        emergencyContact: true,
        medicalInformation: true,
        yearlyMemberships: {
          with: {
            workYear: true,
            group: true,
          },
          orderBy: [desc(schema.yearlyMemberships.createdAt)], // Nieuwste eerst
        },
        eventRegistrations: {
          with: {
            event: true,
          },
          orderBy: [desc(schema.eventRegistrations.createdAt)], // Nieuwste eerst
        },
      },
    });

    if (!member) return null;

    // Transformeer membersParents naar een directere parents array
    const parents = member.membersParents.map((mp) => ({
      ...mp.parent,
      isPrimary: mp.isPrimary,
    }));

    return { ...member, parents };
  },

  // Zoek leden op naam (voornaam, achternaam, of beide)
  searchMembersByName: async (searchTerm: string) => {
    const terms = searchTerm
      .trim()
      .split(" ")
      .filter((t) => t.length > 0);
    if (terms.length === 0) return [];

    const conditions = terms.map((term) =>
      or(
        ilike(schema.members.firstName, `%${term}%`),
        ilike(schema.members.lastName, `%${term}%`),
      ),
    );

    return await db.query.members.findMany({
      where: and(...conditions),
      orderBy: [asc(schema.members.lastName), asc(schema.members.firstName)],
      limit: 50,
    });
  },

  // TODO: flesh out this query
  // getMembersNeedingMedicalAttention: async (
  //   workYearId: number,
  //   groupId?: number,
  // ) => {
  //   return await db
  //     .select()
  //     .from(schema.members)
  //     .innerJoin(
  //       schema.medicalInformation,
  //       eq(schema.members.id, schema.medicalInformation.memberId),
  //     )
  //     .innerJoin(
  //       schema.yearlyMemberships,
  //       eq(schema.members.id, schema.yearlyMemberships.memberId),
  //     )
  //     .where(
  //       and(
  //         eq(schema.yearlyMemberships.workYearId, workYearId),
  //         groupId ? eq(schema.yearlyMemberships.groupId, groupId) : undefined,
  //         or(
  //           // Check if text fields are not null and not empty
  //           sql`${schema.medicalInformation.allergies} IS NOT NULL AND ${schema.medicalInformation.allergies} != ''`,
  //           sql`${schema.medicalInformation.medication} IS NOT NULL AND ${schema.medicalInformation.medication} != ''`,
  //           sql`${schema.medicalInformation.medicalConditions} IS NOT NULL AND ${schema.medicalInformation.medicalConditions} != ''`,
  //           eq(schema.medicalInformation.permissionMedication, false), // Needs attention if basic meds cannot be given
  //         ),
  //       ),
  //     )
  //     .orderBy(asc(schema.members.lastName), asc(schema.members.firstName))
  //     .execute();
  // },

  // Leden die (niet) kunnen zwemmen, optioneel per groep/werkjaar
  getMembersBySwimAbility: async (
    canSwim: boolean,
    workYearId: number,
    groupId?: number,
  ) => {
    return await db
      .select()
      .from(schema.members)
      .leftJoin(
        schema.medicalInformation,
        eq(schema.members.id, schema.medicalInformation.memberId),
      )
      .innerJoin(
        schema.yearlyMemberships,
        eq(schema.members.id, schema.yearlyMemberships.memberId),
      )
      .where(
        and(
          eq(schema.yearlyMemberships.workYearId, workYearId),
          groupId ? eq(schema.yearlyMemberships.groupId, groupId) : undefined,
          eq(schema.medicalInformation.canSwim, canSwim),
        ),
      )
      .orderBy(asc(schema.members.lastName), asc(schema.members.firstName))
      .execute();
  },

  // Leden die (niet) mogen sporten, optioneel per groep/werkjaar
  getMembersBySportParticipation: async (
    canParticipate: boolean,
    workYearId: number,
    groupId?: number,
  ) => {
    return await db
      .selectDistinct({
        member: schema.members,
        medicalInfo: schema.medicalInformation,
      }) // Use selectDistinct if joins cause duplicates
      .from(schema.members)
      .leftJoin(
        schema.medicalInformation,
        eq(schema.members.id, schema.medicalInformation.memberId),
      )
      .innerJoin(
        schema.yearlyMemberships,
        eq(schema.members.id, schema.yearlyMemberships.memberId),
      )
      .where(
        and(
          eq(schema.yearlyMemberships.workYearId, workYearId),
          groupId ? eq(schema.yearlyMemberships.groupId, groupId) : undefined,
          eq(schema.medicalInformation.canParticipateSports, canParticipate),
        ),
      )
      .orderBy(asc(schema.members.lastName), asc(schema.members.firstName))
      .execute();
  },

  // Leden zonder betaald lidgeld voor een werkjaar
  getMembersWithUnpaidMembership: async (workYearId: number) => {
    return await db.query.members.findMany({
      with: {
        yearlyMemberships: {
          where: and(
            eq(schema.yearlyMemberships.workYearId, workYearId),
            eq(schema.yearlyMemberships.paymentReceived, false),
          ),
          with: { group: true },
          limit: 1,
        },
      },
      where: exists(
        db
          .select({ _: sql`1` })
          .from(schema.yearlyMemberships)
          .where(
            and(
              eq(schema.yearlyMemberships.memberId, schema.members.id),
              eq(schema.yearlyMemberships.workYearId, workYearId),
              eq(schema.yearlyMemberships.paymentReceived, false),
            ),
          ),
      ),
      orderBy: [asc(schema.members.lastName), asc(schema.members.firstName)],
    });
  },

  // --- Verwijder Lid ---
  // Dit zal via cascade ook emergency contact, medical info, memberships, etc. verwijderen.
  // Wees hier zeer voorzichtig mee! Overweeg een 'soft delete' (bv. een 'archived' boolean).
  removeMember: async (id: number): Promise<void> => {
    console.warn(
      `Attempting to permanently delete member with ID: ${id}. This is irreversible.`,
    );

    try {
      await db.transaction(async (tx) => {
        // 1. Get member with all related data
        const member = await tx.query.members.findFirst({
          where: eq(schema.members.id, id),
          with: {
            membersParents: {
              with: {
                parent: {
                  with: {
                    address: true,
                  },
                },
              },
            },
          },
        });

        if (!member) {
          throw new Error("Member not found");
        }

        // 2. Handle parent relationships and cleanup
        for (const memberParent of member.membersParents) {
          const parent = memberParent.parent;
          
          // Check if this parent has other children
          const otherChildren = await tx.query.membersParents.findMany({
            where: and(
              eq(schema.membersParents.parentId, parent.id),
              ne(schema.membersParents.memberId, id),
            ),
          });

          // Remove the specific member-parent relationship
          await tx
            .delete(schema.membersParents)
            .where(
              and(
                eq(schema.membersParents.memberId, id),
                eq(schema.membersParents.parentId, parent.id),
              ),
            )
            .execute();

          // If parent has no other children, remove the parent
          if (otherChildren.length === 0) {
            await tx
              .delete(schema.parents)
              .where(eq(schema.parents.id, parent.id))
              .execute();

            // Check if address is used by other parents
            const otherParentsWithSameAddress = await tx.query.parents.findMany({
              where: eq(schema.parents.addressId, parent.addressId),
            });

            // If no other parents use this address, remove it
            if (otherParentsWithSameAddress.length === 0) {
              await tx
                .delete(schema.addresses)
                .where(eq(schema.addresses.id, parent.addressId))
                .execute();
            }
          }
        }

        // 3. Delete the member (this will cascade to emergency contact, medical info, yearly memberships, etc.)
        await tx
          .delete(schema.members)
          .where(eq(schema.members.id, id))
          .execute();
      });
    } catch (error) {
      console.error(`Error deleting member with ID ${id}:`, error);
      throw new Error("Fout bij het verwijderen van het lid.");
    }
  },

  // --- Kamp Inschrijving Functies ---

  // Schrijf een lid in voor kamp
  subscribeToCamp: async (
    memberId: number,
    workYearId: number,
    paymentMethod?: schema.PaymentMethod,
  ): Promise<void> => {
    await db
      .update(schema.yearlyMemberships)
      .set({
        campSubscription: true,
        campPaymentMethod: paymentMethod,
        campPaymentReceived: false,
        campPaymentDate: null,
      })
      .where(
        and(
          eq(schema.yearlyMemberships.memberId, memberId),
          eq(schema.yearlyMemberships.workYearId, workYearId),
        ),
      )
      .execute();
  },

  // Schrijf een lid uit voor kamp
  unsubscribeFromCamp: async (
    memberId: number,
    workYearId: number,
  ): Promise<void> => {
    await db
      .update(schema.yearlyMemberships)
      .set({
        campSubscription: false,
        campPaymentMethod: null,
        campPaymentReceived: false,
        campPaymentDate: null,
      })
      .where(
        and(
          eq(schema.yearlyMemberships.memberId, memberId),
          eq(schema.yearlyMemberships.workYearId, workYearId),
        ),
      )
      .execute();
  },

  // Markeer kamp betaling als ontvangen
  markCampPaymentReceived: async (
    memberId: number,
    workYearId: number,
    paymentReceived: boolean,
    paymentMethod?: schema.PaymentMethod,
    paymentDate?: Date,
  ): Promise<void> => {
    await db
      .update(schema.yearlyMemberships)
      .set({
        campPaymentReceived: paymentReceived,
        campPaymentMethod: paymentMethod,
        campPaymentDate: paymentReceived ? (paymentDate ?? new Date()) : null,
      })
      .where(
        and(
          eq(schema.yearlyMemberships.memberId, memberId),
          eq(schema.yearlyMemberships.workYearId, workYearId),
        ),
      )
      .execute();
  },

  // Haal kamp inschrijvingen op voor een werkjaar
  getCampSubscriptionsForWorkYear: async (workYearId: number) => {
    return await db.query.yearlyMemberships.findMany({
      where: and(
        eq(schema.yearlyMemberships.workYearId, workYearId),
        eq(schema.yearlyMemberships.campSubscription, true),
      ),
      with: {
        member: true,
        group: true,
        workYear: true,
      },
    });
  },

  // Haal kamp inschrijvingen op voor een specifieke groep
  getCampSubscriptionsForGroup: async (workYearId: number, groupId: number) => {
    return await db.query.yearlyMemberships.findMany({
      where: and(
        eq(schema.yearlyMemberships.workYearId, workYearId),
        eq(schema.yearlyMemberships.groupId, groupId),
        eq(schema.yearlyMemberships.campSubscription, true),
      ),
      with: {
        member: true,
        group: true,
        workYear: true,
      },
    });
  },
};

export const MEMBER_MUTATIONS = {
  // --- Complexe Transactie: Nieuw Lid Registreren of Bestaand Lid Updaten ---
  registerMember: async (data: FullNewMemberData): Promise<Member> => {
    // Form validation is already handled on the client side
    // Proceed directly with the database transaction

    return await db.transaction(async (tx) => {
      // 1. Check if member already exists (by name and date of birth)
      let member = await tx.query.members.findFirst({
        where: and(
          eq(schema.members.firstName, data.firstName),
          eq(schema.members.lastName, data.lastName),
          eq(schema.members.dateOfBirth, data.dateOfBirth),
        ),
      });

      if (member) {
        // Update existing member with new data
        const [updatedMember] = await tx
          .update(schema.members)
          .set({
            gender: data.gender,
            emailAddress: data.emailAddress,
            phoneNumber: data.phoneNumber,
            gdprPermissionToPublishPhotos: data.gdprPermissionToPublishPhotos,
            updatedAt: new Date(),
          })
          .where(eq(schema.members.id, member.id))
          .returning()
          .execute();

        if (!updatedMember) throw new Error("Failed to update member");
        member = updatedMember;
      } else {
        // Create new member
        const [newMember] = await tx
          .insert(schema.members)
          .values(data)
          .returning()
          .execute();

        if (!newMember) throw new Error("Failed to create member");
        member = newMember;
      }

      // 2. Handle Parents
      // First, get existing parent relationships for this member
      const existingParentRelationships =
        await tx.query.membersParents.findMany({
          where: eq(schema.membersParents.memberId, member.id),
          with: {
            parent: {
              with: {
                address: true,
              },
            },
          },
        });

      // Create a set of existing parent IDs for easy lookup
      const existingParentIds = new Set(
        existingParentRelationships.map((r) => r.parentId),
      );

      // Process new parent data
      const newParentIds = new Set<number>();

      for (const parentData of data.parents) {
        // 2a. Find or create address
        const address = await ADDRESS_MUTATIONS.findOrCreate(
          parentData.address,
          tx,
        );

        // 2b. Find or create parent
        let parent = await tx.query.parents.findFirst({
          where: and(
            eq(schema.parents.firstName, parentData.firstName),
            eq(schema.parents.lastName, parentData.lastName),
            eq(schema.parents.addressId, address.id),
          ),
        });

        if (!parent) {
          // Create new parent
          const [newParent] = await tx
            .insert(schema.parents)
            .values({
              firstName: parentData.firstName,
              lastName: parentData.lastName,
              emailAddress: parentData.emailAddress,
              phoneNumber: parentData.phoneNumber,
              relationship: parentData.relationship,
              addressId: address.id,
            })
            .returning()
            .execute();

          if (!newParent) throw new Error("Failed to create parent");
          parent = newParent;
        } else {
          // Update existing parent
          await tx
            .update(schema.parents)
            .set({
              emailAddress: parentData.emailAddress,
              phoneNumber: parentData.phoneNumber,
              relationship: parentData.relationship,
              addressId: address.id,
              updatedAt: new Date(),
            })
            .where(eq(schema.parents.id, parent.id))
            .execute();
        }

        newParentIds.add(parent.id);

        // 2c. Link member to parent (update existing or create new)
        const existingRelationship = existingParentRelationships.find(
          (r) => r.parentId === parent.id,
        );

        if (existingRelationship) {
          // Update existing relationship
          await tx
            .update(schema.membersParents)
            .set({ isPrimary: parentData.isPrimary })
            .where(eq(schema.membersParents.memberId, member.id))
            .execute();
        } else {
          // Create new relationship
          await tx
            .insert(schema.membersParents)
            .values({
              memberId: member.id,
              parentId: parent.id,
              isPrimary: parentData.isPrimary,
            })
            .execute();
        }
      }

      // 2d. Remove parent relationships that are no longer needed
      const parentsToRemove = existingParentRelationships.filter(
        (r) => !newParentIds.has(r.parentId),
      );

      for (const relationshipToRemove of parentsToRemove) {
        // Check if this parent has other children in the organization
        const otherChildren = await tx.query.membersParents.findMany({
          where: and(
            eq(schema.membersParents.parentId, relationshipToRemove.parentId),
            ne(schema.membersParents.memberId, member.id),
          ),
        });

        // Remove the relationship
        await tx
          .delete(schema.membersParents)
          .where(
            and(
              eq(schema.membersParents.memberId, member.id),
              eq(schema.membersParents.parentId, relationshipToRemove.parentId),
            ),
          )
          .execute();

        // If parent has no other children, remove the parent and potentially the address
        if (otherChildren.length === 0) {
          await tx
            .delete(schema.parents)
            .where(eq(schema.parents.id, relationshipToRemove.parentId))
            .execute();

          // Check if address is used by other parents
          const otherParentsWithSameAddress = await tx.query.parents.findMany({
            where: eq(
              schema.parents.addressId,
              relationshipToRemove.parent.addressId,
            ),
          });

          // If no other parents use this address, remove it
          if (otherParentsWithSameAddress.length === 0) {
            await tx
              .delete(schema.addresses)
              .where(
                eq(schema.addresses.id, relationshipToRemove.parent.addressId),
              )
              .execute();
          }
        }
      }

      // 3. Handle Emergency Contact
      if (data.emergencyContact) {
        // Check if emergency contact already exists
        const existingEmergencyContact =
          await tx.query.emergencyContacts.findFirst({
            where: eq(schema.emergencyContacts.memberId, member.id),
          });

        if (existingEmergencyContact) {
          // Update existing emergency contact
          await tx
            .update(schema.emergencyContacts)
            .set({
              firstName: data.emergencyContact.firstName,
              lastName: data.emergencyContact.lastName,
              phoneNumber: data.emergencyContact.phoneNumber,
              relationship: data.emergencyContact.relationship,
              updatedAt: new Date(),
            })
            .where(eq(schema.emergencyContacts.memberId, member.id))
            .execute();
        } else {
          // Create new emergency contact
          await tx
            .insert(schema.emergencyContacts)
            .values({
              memberId: member.id,
              ...data.emergencyContact,
            })
            .execute();
        }
      }

      // 4. Handle Medical Information
      if (data.medicalInformation) {
        // Transform form data to database schema format
        const medicalData = {
          doctorFirstName: data.medicalInformation.doctorFirstName,
          doctorLastName: data.medicalInformation.doctorLastName,
          doctorPhoneNumber: data.medicalInformation.doctorPhoneNumber,
          tetanusVaccination: data.medicalInformation.tetanusVaccination,
          asthma: data.medicalInformation.asthma,
          bedwetting: data.medicalInformation.bedwetting,
          epilepsy: data.medicalInformation.epilepsy,
          heartCondition: data.medicalInformation.heartCondition,
          hayFever: data.medicalInformation.hayFever,
          skinCondition: data.medicalInformation.skinCondition,
          rheumatism: data.medicalInformation.rheumatism,
          sleepwalking: data.medicalInformation.sleepwalking,
          diabetes: data.medicalInformation.diabetes,
          getsTiredQuickly: data.medicalInformation.getsTiredQuickly,
          canParticipateSports: data.medicalInformation.canParticipateSports,
          canSwim: data.medicalInformation.canSwim,
          permissionMedication: data.medicalInformation.permissionMedication,
          asthmaInformation:
            data.medicalInformation.asthmaDescription || undefined,
          bedwettingInformation:
            data.medicalInformation.bedwettingDescription || undefined,
          epilepsyInformation:
            data.medicalInformation.epilepsyDescription || undefined,
          heartConditionInformation:
            data.medicalInformation.heartConditionDescription || undefined,
          hayFeverInformation:
            data.medicalInformation.hayFeverDescription || undefined,
          skinConditionInformation:
            data.medicalInformation.skinConditionDescription || undefined,
          rheumatismInformation:
            data.medicalInformation.rheumatismDescription || undefined,
          sleepwalkingInformation:
            data.medicalInformation.sleepwalkingDescription || undefined,
          diabetesInformation:
            data.medicalInformation.diabetesDescription || undefined,
          foodAllergies: data.medicalInformation.hasFoodAllergies
            ? data.medicalInformation.foodAllergies || undefined
            : undefined,
          substanceAllergies: data.medicalInformation.hasSubstanceAllergies
            ? data.medicalInformation.substanceAllergies || undefined
            : undefined,
          medicationAllergies: data.medicalInformation.hasMedicationAllergies
            ? data.medicalInformation.medicationAllergies || undefined
            : undefined,
          medication: data.medicalInformation.hasMedication
            ? data.medicalInformation.medication || undefined
            : undefined,
          otherMedicalConditions: data.medicalInformation
            .hasOtherMedicalConditions
            ? data.medicalInformation.otherMedicalConditions || undefined
            : undefined,
          otherRemarks: data.medicalInformation.otherRemarks || undefined,
          pastMedicalHistory: undefined,
          tetanusVaccinationYear: undefined,
        };

        // Check if medical information already exists
        const existingMedicalInfo = await tx.query.medicalInformation.findFirst(
          {
            where: eq(schema.medicalInformation.memberId, member.id),
          },
        );

        if (existingMedicalInfo) {
          // Update existing medical information
          await tx
            .update(schema.medicalInformation)
            .set({
              ...medicalData,
              updatedAt: new Date(),
            })
            .where(eq(schema.medicalInformation.memberId, member.id))
            .execute();
        } else {
          // Create new medical information
          await tx
            .insert(schema.medicalInformation)
            .values({
              memberId: member.id,
              ...medicalData,
            })
            .execute();
        }
      }

      // 5. Handle Yearly Membership
      // Check if yearly membership already exists for this work year
      const existingMembership = await tx.query.yearlyMemberships.findFirst({
        where: and(
          eq(schema.yearlyMemberships.memberId, member.id),
          eq(schema.yearlyMemberships.workYearId, data.workYearId),
        ),
      });

      if (!existingMembership) {
        // Only create new yearly membership if it doesn't exist
        let group: schema.Group | null = null;

        // Use provided groupId if available, otherwise find automatically
        if (data.groupId) {
          group =
            (await tx.query.groups.findFirst({
              where: eq(schema.groups.id, data.groupId),
            })) ?? null;
        }

        group ??= await GROUP_QUERIES.findGroupForMember(
          member.dateOfBirth,
          member.gender,
        );

        if (!group) {
          throw new Error(
            `Could not find suitable group for member ${member.firstName} ${member.lastName}`,
          );
        }

        await tx
          .insert(schema.yearlyMemberships)
          .values({
            memberId: member.id,
            workYearId: data.workYearId,
            groupId: group.id,
            paymentReceived: data.paymentReceived,
            paymentMethod: data.paymentMethod,
            paymentDate: data.paymentDate,
          })
          .execute();
      }
      // If membership already exists, don't modify it (as per requirements)

      return member;
    });
  },

  // --- Complexe Transactie: Lid Updaten met Slimme Logica ---
  updateMember: async (
    memberId: number,
    data: FullNewMemberData,
  ): Promise<Member> => {
    // Form validation is already handled on the client side
    // Proceed directly with the database transaction

    return await db.transaction(async (tx) => {
      // 1. Get existing member
      const existingMember = await tx.query.members.findFirst({
        where: eq(schema.members.id, memberId),
      });

      if (!existingMember) {
        throw new Error("Member not found");
      }

      // 2. Update member with new data
      const [updatedMember] = await tx
        .update(schema.members)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          emailAddress: data.emailAddress,
          phoneNumber: data.phoneNumber,
          gdprPermissionToPublishPhotos: data.gdprPermissionToPublishPhotos,
          updatedAt: new Date(),
        })
        .where(eq(schema.members.id, memberId))
        .returning()
        .execute();

      if (!updatedMember) throw new Error("Failed to update member");

      // 3. Handle Parents
      // First, get existing parent relationships for this member
      const existingParentRelationships =
        await tx.query.membersParents.findMany({
          where: eq(schema.membersParents.memberId, memberId),
          with: {
            parent: {
              with: {
                address: true,
              },
            },
          },
        });

      // Create a set of existing parent IDs for easy lookup
      const existingParentIds = new Set(
        existingParentRelationships.map((r) => r.parentId),
      );

      // Process new parent data
      const newParentIds = new Set<number>();

      for (const parentData of data.parents) {
        // 3a. Find or create address
        const address = await ADDRESS_MUTATIONS.findOrCreate(
          parentData.address,
          tx,
        );

        // 3b. Find or create parent
        let parent = await tx.query.parents.findFirst({
          where: and(
            eq(schema.parents.firstName, parentData.firstName),
            eq(schema.parents.lastName, parentData.lastName),
            eq(schema.parents.addressId, address.id),
          ),
        });

        if (!parent) {
          // Create new parent
          const [newParent] = await tx
            .insert(schema.parents)
            .values({
              firstName: parentData.firstName,
              lastName: parentData.lastName,
              emailAddress: parentData.emailAddress,
              phoneNumber: parentData.phoneNumber,
              relationship: parentData.relationship,
              addressId: address.id,
            })
            .returning()
            .execute();

          if (!newParent) throw new Error("Failed to create parent");
          parent = newParent;
        } else {
          // Update existing parent
          await tx
            .update(schema.parents)
            .set({
              emailAddress: parentData.emailAddress,
              phoneNumber: parentData.phoneNumber,
              relationship: parentData.relationship,
              addressId: address.id,
              updatedAt: new Date(),
            })
            .where(eq(schema.parents.id, parent.id))
            .execute();
        }

        newParentIds.add(parent.id);

        // 3c. Link member to parent (update existing or create new)
        const existingRelationship = existingParentRelationships.find(
          (r) => r.parentId === parent.id,
        );

        if (existingRelationship) {
          // Update existing relationship
          await tx
            .update(schema.membersParents)
            .set({ isPrimary: parentData.isPrimary })
            .where(
              and(
                eq(schema.membersParents.memberId, memberId),
                eq(schema.membersParents.parentId, parent.id),
              ),
            )
            .execute();
        } else {
          // Create new relationship
          await tx
            .insert(schema.membersParents)
            .values({
              memberId: memberId,
              parentId: parent.id,
              isPrimary: parentData.isPrimary,
            })
            .execute();
        }
      }

      // 3d. Remove parent relationships that are no longer needed
      const parentsToRemove = existingParentRelationships.filter(
        (r) => !newParentIds.has(r.parentId),
      );

      for (const relationshipToRemove of parentsToRemove) {
        // Check if this parent has other children in the organization
        const otherChildren = await tx.query.membersParents.findMany({
          where: and(
            eq(schema.membersParents.parentId, relationshipToRemove.parentId),
            ne(schema.membersParents.memberId, memberId),
          ),
        });

        // Remove the relationship
        await tx
          .delete(schema.membersParents)
          .where(
            and(
              eq(schema.membersParents.memberId, memberId),
              eq(schema.membersParents.parentId, relationshipToRemove.parentId),
            ),
          )
          .execute();

        // If parent has no other children, remove the parent and potentially the address
        if (otherChildren.length === 0) {
          await tx
            .delete(schema.parents)
            .where(eq(schema.parents.id, relationshipToRemove.parentId))
            .execute();

          // Check if address is used by other parents
          const otherParentsWithSameAddress = await tx.query.parents.findMany({
            where: eq(
              schema.parents.addressId,
              relationshipToRemove.parent.addressId,
            ),
          });

          // If no other parents use this address, remove it
          if (otherParentsWithSameAddress.length === 0) {
            await tx
              .delete(schema.addresses)
              .where(
                eq(schema.addresses.id, relationshipToRemove.parent.addressId),
              )
              .execute();
          }
        }
      }

      // 4. Handle Emergency Contact
      if (data.emergencyContact) {
        // Check if emergency contact already exists
        const existingEmergencyContact =
          await tx.query.emergencyContacts.findFirst({
            where: eq(schema.emergencyContacts.memberId, memberId),
          });

        if (existingEmergencyContact) {
          // Update existing emergency contact
          await tx
            .update(schema.emergencyContacts)
            .set({
              firstName: data.emergencyContact.firstName,
              lastName: data.emergencyContact.lastName,
              phoneNumber: data.emergencyContact.phoneNumber,
              relationship: data.emergencyContact.relationship,
              updatedAt: new Date(),
            })
            .where(eq(schema.emergencyContacts.memberId, memberId))
            .execute();
        } else {
          // Create new emergency contact
          await tx
            .insert(schema.emergencyContacts)
            .values({
              memberId: memberId,
              ...data.emergencyContact,
            })
            .execute();
        }
      }

      // 5. Handle Medical Information
      if (data.medicalInformation) {
        // Transform form data to database schema format
        const medicalData = {
          doctorFirstName: data.medicalInformation.doctorFirstName,
          doctorLastName: data.medicalInformation.doctorLastName,
          doctorPhoneNumber: data.medicalInformation.doctorPhoneNumber,
          tetanusVaccination: data.medicalInformation.tetanusVaccination,
          asthma: data.medicalInformation.asthma,
          bedwetting: data.medicalInformation.bedwetting,
          epilepsy: data.medicalInformation.epilepsy,
          heartCondition: data.medicalInformation.heartCondition,
          hayFever: data.medicalInformation.hayFever,
          skinCondition: data.medicalInformation.skinCondition,
          rheumatism: data.medicalInformation.rheumatism,
          sleepwalking: data.medicalInformation.sleepwalking,
          diabetes: data.medicalInformation.diabetes,
          getsTiredQuickly: data.medicalInformation.getsTiredQuickly,
          canParticipateSports: data.medicalInformation.canParticipateSports,
          canSwim: data.medicalInformation.canSwim,
          permissionMedication: data.medicalInformation.permissionMedication,
          asthmaInformation:
            data.medicalInformation.asthmaDescription || undefined,
          bedwettingInformation:
            data.medicalInformation.bedwettingDescription || undefined,
          epilepsyInformation:
            data.medicalInformation.epilepsyDescription || undefined,
          heartConditionInformation:
            data.medicalInformation.heartConditionDescription || undefined,
          hayFeverInformation:
            data.medicalInformation.hayFeverDescription || undefined,
          skinConditionInformation:
            data.medicalInformation.skinConditionDescription || undefined,
          rheumatismInformation:
            data.medicalInformation.rheumatismDescription || undefined,
          sleepwalkingInformation:
            data.medicalInformation.sleepwalkingDescription || undefined,
          diabetesInformation:
            data.medicalInformation.diabetesDescription || undefined,
          foodAllergies: data.medicalInformation.hasFoodAllergies
            ? data.medicalInformation.foodAllergies || undefined
            : undefined,
          substanceAllergies: data.medicalInformation.hasSubstanceAllergies
            ? data.medicalInformation.substanceAllergies || undefined
            : undefined,
          medicationAllergies: data.medicalInformation.hasMedicationAllergies
            ? data.medicalInformation.medicationAllergies || undefined
            : undefined,
          medication: data.medicalInformation.hasMedication
            ? data.medicalInformation.medication || undefined
            : undefined,
          otherMedicalConditions: data.medicalInformation
            .hasOtherMedicalConditions
            ? data.medicalInformation.otherMedicalConditions || undefined
            : undefined,
          otherRemarks: data.medicalInformation.otherRemarks || undefined,
          pastMedicalHistory: undefined,
          tetanusVaccinationYear: undefined,
        };

        // Check if medical information already exists
        const existingMedicalInfo = await tx.query.medicalInformation.findFirst(
          {
            where: eq(schema.medicalInformation.memberId, memberId),
          },
        );

        if (existingMedicalInfo) {
          // Update existing medical information
          await tx
            .update(schema.medicalInformation)
            .set({
              ...medicalData,
              updatedAt: new Date(),
            })
            .where(eq(schema.medicalInformation.memberId, memberId))
            .execute();
        } else {
          // Create new medical information
          await tx
            .insert(schema.medicalInformation)
            .values({
              memberId: memberId,
              ...medicalData,
            })
            .execute();
        }
      }

      // 6. Handle Yearly Membership Updates
      // Check if yearly membership exists and update payment info
      const existingMembership = await tx.query.yearlyMemberships.findFirst({
        where: eq(schema.yearlyMemberships.memberId, memberId),
      });

      if (existingMembership) {
        // Update payment information
        await tx
          .update(schema.yearlyMemberships)
          .set({
            paymentReceived: data.paymentReceived,
            paymentMethod: data.paymentMethod,
            paymentDate: data.paymentDate,
            updatedAt: new Date(),
          })
          .where(eq(schema.yearlyMemberships.memberId, memberId))
          .execute();

        // Check if group needs to be updated based on new birthdate/gender or manual selection
        let newGroup: schema.Group | null = null;

        // Use provided groupId if available, otherwise find automatically
        if (data.groupId) {
          newGroup =
            (await tx.query.groups.findFirst({
              where: eq(schema.groups.id, data.groupId),
            })) ?? null;
        }

        newGroup ??= await GROUP_QUERIES.findGroupForMember(
          data.dateOfBirth,
          data.gender,
        );

        if (newGroup && newGroup.id !== existingMembership.groupId) {
          // Update group if it has changed
          await tx
            .update(schema.yearlyMemberships)
            .set({
              groupId: newGroup.id,
              updatedAt: new Date(),
            })
            .where(eq(schema.yearlyMemberships.memberId, memberId))
            .execute();
        }
      }

      return updatedMember;
    });
  },

  // --- Simpele Update: Basis Lid Info ---
  updateMemberDetails: async (
    id: number,
    data: Partial<NewMember>,
  ): Promise<Member | null> => {
    // Form validation is already handled on the client side
    // Proceed directly with the update

    const [updatedMember] = await db
      .update(schema.members)
      .set(data)
      .where(eq(schema.members.id, id))
      .returning()
      .execute();
    return updatedMember ?? null;
  },

  // --- Update/Create Emergency Contact ---
  upsertEmergencyContact: async (
    memberId: number,
    data: Omit<NewEmergencyContact, "memberId">,
  ): Promise<schema.EmergencyContact> => {
    const [result] = await db
      .insert(schema.emergencyContacts)
      .values({
        memberId: memberId,
        ...data,
      })
      .onConflictDoUpdate({
        target: schema.emergencyContacts.memberId,
        set: data,
      })
      .returning()
      .execute();
    if (!result) throw new Error("Failed to upsert emergency contact");
    return result;
  },

  // --- Update/Create Medical Information ---
  upsertMedicalInformation: async (
    memberId: number,
    data: Omit<NewMedicalInformation, "memberId">,
  ): Promise<schema.MedicalInformation> => {
    const [result] = await db
      .insert(schema.medicalInformation)
      .values({
        memberId: memberId,
        ...data,
      })
      .onConflictDoUpdate({
        target: schema.medicalInformation.memberId,
        set: data,
      })
      .returning()
      .execute();
    if (!result) throw new Error("Failed to upsert medical information");
    return result;
  },

  // --- Koppel Extra Ouder ---
  addParentToMember: async (
    memberId: number,
    parentId: number,
    isPrimary = false,
  ): Promise<void> => {
    if (isPrimary) {
      await db
        .update(schema.membersParents)
        .set({ isPrimary: false })
        .where(
          and(
            eq(schema.membersParents.memberId, memberId),
            eq(schema.membersParents.isPrimary, true),
          ),
        )
        .execute();
    }

    await db
      .insert(schema.membersParents)
      .values({ memberId, parentId, isPrimary })
      .onConflictDoNothing()
      .execute();
  },

  // --- Ontkoppel Ouder ---
  removeParentFromMember: async (
    memberId: number,
    parentId: number,
  ): Promise<void> => {
    await db
      .delete(schema.membersParents)
      .where(
        and(
          eq(schema.membersParents.memberId, memberId),
          eq(schema.membersParents.parentId, parentId),
        ),
      )
      .execute();
  },

  // --- Set Primaire Ouder ---
  setPrimaryParentForMember: async (
    memberId: number,
    parentId: number,
  ): Promise<void> => {
    await db.transaction(async (tx) => {
      // 1. Set all other parents for this member to non-primary
      await tx
        .update(schema.membersParents)
        .set({ isPrimary: false })
        .where(
          and(
            eq(schema.membersParents.memberId, memberId),
            ne(schema.membersParents.parentId, parentId),
          ),
        )
        .execute();

      // 2. Set the specified parent to primary
      await tx
        .update(schema.membersParents)
        .set({ isPrimary: true })
        .where(
          and(
            eq(schema.membersParents.memberId, memberId),
            eq(schema.membersParents.parentId, parentId),
          ),
        )
        .execute();
    });
  },
};
