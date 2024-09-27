import { startSpan } from "@sentry/nextjs";
import { getCurrentWorkYearUseCase } from "~/application/use-cases/work-years/get-current-work-year.use-case";
import { type WorkYear } from "~/domain/entities/work-year";

/**
 * Controller for getting the current work year
 *
 * @returns The current work year
 *
 * @throws {WorkYearNotFoundError} - If no work year is found
 * @throws {DatabaseOperationError} - If an error occurs in the database
 */
export async function getCurrentWorkYearController(): Promise<WorkYear> {
  return await startSpan(
    {
      name: "getCurrentWorkYear Controller",
    },
    async () => {
      return await getCurrentWorkYearUseCase();
    },
  );
}
