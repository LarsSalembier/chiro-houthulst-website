import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq } from "drizzle-orm";
import { injectable } from "inversify";
import { IWorkYearsRepository } from "~/application/repositories/work-years.repository.interface";
import {
  WorkYear,
  WorkYearInsert,
  WorkYearUpdate,
} from "~/domain/entities/work-year";
import { DatabaseOperationError } from "~/domain/errors/common";
import { db } from "drizzle";
import { workYears as workYearsTable } from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  WorkYearWithThatStartAndEndDateAlreadyExistsError,
  WorkYearNotFoundError,
  WorkYearStillReferencedError,
} from "~/domain/errors/work-years";
import { UNIQUE_START_END_DATE_FOR_WORK_YEAR_CONSTRAINT } from "drizzle/schema";

@injectable()
export class WorkYearsRepository implements IWorkYearsRepository {
  async createWorkYear(workYear: WorkYearInsert): Promise<WorkYear> {
    return await startSpan(
      { name: "WorkYearsRepository > createWorkYear" },
      async () => {
        try {
          const query = db.insert(workYearsTable).values(workYear).returning();

          const [createdWorkYear] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdWorkYear) {
            throw new DatabaseOperationError("Failed to create work year");
          }

          return createdWorkYear;
        } catch (error) {
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation &&
            error.constraint === UNIQUE_START_END_DATE_FOR_WORK_YEAR_CONSTRAINT
          ) {
            throw new WorkYearWithThatStartAndEndDateAlreadyExistsError(
              "Work year already exists",
              {
                cause: error,
              },
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

  async getWorkYearById(id: number): Promise<WorkYear | undefined> {
    return await startSpan(
      { name: "WorkYearsRepository > getWorkYearById" },
      async () => {
        try {
          const query = db.query.workYears.findFirst({
            where: eq(workYearsTable.id, id),
          });

          const workYear = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return workYear;
        } catch (error) {
          captureException(error, { data: { workYearId: id } });
          throw new DatabaseOperationError("Failed to get work year", {
            cause: error,
          });
        }
      },
    );
  }

  async getWorkYearByStartAndEndDate(
    startDate: Date,
    endDate: Date,
  ): Promise<WorkYear | undefined> {
    return await startSpan(
      { name: "WorkYearsRepository > getWorkYearByStartAndEndDate" },
      async () => {
        try {
          const query = db.query.workYears.findFirst({
            where: and(
              eq(workYearsTable.startDate, startDate),
              eq(workYearsTable.endDate, endDate),
            ),
          });

          const workYear = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return workYear;
        } catch (error) {
          captureException(error, { data: { startDate, endDate } });
          throw new DatabaseOperationError("Failed to get work year", {
            cause: error,
          });
        }
      },
    );
  }

  async getAllWorkYears(): Promise<WorkYear[]> {
    return await startSpan(
      { name: "WorkYearsRepository > getAllWorkYears" },
      async () => {
        try {
          const query = db.query.workYears.findMany();

          const allWorkYears = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allWorkYears;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get all work years", {
            cause: error,
          });
        }
      },
    );
  }

  async updateWorkYear(
    id: number,
    workYear: WorkYearUpdate,
  ): Promise<WorkYear> {
    return await startSpan(
      { name: "WorkYearsRepository > updateWorkYear" },
      async () => {
        try {
          const query = db
            .update(workYearsTable)
            .set(workYear)
            .where(eq(workYearsTable.id, id))
            .returning();

          const [updatedWorkYear] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedWorkYear) {
            throw new WorkYearNotFoundError("Work year not found");
          }

          return updatedWorkYear;
        } catch (error) {
          if (error instanceof WorkYearNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation &&
            error.constraint === UNIQUE_START_END_DATE_FOR_WORK_YEAR_CONSTRAINT
          ) {
            throw new WorkYearWithThatStartAndEndDateAlreadyExistsError(
              "Work year already exists",
              {
                cause: error,
              },
            );
          }

          captureException(error, { data: { workYearId: id, workYear } });
          throw new DatabaseOperationError("Failed to update work year", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteWorkYear(id: number): Promise<void> {
    return await startSpan(
      { name: "WorkYearsRepository > deleteWorkYear" },
      async () => {
        try {
          const query = db
            .delete(workYearsTable)
            .where(eq(workYearsTable.id, id))
            .returning();

          const [deletedWorkYear] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedWorkYear) {
            throw new WorkYearNotFoundError("Work year not found");
          }
        } catch (error) {
          if (error instanceof WorkYearNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new WorkYearStillReferencedError(
              "Work year still referenced",
              {
                cause: error,
              },
            );
          }

          captureException(error, { data: { workYearId: id } });
          throw new DatabaseOperationError("Failed to delete work year", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteAllWorkYears(): Promise<void> {
    return await startSpan(
      { name: "WorkYearsRepository > deleteAllWorkYears" },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(workYearsTable).returning();

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new WorkYearStillReferencedError(
              "Work year still referenced",
              {
                cause: error,
              },
            );
          }

          captureException(error);
          throw new DatabaseOperationError("Failed to delete all work years", {
            cause: error,
          });
        }
      },
    );
  }
}
