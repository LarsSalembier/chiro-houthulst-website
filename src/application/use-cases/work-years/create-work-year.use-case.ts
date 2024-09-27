import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import {
  type WorkYear,
  type WorkYearInsert,
} from "~/domain/entities/work-year";

/**
 * Create a new work year.
 *
 * @param workYearData The data of the work year to create
 * @returns The created work year
 *
 * @throws {WorkYearWithThatStartAndEndDateAlreadyExistsError} If a work year with that start and end date already exists
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function createWorkYearUseCase(
  workYearData: WorkYearInsert,
): Promise<WorkYear> {
  return startSpan(
    { name: "createWorkYear Use Case", op: "function" },
    async () => {
      const workyearsRepository = getInjection("IWorkYearsRepository");

      return await workyearsRepository.createWorkYear(workYearData);
    },
  );
}
