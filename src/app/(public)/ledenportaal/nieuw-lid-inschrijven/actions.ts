"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createMemberRegistration } from "~/server/queries/registration-queries";
import { type RegistrationFormValues } from "./schemas";

export async function createMemberRegistrationAndRevalidate(
  data: RegistrationFormValues,
) {
  await createMemberRegistration(data);

  revalidatePath("/ledenportaal");
  redirect("/ledenportaal");
}
