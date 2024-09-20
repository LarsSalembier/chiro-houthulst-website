import { injectable } from "inversify";
import { type IYearlyMembershipsRepository } from "~/application/repositories/yearly-memberships.repository.interface";
import {
  type YearlyMembership,
  type YearlyMembershipInsert,
} from "~/domain/entities/yearly-membership";
import {
  MemberAlreadyHasYearlyMembershipError,
  YearlyMembershipNotFoundError,
} from "~/domain/errors/yearly-memberships";
import { MemberAlreadyPaidError } from "~/domain/errors/members";
import { type PaymentMethod } from "~/domain/enums/payment-method";

@injectable()
export class MockYearlyMembershipsRepository
  implements IYearlyMembershipsRepository
{
  private _yearlyMemberships: YearlyMembership[] = [];

  async createYearlyMembership(
    yearlyMembership: YearlyMembershipInsert,
  ): Promise<YearlyMembership> {
    const existingYearlyMembership = this._yearlyMemberships.find(
      (ym) =>
        ym.memberId === yearlyMembership.memberId &&
        ym.workYearId === yearlyMembership.workYearId,
    );

    if (existingYearlyMembership) {
      throw new MemberAlreadyHasYearlyMembershipError(
        "Member already has a yearly membership for the given work year",
      );
    }

    const newYearlyMembership: YearlyMembership = {
      ...yearlyMembership,
      paymentReceived: false,
      paymentMethod: null,
      paymentDate: null,
    };

    this._yearlyMemberships.push(newYearlyMembership);
    return newYearlyMembership;
  }

  async getYearlyMembership(
    memberId: number,
    workYearId: number,
  ): Promise<YearlyMembership | undefined> {
    return this._yearlyMemberships.find(
      (ym) => ym.memberId === memberId && ym.workYearId === workYearId,
    );
  }

  async updateYearlyMembership(
    memberId: number,
    workYearId: number,
    yearlyMembership: Partial<YearlyMembershipInsert>,
  ): Promise<YearlyMembership> {
    const index = this._yearlyMemberships.findIndex(
      (ym) => ym.memberId === memberId && ym.workYearId === workYearId,
    );

    if (index === -1) {
      throw new YearlyMembershipNotFoundError("Yearly membership not found");
    }

    this._yearlyMemberships[index] = {
      ...this._yearlyMemberships[index]!,
      ...yearlyMembership,
    };

    return this._yearlyMemberships[index];
  }

  async deleteYearlyMembership(
    memberId: number,
    workYearId: number,
  ): Promise<void> {
    const index = this._yearlyMemberships.findIndex(
      (ym) => ym.memberId === memberId && ym.workYearId === workYearId,
    );

    if (index === -1) {
      throw new YearlyMembershipNotFoundError("Yearly membership not found");
    }

    this._yearlyMemberships.splice(index, 1);
  }

  async getPaidYearlyMembershipsByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<YearlyMembership[]> {
    return this._yearlyMemberships.filter(
      (ym) =>
        ym.groupId === groupId &&
        ym.workYearId === workYearId &&
        ym.paymentReceived,
    );
  }

  async getUnpaidYearlyMembershipsByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<YearlyMembership[]> {
    return this._yearlyMemberships.filter(
      (ym) =>
        ym.groupId === groupId &&
        ym.workYearId === workYearId &&
        !ym.paymentReceived,
    );
  }

  async markYearlyMembershipAsPaid(
    memberId: number,
    workYearId: number,
    paymentMethod: PaymentMethod,
  ): Promise<void> {
    const yearlyMembership = await this.getYearlyMembership(
      memberId,
      workYearId,
    );

    if (!yearlyMembership) {
      throw new YearlyMembershipNotFoundError("Yearly membership not found");
    }

    if (yearlyMembership.paymentReceived) {
      throw new MemberAlreadyPaidError(
        "Member already paid for this work year",
      );
    }

    yearlyMembership.paymentReceived = true;
    yearlyMembership.paymentMethod = paymentMethod;
    yearlyMembership.paymentDate = new Date();
  }

  async getYearlyMembershipsForMember(
    memberId: number,
  ): Promise<YearlyMembership[]> {
    return this._yearlyMemberships.filter((ym) => ym.memberId === memberId);
  }

  async getYearlyMembershipsForWorkYear(
    workYearId: number,
  ): Promise<YearlyMembership[]> {
    return this._yearlyMemberships.filter((ym) => ym.workYearId === workYearId);
  }
}
