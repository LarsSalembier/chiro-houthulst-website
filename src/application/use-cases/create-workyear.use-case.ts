import { captureException, startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type WorkyearInsert } from "~/domain/entities/workyear";
import { WorkyearAlreadyExistsError } from "~/domain/errors/workyears";
import { isLeiding, isLoggedIn } from "~/lib/auth";

export function createWorkyearUseCase(input: { workYearData: WorkyearInsert }) {
  return startSpan(
    { name: "createWorkyear Use Case", op: "function" },
    async () => {
      try {
        const workyearsRepository = getInjection("IWorkyearsRepository");

        if (!isLoggedIn()) {
          return {
            error: "Je moet ingelogd zijn om een werkjaar aan te maken.",
          };
        }

        if (!isLeiding()) {
          return {
            error:
              "Je moet leiding zijn om een werkjaar aan te maken. Als je denkt dat dit een fout is, neem dan contact op met de beheerder.",
          };
        }

        console.log("Test");

        // Create the workyear
        let workyear;
        try {
          workyear = await workyearsRepository.createWorkyear(
            input.workYearData,
          );
        } catch (error) {
          if (error instanceof WorkyearAlreadyExistsError) {
            return {
              error: "Er bestaat al een werkjaar met overlappende data.",
            };
          }
          throw error;
        }

        return workyear;
      } catch (error) {
        captureException(error);
        return {
          error:
            "Er is een onbekende fout opgetreden bij het aanmaken van het werkjaar. De beheerder is op de hoogte gebracht. Probeer het later opnieuw.",
        };
      }
    },
  );
}
