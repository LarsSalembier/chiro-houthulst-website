import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq, gte, lte } from "drizzle-orm";
import { injectable } from "inversify";
import { type IWorkyearsRepository } from "~/application/repositories/workyears.repository.interface";
import { type WorkyearUpdate, type Workyear, type WorkyearInsert } from "~/domain/entities/workyear";
import { db } from "~/server/db";
import { workyears as workyearsTable } from "~/server/db/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  WorkyearAlreadyExistsError,
  WorkyearStillReferencedError,
  WorkyearNotFoundError,
} from "~/domain/errors/workyears";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";

@injectable()
export class WorkyearsRepository implements IWorkyearsRepository {
  /**
   * Creates a new work year.
   *
   * @param workYear The work year data to insert.
   * @returns The created work year.
   * @throws {WorkyearAlreadyExistsError} If a work year with overlapping dates already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createWorkyear(workYear: WorkyearInsert): Promise<Workyear> {
    return await startSpan(
      { name: "WorkyearsRepository > createWorkyear" },
      async () => {
        try {
          const query = db.insert(workyearsTable).values(workYear).returning();

          const [createdWorkyear] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdWorkyear) {
            throw new DatabaseOperationError("Failed to create work year");
          }

          return createdWorkyear;
        } catch (error) {
          if (error instanceof WorkyearAlreadyExistsError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new WorkyearAlreadyExistsError(
              "A work year with the same start and end dates already exists",
              { cause: error },
            );
          }

          captureException(error, { data: workYear });
          throw new DatabaseOperationError("Failed to create work year", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets a work year by its ID.
   *
   * @param workYearId The ID of the work year to retrieve.
   * @returns The work year if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getWorkyear(workYearId: number): Promise<Workyear | undefined> {
    return await startSpan(
      { name: "WorkyearsRepository > getWorkyear" },
      async () => {
        try {
          const query = db.query.workyears.findFirst({
            where: eq(workyearsTable.id, workYearId),
          });

          const dbWorkyear = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbWorkyear) {
            return undefined;
          }

          return dbWorkyear;
        } catch (error) {
          captureException(error, { data: { workYearId } });
          throw new DatabaseOperationError("Failed to get work year", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets a work year by a specific date.
   *
   * @param date The date to check for.
   * @returns The work year if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getWorkyearByDate(date: Date): Promise<Workyear | undefined> {
    return await startSpan(
      { name: "WorkyearsRepository > getWorkyearByDate" },
      async () => {
        try {
          const query = db.query.workyears.findFirst({
            where: and(
              lte(workyearsTable.startDate, date),
              gte(workyearsTable.endDate, date),
            ),
          });

          const dbWorkyear = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!dbWorkyear) {
            return undefined;
          }

          return dbWorkyear;
        } catch (error) {
          captureException(error, { data: { date } });
          throw new DatabaseOperationError("Failed to get work year by date", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets all work years.
   *
   * @returns An array of work years.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getWorkyears(): Promise<Workyear[]> {
    return await startSpan(
      { name: "WorkyearsRepository > getWorkyears" },
      async () => {
        try {
          const query = db.query.workyears.findMany();

          const dbWorkyears = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return dbWorkyears;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get work years", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Updates a work year.
   *
   * @param id The ID of the work year to update.
   * @param input The data to update.
   * @returns The updated work year.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {WorkyearAlreadyExistsError} If the updated dates overlap with an existing work year.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateWorkyear(
    id: number,
    input: WorkyearUpdate,
  ): Promise<Workyear> {
    return await startSpan(
      { name: "WorkyearsRepository > updateWorkyear" },
      async () => {
        try {
          // Check if the work year exists
          const existingWorkyear = await this.getWorkyear(id);

          if (!existingWorkyear) {
            throw new WorkyearNotFoundError("Work year not found");
          }

          const query = db
            .update(workyearsTable)
            .set(input)
            .where(eq(workyearsTable.id, id))
            .returning();

          const [updatedWorkyear] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedWorkyear) {
            throw new WorkyearNotFoundError("Work year not found");
          }

          return updatedWorkyear;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new WorkyearAlreadyExistsError(
              "A work year with the same start and end dates already exists",
              { cause: error },
            );
          }

          captureException(error, { data: { id, input } });
          throw new DatabaseOperationError("Failed to update work year", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Deletes a work year.
   *
   * @param id The ID of the work year to delete.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {WorkyearStillReferencedError} If the work year is still referenced by other entities.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteWorkyear(id: number): Promise<void> {
    return await startSpan(
      { name: "WorkyearsRepository > deleteWorkyear" },
      async () => {
        try {
          const query = db
            .delete(workyearsTable)
            .where(eq(workyearsTable.id, id))
            .returning();

          const [deletedWorkyear] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedWorkyear) {
            throw new WorkyearNotFoundError("Work year not found");
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new WorkyearStillReferencedError(
              "Work year is still referenced by other entities",
              { cause: error },
            );
          }

          captureException(error, { data: { id } });
          throw new DatabaseOperationError("Failed to delete work year", {
            cause: error,
          });
        }
      },
    );
  }
}
