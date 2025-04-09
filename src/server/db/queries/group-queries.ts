import { asc, eq, and, or, sql, lte, gte, isNull } from "drizzle-orm";
import {
  groups,
  yearlyMemberships,
  type NewGroup,
  type Group,
  type Gender,
  eventGroups,
} from "~/server/db/schema";
import { db } from "../db";
import { isForeignKeyViolationError } from "./query-utils";

export const GROUP_QUERIES = {
  getAll: async (options?: { activeOnly?: boolean }): Promise<Group[]> => {
    return await db.query.groups.findMany({
      where: options?.activeOnly ? eq(groups.active, true) : undefined,
      orderBy: [asc(groups.minimumAgeInDays), asc(groups.name)],
    });
  },

  getById: async (id: number): Promise<Group | null> => {
    const result = await db.query.groups.findFirst({
      where: eq(groups.id, id),
    });
    return result ?? null;
  },

  getByName: async (name: string): Promise<Group | null> => {
    const result = await db.query.groups.findFirst({
      where: eq(groups.name, name),
    });
    return result ?? null;
  },

  getGroupsWithMemberCount: async (workYearId: number) => {
    const result = await db
      .select({
        group: groups,
        memberCount: sql<number>`count(${yearlyMemberships.memberId})`.mapWith(
          Number,
        ),
      })
      .from(groups)
      .leftJoin(
        yearlyMemberships,
        and(
          eq(groups.id, yearlyMemberships.groupId),
          eq(yearlyMemberships.workYearId, workYearId),
        ),
      )
      .groupBy(groups.id)
      .orderBy(asc(groups.minimumAgeInDays), asc(groups.name))
      .execute();

    return result;
  },

  findGroupForMember: async (
    dateOfBirth: Date,
    gender?: Gender,
  ): Promise<Group | null> => {
    const ageInDays = Math.floor(
      (new Date().getTime() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24),
    );

    const potentialGroups = await db.query.groups.findMany({
      where: and(
        eq(groups.active, true),
        groups.minimumAgeInDays
          ? lte(groups.minimumAgeInDays, ageInDays)
          : undefined,
        groups.maximumAgeInDays
          ? gte(groups.maximumAgeInDays, ageInDays)
          : undefined,
        gender
          ? or(eq(groups.gender, gender), isNull(groups.gender))
          : undefined,
      ),
      orderBy: [asc(groups.minimumAgeInDays)],
    });

    return potentialGroups[0] ?? null;
  },
};

export const GROUP_MUTATIONS = {
  create: async (data: NewGroup): Promise<Group> => {
    const [newGroup] = await db
      .insert(groups)
      .values(data)
      .returning()
      .execute();

    if (!newGroup) {
      throw new Error("Failed to create group");
    }
    return newGroup;
  },

  update: async (
    id: number,
    data: Partial<NewGroup>,
  ): Promise<Group | null> => {
    const [updatedGroup] = await db
      .update(groups)
      .set(data)
      .where(eq(groups.id, id))
      .returning()
      .execute();
    return updatedGroup ?? null;
  },

  setActiveStatus: async (
    id: number,
    active: boolean,
  ): Promise<Group | null> => {
    const [updatedGroup] = await db
      .update(groups)
      .set({ active })
      .where(eq(groups.id, id))
      .returning()
      .execute();
    return updatedGroup ?? null;
  },

  remove: async (id: number): Promise<void> => {
    const hasMembers = await db.query.yearlyMemberships.findFirst({
      where: eq(yearlyMemberships.groupId, id),
    });

    if (hasMembers) {
      throw new Error(
        "Groep kan niet verwijderd worden: er zijn nog leden aan gekoppeld (in een werkjaar).",
      );
    }

    const hasEvents = await db.query.eventGroups.findFirst({
      where: eq(eventGroups.groupId, id),
      columns: { eventId: true },
    });

    if (hasEvents) {
      throw new Error(
        "Groep kan niet verwijderd worden: de groep is nog gekoppeld aan een of meerdere evenementen.",
      );
    }

    try {
      await db.delete(groups).where(eq(groups.id, id)).execute();
    } catch (error: unknown) {
      if (isForeignKeyViolationError(error)) {
        console.error("Cannot delete group: it is still referenced.");
        throw new Error(
          "Groep kan niet verwijderd worden: er zijn nog koppelingen (leden en/of evenementen).",
        );
      }
      console.error("Error deleting group:", error);
      throw new Error("Fout bij verwijderen groep.");
    }
  },
};
