import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type WorkYearUpdate } from "~/domain/entities/work-year";

/**
 * Update a work year.
 *
 * @param workYearId The ID of the work year to update
 * @param workYearData The data of the work year to update
 * @returns The updated work year
 *
 * @throws {WorkYearNotFoundError} If the work year was not found
 * @throws {WorkYearWithThatStartAndEndDateAlreadyExistsError} If a work year with that start and end date already exists
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function updateWorkYearUseCase(
  workYearId: number,
  workYearData: WorkYearUpdate,
) {
  return startSpan(
    { name: "updateWorkYear Use Case", op: "function" },
    async () => {
      const workyearsRepository = getInjection("IWorkYearsRepository");

      return await workyearsRepository.updateWorkYear(workYearId, workYearData);
    },
  );
}
