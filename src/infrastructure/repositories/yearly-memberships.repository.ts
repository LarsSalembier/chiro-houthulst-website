import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq } from "drizzle-orm";
import { injectable } from "inversify";
import { IYearlyMembershipsRepository } from "~/application/repositories/yearly-memberships.repository.interface";
import {
  YearlyMembership,
  YearlyMembershipInsert,
  YearlyMembershipUpdate,
} from "~/domain/entities/yearly-membership";
import { db } from "drizzle";
import { yearlyMemberships as yearlyMembershipsTable } from "drizzle/schema";
import { DatabaseOperationError } from "~/domain/errors/common";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  MemberAlreadyHasYearlyMembershipError,
  YearlyMembershipNotFoundError,
} from "~/domain/errors/yearly-memberships";
import { MemberNotFoundError } from "~/domain/errors/members";
import { WorkYearNotFoundError } from "~/domain/errors/work-years";
import { GroupNotFoundError } from "~/domain/errors/groups";

@injectable()
export class YearlyMembershipsRepository
  implements IYearlyMembershipsRepository
{
  async createYearlyMembership(
    yearlyMembership: YearlyMembershipInsert,
  ): Promise<YearlyMembership> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > createYearlyMembership" },
      async () => {
        try {
          const query = db
            .insert(yearlyMembershipsTable)
            .values(yearlyMembership)
            .returning();

          const [createdYearlyMembership] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdYearlyMembership) {
            throw new DatabaseOperationError(
              "Failed to create yearly membership",
            );
          }

          return createdYearlyMembership;
        } catch (error) {
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (isDatabaseError(error)) {
            if (error.code === PostgresErrorCode.UniqueViolation) {
              throw new MemberAlreadyHasYearlyMembershipError(
                "Member already has a yearly membership for this work year",
                {
                  cause: error,
                },
              );
            }

            if (error.code === PostgresErrorCode.ForeignKeyViolation) {
              if (error.column === "member_id") {
                throw new MemberNotFoundError("Member not found", {
                  cause: error,
                });
              }

              if (error.column === "work_year_id") {
                throw new WorkYearNotFoundError("Work year not found", {
                  cause: error,
                });
              }

              if (error.column === "group_id") {
                throw new GroupNotFoundError("Group not found", {
                  cause: error,
                });
              }
            }
          }

          captureException(error, { data: yearlyMembership });
          throw new DatabaseOperationError(
            "Failed to create yearly membership",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  async getYearlyMembershipByIds(
    memberId: number,
    workYearId: number,
  ): Promise<YearlyMembership | undefined> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > getYearlyMembershipByIds" },
      async () => {
        try {
          const query = db.query.yearlyMemberships.findFirst({
            where: and(
              eq(yearlyMembershipsTable.memberId, memberId),
              eq(yearlyMembershipsTable.workYearId, workYearId),
            ),
          });

          const yearlyMembership = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return yearlyMembership;
        } catch (error) {
          captureException(error, { data: { memberId, workYearId } });
          throw new DatabaseOperationError("Failed to get yearly membership", {
            cause: error,
          });
        }
      },
    );
  }

  async getAllYearlyMemberships(): Promise<YearlyMembership[]> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > getAllYearlyMemberships" },
      async () => {
        try {
          const query = db.query.yearlyMemberships.findMany();

          const allYearlyMemberships = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allYearlyMemberships;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError(
            "Failed to get all yearly memberships",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  async updateYearlyMembership(
    memberId: number,
    workYearId: number,
    yearlyMembership: YearlyMembershipUpdate,
  ): Promise<YearlyMembership> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > updateYearlyMembership" },
      async () => {
        try {
          const query = db
            .update(yearlyMembershipsTable)
            .set(yearlyMembership)
            .where(
              and(
                eq(yearlyMembershipsTable.memberId, memberId),
                eq(yearlyMembershipsTable.workYearId, workYearId),
              ),
            )
            .returning();

          const [updatedYearlyMembership] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedYearlyMembership) {
            throw new YearlyMembershipNotFoundError(
              "Yearly membership not found",
            );
          }

          return updatedYearlyMembership;
        } catch (error) {
          if (error instanceof YearlyMembershipNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation &&
            error.table === "group_id"
          ) {
            throw new GroupNotFoundError("Group not found", {
              cause: error,
            });
          }

          captureException(error, {
            data: { memberId, workYearId, yearlyMembership },
          });
          throw new DatabaseOperationError(
            "Failed to update yearly membership",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  async deleteYearlyMembership(
    memberId: number,
    workYearId: number,
  ): Promise<void> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > deleteYearlyMembership" },
      async () => {
        try {
          const query = db
            .delete(yearlyMembershipsTable)
            .where(
              and(
                eq(yearlyMembershipsTable.memberId, memberId),
                eq(yearlyMembershipsTable.workYearId, workYearId),
              ),
            )
            .returning();

          const [deletedYearlyMembership] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedYearlyMembership) {
            throw new YearlyMembershipNotFoundError(
              "Yearly membership not found",
            );
          }
        } catch (error) {
          if (error instanceof YearlyMembershipNotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId, workYearId } });
          throw new DatabaseOperationError(
            "Failed to delete yearly membership",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  async deleteAllYearlyMemberships(): Promise<void> {
    return await startSpan(
      {
        name: "YearlyMembershipsRepository > deleteAllYearlyMemberships",
      },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(yearlyMembershipsTable).returning();

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError(
            "Failed to delete all yearly memberships",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
