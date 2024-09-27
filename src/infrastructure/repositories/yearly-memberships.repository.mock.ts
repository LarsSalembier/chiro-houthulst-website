import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IYearlyMembershipsRepository } from "~/application/repositories/yearly-memberships.repository.interface";
import {
  YearlyMembership,
  YearlyMembershipInsert,
  YearlyMembershipUpdate,
} from "~/domain/entities/yearly-membership";
import {
  MemberAlreadyHasYearlyMembershipError,
  YearlyMembershipNotFoundError,
} from "~/domain/errors/yearly-memberships";
import { MemberNotFoundError } from "~/domain/errors/members";
import { WorkYearNotFoundError } from "~/domain/errors/work-years";
import { GroupNotFoundError } from "~/domain/errors/groups";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockYearlyMembershipsRepository
  implements IYearlyMembershipsRepository
{
  private yearlyMemberships: YearlyMembership[] = mockData.yearlyMemberships;

  async createYearlyMembership(
    yearlyMembership: YearlyMembershipInsert,
  ): Promise<YearlyMembership> {
    return startSpan(
      {
        name: "MockYearlyMembershipsRepository > createYearlyMembership",
      },
      () => {
        const member = mockData.members.find(
          (m) => m.id === yearlyMembership.memberId,
        );
        if (!member) {
          throw new MemberNotFoundError("Member not found");
        }

        const workYear = mockData.workYears.find(
          (wy) => wy.id === yearlyMembership.workYearId,
        );
        if (!workYear) {
          throw new WorkYearNotFoundError("Work year not found");
        }

        const group = mockData.groups.find(
          (g) => g.id === yearlyMembership.groupId,
        );
        if (!group) {
          throw new GroupNotFoundError("Group not found");
        }

        const existingYearlyMembership = this.yearlyMemberships.find(
          (ym) =>
            ym.memberId === yearlyMembership.memberId &&
            ym.workYearId === yearlyMembership.workYearId,
        );

        if (existingYearlyMembership) {
          throw new MemberAlreadyHasYearlyMembershipError(
            "Member already has a yearly membership for this work year",
          );
        }

        this.yearlyMemberships.push(yearlyMembership);
        return yearlyMembership;
      },
    );
  }

  async getYearlyMembershipByIds(
    memberId: number,
    workYearId: number,
  ): Promise<YearlyMembership | undefined> {
    return startSpan(
      {
        name: "MockYearlyMembershipsRepository > getYearlyMembershipByIds",
      },
      () => {
        const yearlyMembership = this.yearlyMemberships.find(
          (ym) => ym.memberId === memberId && ym.workYearId === workYearId,
        );
        return yearlyMembership;
      },
    );
  }

  async getAllYearlyMemberships(): Promise<YearlyMembership[]> {
    return startSpan(
      {
        name: "MockYearlyMembershipsRepository > getAllYearlyMemberships",
      },
      () => {
        return this.yearlyMemberships;
      },
    );
  }

  async updateYearlyMembership(
    memberId: number,
    workYearId: number,
    yearlyMembership: YearlyMembershipUpdate,
  ): Promise<YearlyMembership> {
    return startSpan(
      {
        name: "MockYearlyMembershipsRepository > updateYearlyMembership",
      },
      () => {
        const yearlyMembershipIndex = this.yearlyMemberships.findIndex(
          (ym) => ym.memberId === memberId && ym.workYearId === workYearId,
        );
        if (yearlyMembershipIndex === -1) {
          throw new YearlyMembershipNotFoundError(
            "Yearly membership not found",
          );
        }

        if (yearlyMembership.groupId) {
          const groupExists = mockData.groups.some(
            (g) => g.id === yearlyMembership.groupId,
          );
          if (!groupExists) {
            throw new GroupNotFoundError("Group not found");
          }
        }

        this.yearlyMemberships[yearlyMembershipIndex] = {
          ...this.yearlyMemberships[yearlyMembershipIndex]!,
          ...yearlyMembership,
        };
        return this.yearlyMemberships[yearlyMembershipIndex];
      },
    );
  }

  async deleteYearlyMembership(
    memberId: number,
    workYearId: number,
  ): Promise<void> {
    return startSpan(
      {
        name: "MockYearlyMembershipsRepository > deleteYearlyMembership",
      },
      () => {
        const yearlyMembershipIndex = this.yearlyMemberships.findIndex(
          (ym) => ym.memberId === memberId && ym.workYearId === workYearId,
        );
        if (yearlyMembershipIndex === -1) {
          throw new YearlyMembershipNotFoundError(
            "Yearly membership not found",
          );
        }

        this.yearlyMemberships.splice(yearlyMembershipIndex, 1);
      },
    );
  }

  async deleteAllYearlyMemberships(): Promise<void> {
    return startSpan(
      {
        name: "MockYearlyMembershipsRepository > deleteAllYearlyMemberships",
      },
      () => {
        this.yearlyMemberships = [];
      },
    );
  }
}
