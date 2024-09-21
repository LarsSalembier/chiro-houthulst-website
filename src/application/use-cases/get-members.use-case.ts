import { captureException, startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { isLoggedIn } from "~/lib/auth";

export function getMembersUseCase() {
  return startSpan(
    { name: "getMembers Use Case", op: "function" },
    async () => {
      try {
        const membersRepository = getInjection("IMembersRepository");

        if (!isLoggedIn()) {
          return {
            error: "Je moet ingelogd zijn om de ledenlijst te bekijken.",
          };
        }

        const members = await membersRepository.getMembers();
        return members;
      } catch (error) {
        captureException(error);
        return {
          error:
            "Er is een onbekende fout opgetreden bij het ophalen van de ledenlijst. De beheerder is op de hoogte gebracht. Probeer het later opnieuw.",
        };
      }
    },
  );
}
