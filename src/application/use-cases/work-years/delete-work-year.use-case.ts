import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";

/**
 * Delete a work year.
 *
 * @param workYearId The ID of the work year to delete
 *
 * @throws {WorkYearNotFoundError} If the work year was not found
 * @throws {WorkYearStillReferencedError} If the work year is still referenced by other entities
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function deleteWorkYearUseCase(workYearId: number): Promise<void> {
  return startSpan(
    { name: "deleteWorkYear Use Case", op: "function" },
    async () => {
      const workyearsRepository = getInjection("IWorkYearsRepository");

      return await workyearsRepository.deleteWorkYear(workYearId);
    },
  );
}
