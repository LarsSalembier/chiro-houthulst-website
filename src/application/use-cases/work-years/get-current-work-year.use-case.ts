import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type WorkYear } from "~/domain/entities/work-year";
import { WorkYearNotFoundError } from "~/domain/errors/work-years";

/**
 * Get the current work year.
 *
 * @returns The current work year
 *
 * @throws {WorkYearNotFoundError} If there is no current work year
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function getCurrentWorkYearUseCase(): Promise<WorkYear> {
  return startSpan(
    { name: "getCurrentWorkYear Use Case", op: "function" },
    async () => {
      const workyearsRepository = getInjection("IWorkYearsRepository");

      const today = new Date();

      const workYears = await workyearsRepository.getAllWorkYears();

      const currentWorkYear = workYears.find((workYear) => {
        return today >= workYear.startDate && today <= workYear.endDate;
      });

      if (!currentWorkYear) {
        throw new WorkYearNotFoundError("Current work year not found");
      }

      return currentWorkYear;
    },
  );
}
