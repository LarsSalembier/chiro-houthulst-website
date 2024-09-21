"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type RegistrationFormData } from "./schemas";
import { signUpMemberUseCase } from "~/application/use-cases/sign-up-member.use-case";
import { withServerActionInstrumentation } from "@sentry/nextjs";
import { getGroupsForBirthDateAndGenderUseCase } from "~/application/use-cases/get-groups-for-bithdate-and-gender.use-case";
import { type Gender } from "~/domain/enums/gender";

export async function signUpMember(formData: RegistrationFormData) {
  return await withServerActionInstrumentation(
    "signUpMember",
    { recordResponse: true },
    async () => {
      const result = await signUpMemberUseCase({ formData: formData });

      revalidatePath("/leidingsportaal");
      redirect("/leidingsportaal");

      return result;
    },
  );
}

export async function getGroupsForBirthDateAndGender(
  birthDate: Date,
  gender: Gender,
) {
  return await withServerActionInstrumentation(
    "getGroupsForBirthDateAndGender",
    { recordResponse: true },
    async () => {
      try {
        const result = await getGroupsForBirthDateAndGenderUseCase(
          birthDate,
          gender,
        );
        return result;
      } catch (error) {
        console.error("Error in getGroupsForBirthDateAndGender:", error);
        throw error; // Re-throw the error to be caught in the component
      }
    },
  );
}
