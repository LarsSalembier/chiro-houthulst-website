"use server";

import { db } from "~/server/db/db";
import { tentRentals, tentRentalTerms } from "~/server/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllTentRentals() {
  return await db.select().from(tentRentals).orderBy(asc(tentRentals.name));
}

export async function createTentRental(data: {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  active?: boolean;
}) {
  const [tentRental] = await db
    .insert(tentRentals)
    .values({
      name: data.name,
      description: data.description ?? "",
      price: data.price,
      imageUrl: data.imageUrl ?? "",
      active: data.active ?? true,
    })
    .returning();

  revalidatePath("/tentverhuur");
  revalidatePath("/leidingsportaal/admin/tentverhuur");

  return tentRental;
}

export async function updateTentRental(
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    active?: boolean;
  },
) {
  const [tentRental] = await db
    .update(tentRentals)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(tentRentals.id, id))
    .returning();

  revalidatePath("/tentverhuur");
  revalidatePath("/leidingsportaal/admin/tentverhuur");

  return tentRental;
}

export async function deleteTentRental(id: number) {
  await db.delete(tentRentals).where(eq(tentRentals.id, id));

  revalidatePath("/tentverhuur");
  revalidatePath("/leidingsportaal/admin/tentverhuur");
}

// Tent Rental Terms functions
export async function getAllTentRentalTerms() {
  return await db
    .select()
    .from(tentRentalTerms)
    .orderBy(asc(tentRentalTerms.order));
}

export async function createTentRentalTerm(data: {
  text: string;
  order?: number;
  active?: boolean;
}) {
  const [term] = await db
    .insert(tentRentalTerms)
    .values({
      text: data.text,
      order: data.order ?? 0,
      active: data.active ?? true,
    })
    .returning();

  revalidatePath("/tentverhuur");
  revalidatePath("/leidingsportaal/admin/tentverhuur");

  return term;
}

export async function updateTentRentalTerm(
  id: number,
  data: {
    text?: string;
    order?: number;
    active?: boolean;
  },
) {
  const [term] = await db
    .update(tentRentalTerms)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(tentRentalTerms.id, id))
    .returning();

  revalidatePath("/tentverhuur");
  revalidatePath("/leidingsportaal/admin/tentverhuur");

  return term;
}

export async function deleteTentRentalTerm(id: number) {
  await db.delete(tentRentalTerms).where(eq(tentRentalTerms.id, id));

  revalidatePath("/tentverhuur");
  revalidatePath("/leidingsportaal/admin/tentverhuur");
}
