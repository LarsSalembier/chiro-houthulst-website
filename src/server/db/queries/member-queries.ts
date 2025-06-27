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

// Type voor complexe member data input
export type FullNewMemberData = NewMember & {
  parents: Array<NewParent & { address: NewAddress; isPrimary: boolean }>;
  emergencyContact?: Omit<NewEmergencyContact, "memberId">;
  medicalInformation?: Omit<NewMedicalInformation, "memberId">;
  workYearId: number; // Het werkjaar waarvoor ingeschreven wordt
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
};

export const MEMBER_MUTATIONS = {
  // --- Complexe Transactie: Nieuw Lid Registreren ---
  registerMember: async (data: FullNewMemberData): Promise<Member> => {
    // Validate input data using Zod schemas if needed (though types help)
    const memberParseResult = InsertMemberSchema.safeParse(data);
    if (!memberParseResult.success) {
      throw new Error(
        `Invalid member data: ${memberParseResult.error.message}`,
      );
    }
    // Add more validation for parents, etc.

    return await db.transaction(async (tx) => {
      const [newMember] = await tx
        .insert(schema.members)
        .values(data)
        .returning()
        .execute();
      if (!newMember) throw new Error("Failed to create member");

      // 2. Verwerk Ouders
      for (const parentData of data.parents) {
        const parentParseResult = InsertParentSchema.safeParse(parentData);
        if (!parentParseResult.success) {
          throw new Error(
            `Invalid parent data: ${parentParseResult.error.message}`,
          );
        }

        // 2a. Vind of maak adres aan
        const address = await ADDRESS_MUTATIONS.findOrCreate(
          parentData.address,
          tx,
        );

        // 2b. Vind of maak ouder aan
        let parent = await tx.query.parents.findFirst({
          where: parentData.emailAddress // Use email as unique identifier if available and reliable
            ? eq(schema.parents.emailAddress, parentData.emailAddress)
            : // Fallback to name + address if no email
              and(
                eq(schema.parents.firstName, parentData.firstName),
                eq(schema.parents.lastName, parentData.lastName),
                eq(schema.parents.addressId, address.id),
              ),
        });

        if (!parent) {
          const [newParent] = await tx
            .insert(schema.parents)
            .values(parentData)
            .returning()
            .execute();
          if (!newParent) throw new Error("Failed to create parent");
          parent = newParent;
        } else {
          await tx
            .update(schema.parents)
            .set(parentData)
            .where(eq(schema.parents.id, parent.id))
            .execute();
        }

        // 2c. Koppel lid aan ouder
        await tx
          .insert(schema.membersParents)
          .values({
            memberId: newMember.id,
            parentId: parent.id,
            isPrimary: parentData.isPrimary,
          })
          // Voorkom dubbele koppeling (indien nodig)
          .onConflictDoNothing()
          .execute();
      }

      // 3. Maak Emergency Contact aan (indien opgegeven)
      if (data.emergencyContact) {
        await tx
          .insert(schema.emergencyContacts)
          .values({
            memberId: newMember.id,
            ...data.emergencyContact,
          })
          .execute();
      }

      // 4. Maak Medical Information aan (indien opgegeven)
      if (data.medicalInformation) {
        await tx
          .insert(schema.medicalInformation)
          .values({
            memberId: newMember.id,
            ...data.medicalInformation,
          })
          .execute();
      }

      // 5. Maak Yearly Membership aan
      // 5a. Vind de juiste groep (of laat gebruiker kiezen?)
      const group = await GROUP_QUERIES.findGroupForMember(
        newMember.dateOfBirth,
        newMember.gender,
      );
      if (!group) {
        // Fallback: Wijs toe aan een default groep of gooi error?
        // Of laat dit veld leeg en vereis handmatige toewijzing?
        // Voor nu: gooi error
        throw new Error(
          `Could not find suitable group for member ${newMember.firstName} ${newMember.lastName}`,
        );
      }

      await tx
        .insert(schema.yearlyMemberships)
        .values({
          memberId: newMember.id,
          workYearId: data.workYearId,
          groupId: group.id,
          paymentReceived: false,
        })
        .execute();

      return newMember;
    });
  },

  // --- Simpele Update: Basis Lid Info ---
  updateMemberDetails: async (
    id: number,
    data: Partial<NewMember>,
  ): Promise<Member | null> => {
    const parseResult = InsertMemberSchema.partial().safeParse(data);
    if (!parseResult.success) {
      throw new Error(`Invalid update data: ${parseResult.error.message}`);
    }

    const [updatedMember] = await db
      .update(schema.members)
      .set(parseResult.data)
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

  // --- Verwijder Lid ---
  // Dit zal via cascade ook emergency contact, medical info, memberships, etc. verwijderen.
  // Wees hier zeer voorzichtig mee! Overweeg een 'soft delete' (bv. een 'archived' boolean).
  removeMember: async (id: number): Promise<void> => {
    console.warn(
      `Attempting to permanently delete member with ID: ${id}. This is irreversible.`,
    );

    try {
      await db
        .delete(schema.members)
        .where(eq(schema.members.id, id))
        .execute();
    } catch (error) {
      console.error(`Error deleting member with ID ${id}:`, error);
      throw new Error("Fout bij het verwijderen van het lid.");
    }
  },
};
