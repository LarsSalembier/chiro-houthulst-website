"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type RegistrationFormValues } from "./schemas";
import { signUpMemberUseCase } from "~/application/use-cases/sign-up-member.use-case";

export async function createMemberRegistrationAndRevalidate(
  data: RegistrationFormValues,
) {
  await signUpMemberUseCase({ registrationFormValues: data });

  revalidatePath("/ledenportaal");
  redirect("/ledenportaal");
}
