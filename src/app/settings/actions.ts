"use server";

import { db } from "~/server/db/db";
import { workYears } from "~/server/db/schema";
import { desc, and, lte, gte } from "drizzle-orm";

export async function getCurrentMembershipFee(): Promise<number> {
  try {
    const now = new Date();

    // Zoek het huidige werkjaar
    const currentWorkYear = await db
      .select()
      .from(workYears)
      .where(
        and(
          lte(workYears.startDate, now),
          gte(
            workYears.endDate ?? new Date(now.getFullYear() + 1, 11, 31),
            now,
          ),
        ),
      )
      .orderBy(desc(workYears.startDate))
      .limit(1);

    if (currentWorkYear.length > 0) {
      return currentWorkYear[0]?.membershipFee ?? 40;
    }

    // Als er geen huidig werkjaar is, zoek het meest recente werkjaar
    const latestWorkYear = await db
      .select()
      .from(workYears)
      .orderBy(desc(workYears.startDate))
      .limit(1);

    if (latestWorkYear.length > 0) {
      return latestWorkYear[0]?.membershipFee ?? 40;
    }

    // Fallback prijs
    return 40;
  } catch (error) {
    console.error("Error fetching membership fee:", error);
    return 40; // Fallback prijs
  }
}
