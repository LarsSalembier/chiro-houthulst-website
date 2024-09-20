import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq } from "drizzle-orm";
import { injectable } from "inversify";
import { type IYearlyMembershipsRepository } from "~/application/repositories/yearly-memberships.repository.interface";
import {
  type YearlyMembership,
  type YearlyMembershipInsert,
} from "~/domain/entities/yearly-membership";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  MemberAlreadyHasYearlyMembershipError,
  YearlyMembershipNotFoundError,
} from "~/domain/errors/yearly-memberships";
import { MemberNotFoundError } from "~/domain/errors/members";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";
import { isDatabaseError } from "~/domain/errors/database-error";
import { db } from "~/server/db";
import { yearlyMemberships } from "~/server/db/schema";
import { type PaymentMethod } from "~/domain/enums/payment-method";
import { WorkyearNotFoundError } from "~/domain/errors/workyears";
import { GroupNotFoundError } from "~/domain/errors/groups";
import { MemberAlreadyPaidError } from "~/domain/errors/members";
import { type IGroupsRepository } from "~/application/repositories/groups.repository.interface";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";
import { type IWorkyearsRepository } from "~/application/repositories/workyears.repository.interface";

@injectable()
export class YearlyMembershipsRepository
  implements IYearlyMembershipsRepository
{
  constructor(
    private readonly membersRepository: IMembersRepository,
    private readonly workyearsRepository: IWorkyearsRepository,
    private readonly groupsRepository: IGroupsRepository,
  ) {}

  /**
   * Creates a new yearly membership for a member.
   *
   * @param yearlyMembership The yearly membership data to insert.
   * @returns The created yearly membership.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {WorkyearNotFoundError} If the workyear is not found.
   * @throws {MemberAlreadyHasYearlyMembershipError} If the member already has a yearly membership for the given work year.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createYearlyMembership(
    yearlyMembership: YearlyMembershipInsert,
  ): Promise<YearlyMembership> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > createYearlyMembership" },
      async () => {
        try {
          const memberExists = await this.membersRepository.getMember(
            yearlyMembership.memberId,
          );

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const workYearExists = await this.workyearsRepository.getWorkyear(
            yearlyMembership.workYearId,
          );

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Workyear not found");
          }

          const query = db
            .insert(yearlyMemberships)
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
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new MemberAlreadyHasYearlyMembershipError(
              "Member already has a yearly membership for the given work year",
              { cause: error },
            );
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

  /**
   * Gets the yearly membership for a specific member and work year.
   *
   * @param memberId The ID of the member.
   * @param workYearId The ID of the work year.
   * @returns The yearly membership if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getYearlyMembership(
    memberId: number,
    workYearId: number,
  ): Promise<YearlyMembership | undefined> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > getYearlyMembership" },
      async () => {
        try {
          const query = db.query.yearlyMemberships.findFirst({
            where: and(
              eq(yearlyMemberships.memberId, memberId),
              eq(yearlyMemberships.workYearId, workYearId),
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

  /**
   * Updates the yearly membership for a specific member and work year.
   *
   * @param memberId The ID of the member.
   * @param workYearId The ID of the work year.
   * @param yearlyMembership The updated yearly membership data.
   * @returns The updated yearly membership.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {WorkyearNotFoundError} If the workyear is not found.
   * @throws {YearlyMembershipNotFoundError} If the yearly membership is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateYearlyMembership(
    memberId: number,
    workYearId: number,
    yearlyMembership: Partial<YearlyMembershipInsert>,
  ): Promise<YearlyMembership> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > updateYearlyMembership" },
      async () => {
        try {
          const memberExists = await this.membersRepository.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Workyear not found");
          }

          const query = db
            .update(yearlyMemberships)
            .set(yearlyMembership)
            .where(
              and(
                eq(yearlyMemberships.memberId, memberId),
                eq(yearlyMemberships.workYearId, workYearId),
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
          if (error instanceof NotFoundError) {
            throw error;
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

  /**
   * Deletes the yearly membership for a specific member and work year.
   *
   * @param memberId The ID of the member.
   * @param workYearId The ID of the work year.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {WorkyearNotFoundError} If the workyear is not found.
   * @throws {YearlyMembershipNotFoundError} If the yearly membership is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteYearlyMembership(
    memberId: number,
    workYearId: number,
  ): Promise<void> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > deleteYearlyMembership" },
      async () => {
        try {
          const memberExists = await this.membersRepository.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Workyear not found");
          }

          const query = db
            .delete(yearlyMemberships)
            .where(
              and(
                eq(yearlyMemberships.memberId, memberId),
                eq(yearlyMemberships.workYearId, workYearId),
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
          if (error instanceof NotFoundError) {
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

  /**
   * Gets all paid yearly memberships for a specific group and work year.
   *
   * @param groupId The ID of the group.
   * @param workYearId The ID of the work year.
   * @returns An array of paid yearly memberships.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {WorkyearNotFoundError} If the workyear is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getPaidYearlyMembershipsByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<YearlyMembership[]> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > getPaidYearlyMembershipsByGroup" },
      async () => {
        try {
          const groupExists = await this.groupsRepository.getGroup(groupId);

          if (!groupExists) {
            throw new GroupNotFoundError("Group not found");
          }

          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Workyear not found");
          }

          const query = db.query.yearlyMemberships.findMany({
            where: and(
              eq(yearlyMemberships.groupId, groupExists.id),
              eq(yearlyMemberships.workYearId, workYearId),
              eq(yearlyMemberships.paymentReceived, true),
            ),
          });

          const yearlyMemberships_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return yearlyMemberships_;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { groupId, workYearId } });
          throw new DatabaseOperationError(
            "Failed to get paid yearly memberships by group",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets all unpaid yearly memberships for a specific group and work year.
   *
   * @param groupId The ID of the group.
   * @param workYearId The ID of the work year.
   * @returns An array of unpaid yearly memberships.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {WorkyearNotFoundError} If the workyear is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getUnpaidYearlyMembershipsByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<YearlyMembership[]> {
    return await startSpan(
      {
        name: "YearlyMembershipsRepository > getUnpaidYearlyMembershipsByGroup",
      },
      async () => {
        try {
          const groupExists = await this.groupsRepository.getGroup(groupId);

          if (!groupExists) {
            throw new GroupNotFoundError("Group not found");
          }

          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Workyear not found");
          }

          const query = db.query.yearlyMemberships.findMany({
            where: and(
              eq(yearlyMemberships.groupId, groupExists.id),
              eq(yearlyMemberships.workYearId, workYearId),
              eq(yearlyMemberships.paymentReceived, false),
            ),
          });

          const yearlyMemberships_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return yearlyMemberships_;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { groupId, workYearId } });
          throw new DatabaseOperationError(
            "Failed to get unpaid yearly memberships by group",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Marks a yearly membership as paid.
   *
   * @param memberId The ID of the member.
   * @param workYearId The ID of the work year.
   * @param paymentMethod The payment method.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {WorkyearNotFoundError} If the workyear is not found.
   * @throws {YearlyMembershipNotFoundError} If the yearly membership is not found.
   * @throws {MemberAlreadyPaidError} If the member has already paid for the yearly membership.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async markYearlyMembershipAsPaid(
    memberId: number,
    workYearId: number,
    paymentMethod: PaymentMethod,
  ): Promise<void> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > markYearlyMembershipAsPaid" },
      async () => {
        try {
          const memberExists = await this.membersRepository.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Workyear not found");
          }

          const yearlyMembership = await this.getYearlyMembership(
            memberId,
            workYearId,
          );

          if (!yearlyMembership) {
            throw new YearlyMembershipNotFoundError(
              "Yearly membership not found",
            );
          }

          if (yearlyMembership.paymentReceived) {
            throw new MemberAlreadyPaidError(
              "Member already paid for this work year",
            );
          }

          const query = db
            .update(yearlyMemberships)
            .set({
              paymentReceived: true,
              paymentMethod: paymentMethod,
              paymentDate: new Date(),
            })
            .where(
              and(
                eq(yearlyMemberships.memberId, memberId),
                eq(yearlyMemberships.workYearId, workYearId),
              ),
            );

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
            error instanceof NotFoundError ||
            error instanceof MemberAlreadyPaidError
          ) {
            throw error;
          }

          captureException(error, {
            data: { memberId, workYearId, paymentMethod },
          });
          throw new DatabaseOperationError(
            "Failed to mark yearly membership as paid",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets all yearly memberships for a specific member.
   *
   * @param memberId The ID of the member.
   * @returns An array of yearly memberships.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getYearlyMembershipsForMember(
    memberId: number,
  ): Promise<YearlyMembership[]> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > getYearlyMembershipsForMember" },
      async () => {
        try {
          const memberExists = await this.membersRepository.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const query = db.query.yearlyMemberships.findMany({
            where: eq(yearlyMemberships.memberId, memberId),
          });

          const yearlyMemberships_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return yearlyMemberships_;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError(
            "Failed to get yearly memberships for member",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets all yearly memberships for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of yearly memberships.
   * @throws {WorkyearNotFoundError} If the workyear is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getYearlyMembershipsForWorkYear(
    workYearId: number,
  ): Promise<YearlyMembership[]> {
    return await startSpan(
      { name: "YearlyMembershipsRepository > getYearlyMembershipsForWorkYear" },
      async () => {
        try {
          const workYearExists =
            await this.workyearsRepository.getWorkyear(workYearId);

          if (!workYearExists) {
            throw new WorkyearNotFoundError("Workyear not found");
          }

          const query = db.query.yearlyMemberships.findMany({
            where: eq(yearlyMemberships.workYearId, workYearId),
          });

          const yearlyMemberships_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return yearlyMemberships_;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { workYearId } });
          throw new DatabaseOperationError(
            "Failed to get yearly memberships for work year",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
