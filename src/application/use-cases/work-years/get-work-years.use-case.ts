import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type WorkYear } from "~/domain/entities/work-year";

/**
 * Get all work years.
 *
 * @returns All work years
 *
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function getWorkYearsUseCase(): Promise<WorkYear[]> {
  return startSpan(
    { name: "getWorkYears Use Case", op: "function" },
    async () => {
      const workyearsRepository = getInjection("IWorkYearsRepository");

      return await workyearsRepository.getAllWorkYears();
    },
  );
}
