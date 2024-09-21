"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type RegistrationFormData } from "./schemas";
import { signUpMemberUseCase } from "~/application/use-cases/sign-up-member.use-case";
import { withServerActionInstrumentation } from "@sentry/nextjs";

export async function signUpMember(formData: RegistrationFormData) {
  return await withServerActionInstrumentation(
    "signUpMember",
    { recordResponse: true },
    async () => {
      const result = await signUpMemberUseCase({ formData: formData });

      revalidatePath("/ledenportaal");
      redirect("/ledenportaal");

      return result;
    },
  );
}
