import { captureException, startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { GroupNotFoundError } from "~/domain/errors/groups";
import { WorkyearNotFoundError } from "~/domain/errors/workyears";
import { isLoggedIn } from "~/lib/auth";

export function getMembersByGroupUseCase(input: { groupId: number }) {
  return startSpan(
    { name: "getMembersByGroup Use Case", op: "function" },
    async () => {
      try {
        const membersRepository = getInjection("IMembersRepository");
        const workyearsRepository = getInjection("IWorkyearsRepository");

        if (!isLoggedIn()) {
          return {
            error: "Je moet ingelogd zijn om de ledenlijst te bekijken.",
          };
        }
        const currentWorkYear = await workyearsRepository.getWorkyearByDate(
          new Date(),
        );

        if (!currentWorkYear) {
          return { error: "Er is geen werkjaar actief." };
        }

        let members;
        try {
          members = await membersRepository.getMembersByGroup(
            input.groupId,
            currentWorkYear.id,
          );
        } catch (error) {
          if (error instanceof GroupNotFoundError) {
            return { error: "Groep niet gevonden." };
          }
          if (error instanceof WorkyearNotFoundError) {
            return { error: "Werkjaar niet gevonden." };
          }
          throw error;
        }

        return members;
      } catch (error) {
        captureException(error);
        return {
          error:
            "Er is een onbekende fout opgetreden bij het ophalen van de ledenlijst voor de groep. De beheerder is op de hoogte gebracht. Probeer het later opnieuw." +
            (error as Error).message,
        };
      }
    },
  );
}
