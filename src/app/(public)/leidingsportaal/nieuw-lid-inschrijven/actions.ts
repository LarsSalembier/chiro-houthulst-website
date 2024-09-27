"use server";

import {
  captureException,
  withServerActionInstrumentation,
} from "@sentry/nextjs";
import { type Gender } from "~/domain/enums/gender";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "~/domain/errors/authentication";
import { GroupNotFoundError } from "~/domain/errors/groups";
import {
  MemberWithThatEmailAddressAlreadyExistsError,
  MemberWithThatNameAndBirthDateAlreadyExistsError,
} from "~/domain/errors/members";
import { ParentWithThatEmailAddressAlreadyExistsError } from "~/domain/errors/parents";
import { WorkYearNotFoundError } from "~/domain/errors/work-years";
import { getGroupsForBirthDateAndGenderController } from "~/interface-adapters/controllers/groups/get-groups-for-birth-date-and-gender.controller";
import { registerMemberController } from "~/interface-adapters/controllers/members/register-member.controller";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

export async function registerMember(formData: RegisterMemberInput) {
  return await withServerActionInstrumentation(
    "registerMember",
    { recordResponse: true },
    async () => {
      try {
        const result = await registerMemberController(formData);

        return { success: result };
      } catch (error) {
        if (error instanceof UnauthenticatedError) {
          return {
            error: "Je kan geen lid inschrijven als je niet ingelogd bent",
          };
        }

        if (error instanceof UnauthorizedError) {
          return {
            error:
              "Je kan geen lid inschrijven als je geen leiding bent. Als je wel degelijk leiding bent, neem dan contact op met de administrator om je rechten aan te passen.",
          };
        }

        if (error instanceof MemberWithThatEmailAddressAlreadyExistsError) {
          return {
            error: "Er bestaat al een lid met dit e-mailadres",
          };
        }

        if (error instanceof MemberWithThatNameAndBirthDateAlreadyExistsError) {
          return {
            error: "Er bestaat al een lid met deze naam en geboortedatum",
          };
        }

        if (error instanceof ParentWithThatEmailAddressAlreadyExistsError) {
          return {
            error: "Er bestaat al een ouder met dit e-mailadres",
          };
        }

        if (error instanceof WorkYearNotFoundError) {
          return {
            error:
              "Er is nog geen werkjaar gestart, dus je kan geen lid inschrijven",
          };
        }

        if (error instanceof GroupNotFoundError) {
          return {
            error: "De groep die je hebt opgegeven bestaat niet",
          };
        }

        captureException(error, { data: formData });
        return {
          error:
            "Er is een onverwachte fout opgetreden. De administrator is op de hoogte gebracht en zal dit zo snel mogelijk oplossen.",
        };
      }
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
