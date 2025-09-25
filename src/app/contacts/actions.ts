"use server";

import { requireAdminAuth } from "~/lib/auth";
import { db } from "~/server/db/db";
import { mainLeaders, vbs } from "~/server/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Main Leaders
export async function getAllMainLeaders() {
  try {
    const leaders = await db
      .select()
      .from(mainLeaders)
      .orderBy(asc(mainLeaders.order), asc(mainLeaders.name));

    return leaders;
  } catch (error) {
    console.error("Error fetching main leaders:", error);
    return [];
  }
}

export async function createMainLeader(data: {
  name: string;
  phone: string;
  order?: number;
}) {
  await requireAdminAuth();

  try {
    const [newLeader] = await db
      .insert(mainLeaders)
      .values({
        name: data.name,
        phone: data.phone,
        order: data.order ?? 0,
      })
      .returning();

    revalidatePath("/leidingsportaal/admin/instellingen");
    revalidatePath("/");

    return newLeader;
  } catch (error) {
    console.error("Error creating main leader:", error);
    throw new Error("Failed to create main leader");
  }
}

export async function updateMainLeader(
  id: number,
  data: { name?: string; phone?: string; order?: number },
) {
  await requireAdminAuth();

  try {
    const [updatedLeader] = await db
      .update(mainLeaders)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(mainLeaders.id, id))
      .returning();

    revalidatePath("/leidingsportaal/admin/instellingen");
    revalidatePath("/");

    return updatedLeader;
  } catch (error) {
    console.error("Error updating main leader:", error);
    throw new Error("Failed to update main leader");
  }
}

export async function deleteMainLeader(id: number) {
  await requireAdminAuth();

  try {
    await db.delete(mainLeaders).where(eq(mainLeaders.id, id));

    revalidatePath("/leidingsportaal/admin/instellingen");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting main leader:", error);
    throw new Error("Failed to delete main leader");
  }
}

// VBs
export async function getAllVBs() {
  try {
    const vbsList = await db
      .select()
      .from(vbs)
      .orderBy(asc(vbs.order), asc(vbs.name));

    return vbsList;
  } catch (error) {
    console.error("Error fetching VBs:", error);
    return [];
  }
}

export async function createVB(data: {
  name: string;
  phone: string;
  order?: number;
}) {
  await requireAdminAuth();

  try {
    const [newVB] = await db
      .insert(vbs)
      .values({
        name: data.name,
        phone: data.phone,
        order: data.order ?? 0,
      })
      .returning();

    revalidatePath("/leidingsportaal/admin/instellingen");
    revalidatePath("/");

    return newVB;
  } catch (error) {
    console.error("Error creating VB:", error);
    throw new Error("Failed to create VB");
  }
}

export async function updateVB(
  id: number,
  data: { name?: string; phone?: string; order?: number },
) {
  await requireAdminAuth();

  try {
    const [updatedVB] = await db
      .update(vbs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(vbs.id, id))
      .returning();

    revalidatePath("/leidingsportaal/admin/instellingen");
    revalidatePath("/");

    return updatedVB;
  } catch (error) {
    console.error("Error updating VB:", error);
    throw new Error("Failed to update VB");
  }
}

export async function deleteVB(id: number) {
  await requireAdminAuth();

  try {
    await db.delete(vbs).where(eq(vbs.id, id));

    revalidatePath("/leidingsportaal/admin/instellingen");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting VB:", error);
    throw new Error("Failed to delete VB");
  }
}
