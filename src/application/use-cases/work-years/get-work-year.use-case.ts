import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type WorkYear } from "~/domain/entities/work-year";
import { WorkYearNotFoundError } from "~/domain/errors/work-years";

/**
 * Get a work year by ID.
 *
 * @param workYearId The ID of the work year to get
 * @returns The work year
 *
 * @throws {WorkYearNotFoundError} If the work year was not found
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function getWorkYearUseCase(
  workYearId: number,
): Promise<WorkYear> {
  return startSpan(
    { name: "getWorkYear Use Case", op: "function" },
    async () => {
      const workyearsRepository = getInjection("IWorkYearsRepository");

      const workYear = await workyearsRepository.getWorkYearById(workYearId);

      if (!workYear) {
        throw new WorkYearNotFoundError("Work year not found");
      }

      return workYear;
    },
  );
}
