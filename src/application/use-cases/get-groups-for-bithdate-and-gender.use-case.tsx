import { captureException, startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Gender } from "~/domain/enums/gender";
import { isLoggedIn } from "~/lib/auth";

export function getGroupsForBirthDateAndGenderUseCase(
  birthDate: Date,
  gender: Gender,
) {
  return startSpan(
    { name: "getGroupsForBirthDateAndGender Use Case", op: "function" },
    async () => {
      try {
        const groupsRepository = getInjection("IGroupsRepository");

        if (!isLoggedIn()) {
          return { error: "Je moet ingelogd zijn om de groepen te bekijken." };
        }

        const groups =
          await groupsRepository.getActiveGroupsForBirthDateAndGender(
            birthDate,
            gender,
          );
        return groups;
      } catch (error) {
        console.log(error);
        captureException(error);
        return {
          error:
            "Er is een onbekende fout opgetreden bij het ophalen van de groepen. De beheerder is op de hoogte gebracht. Probeer het later opnieuw.",
        };
      }
    },
  );
}
