"use server";

import {
  captureException,
  withServerActionInstrumentation,
} from "@sentry/nextjs";
import { getAllMemberDataUseCase } from "~/application/use-cases/members/get-all-member-data";
import { type Gender } from "~/domain/enums/gender";
import { getGroupsForBirthDateAndGenderController } from "~/interface-adapters/controllers/groups/get-groups-for-birth-date-and-gender.controller";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";
import { registerMemberOld } from "~/services/registration";

export async function registerMember(formData: RegisterMemberInput) {
  return await registerMemberOld(formData);
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
        const result = await getGroupsForBirthDateAndGenderController(
          birthDate,
          gender,
        );
        return { success: result };
      } catch (error) {
        captureException(error);
        return {
          error:
            "Er is een fout opgetreden bij het ophalen van de groepen. De administrator is op de hoogte gebracht en zal dit zo snel mogelijk oplossen.",
        };
      }
    },
  );
}

export async function getAllMemberData(
  firstName: string,
  lastName: string,
  birthDate: Date,
) {
  return await withServerActionInstrumentation(
    "getAllMemberData",
    { recordResponse: true },
    async () => {
      try {
        const result = await getAllMemberDataUseCase(
          firstName,
          lastName,
          birthDate,
        );
        return { success: result };
      } catch (error) {
        captureException(error);
        return {
          error:
            "Er is een fout opgetreden bij het ophalen van de gegevens van het lid. De administrator is op de hoogte gebracht en zal dit zo snel mogelijk oplossen.",
        };
      }
    },
  );
}
