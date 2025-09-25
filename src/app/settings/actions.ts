"use server";

import { db } from "~/server/db/db";
import { settings, workYears } from "~/server/db/schema";
import { eq, desc, and, lte, gte } from "drizzle-orm";

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

export async function getSetting(key: string): Promise<string | null> {
  try {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    return result.length > 0 ? (result[0]?.value ?? null) : null;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

export async function getAllSettings() {
  try {
    const allSettings = await db.select().from(settings).orderBy(settings.key);

    return allSettings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return [];
  }
}

export async function updateSetting(
  key: string,
  value: string,
  description?: string,
) {
  try {
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (existing.length > 0) {
      // Update existing setting
      await db
        .update(settings)
        .set({
          value,
          description: description ?? existing[0]?.description ?? null,
          updatedAt: new Date(),
        })
        .where(eq(settings.key, key));
    } else {
      // Create new setting
      await db.insert(settings).values({ key, value, description });
    }

    return { success: true };
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return { success: false, error: "Failed to update setting" };
  }
}
