"use server";

import { db } from "~/server/db/db";
import { mainLeaders, tentRentals, tentRentalTerms } from "~/server/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getAllMainLeaders() {
  return await db.select().from(mainLeaders).orderBy(asc(mainLeaders.order));
}

export async function getAllTentRentals() {
  return await db
    .select()
    .from(tentRentals)
    .where(eq(tentRentals.active, true))
    .orderBy(asc(tentRentals.name));
}

export async function getAllTentRentalTerms() {
  return await db
    .select()
    .from(tentRentalTerms)
    .where(eq(tentRentalTerms.active, true))
    .orderBy(asc(tentRentalTerms.order));
}
