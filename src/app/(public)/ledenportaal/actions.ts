"use server";

import { createMember } from "~/server/queries/member-queries";
import { type CreateMemberData } from "~/server/schemas/member-schemas";
import { revalidatePath } from "next/cache";

export async function createMemberAndRevalidate(values: CreateMemberData) {
  await createMember(values);

  revalidatePath("/ledenportaal");
}
