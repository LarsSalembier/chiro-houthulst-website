import { asc, desc, eq, lte, gte, and, ne, isNull, or } from "drizzle-orm";
import { workYears, type NewWorkYear, type WorkYear } from "~/server/db/schema";
import { db } from "../db";
import { isForeignKeyViolationError } from "./query-utils";

export const WORK_YEAR_QUERIES = {
  getAll: async (orderBy: "asc" | "desc" = "desc"): Promise<WorkYear[]> => {
    return await db.query.workYears.findMany({
      orderBy: [
        orderBy === "asc"
          ? asc(workYears.startDate)
          : desc(workYears.startDate),
      ],
    });
  },

  getById: async (id: number): Promise<WorkYear | null> => {
    const result = await db.query.workYears.findFirst({
      where: eq(workYears.id, id),
      // Optionally include related data if needed often
      // with: {
      //   yearlyMemberships: true,
      //   sponsorshipAgreements: true,
      // }
    });
    return result ?? null;
  },

  getByDate: async (date: Date = new Date()): Promise<WorkYear | null> => {
    const result = await db.query.workYears.findFirst({
      where: and(
        lte(workYears.startDate, date),
        or(gte(workYears.endDate, date), isNull(workYears.endDate)),
      ),
      orderBy: [desc(workYears.startDate)],
    });
    return result ?? null;
  },

  getLatest: async (): Promise<WorkYear | null> => {
    const result = await db.query.workYears.findFirst({
      orderBy: [desc(workYears.endDate)],
    });
    return result ?? null;
  },

  getCurrent: async (): Promise<WorkYear | null> => {
    // Get the active work year (no end date set)
    const result = await db.query.workYears.findFirst({
      where: isNull(workYears.endDate),
      orderBy: [desc(workYears.startDate)],
    });
    return result ?? null;
  },

  getActive: async (): Promise<WorkYear[]> => {
    return await db.query.workYears.findMany({
      where: isNull(workYears.endDate),
      orderBy: [desc(workYears.startDate)],
    });
  },
};

export const WORK_YEAR_MUTATIONS = {
  create: async (data: NewWorkYear): Promise<WorkYear> => {
    if (data.endDate && data.endDate <= data.startDate) {
      throw new Error("End date must be after start date");
    }

    // Check if there's already an active work year
    const activeWorkYear = await db.query.workYears.findFirst({
      where: isNull(workYears.endDate),
    });

    if (activeWorkYear && !data.endDate) {
      throw new Error(
        "There is already an active work year. Please end the current work year first.",
      );
    }

    const [newWorkYear] = await db
      .insert(workYears)
      .values(data)
      .returning()
      .execute();

    if (!newWorkYear) {
      throw new Error("Failed to create work year");
    }
    return newWorkYear;
  },

  update: async (
    id: number,
    data: Partial<NewWorkYear>,
  ): Promise<WorkYear | null> => {
    if (data.startDate && data.endDate && data.endDate <= data.startDate) {
      throw new Error("End date must be after start date");
    }

    const existing = await db.query.workYears.findFirst({
      where: and(
        lte(workYears.startDate, data.endDate ?? new Date()),
        or(
          gte(workYears.endDate, data.startDate ?? new Date()),
          isNull(workYears.endDate),
        ),
        ne(workYears.id, id),
      ),
    });

    if (existing) {
      throw new Error("Work year overlaps with existing work year");
    }

    const [updatedWorkYear] = await db
      .update(workYears)
      .set(data)
      .where(eq(workYears.id, id))
      .returning()
      .execute();
    return updatedWorkYear ?? null;
  },

  endWorkYear: async (id: number, endDate: Date): Promise<WorkYear | null> => {
    const [updatedWorkYear] = await db
      .update(workYears)
      .set({ endDate })
      .where(eq(workYears.id, id))
      .returning()
      .execute();
    return updatedWorkYear ?? null;
  },

  remove: async (id: number): Promise<void> => {
    try {
      await db.delete(workYears).where(eq(workYears.id, id)).execute();
    } catch (error: unknown) {
      if (isForeignKeyViolationError(error)) {
        console.error(
          "Cannot delete work year: it is referenced by memberships or sponsorships.",
        );
        throw new Error(
          "Werkjaar kan niet verwijderd worden: er zijn inschrijvingen en/of sponsoringen aan gekoppeld.",
        );
      }
      console.error("Error deleting work year:", error);
      throw new Error("Fout bij verwijderen werkjaar.");
    }
  },
};
