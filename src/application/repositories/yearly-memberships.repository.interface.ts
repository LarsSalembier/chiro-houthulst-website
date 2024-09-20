import { type PaymentMethod } from "~/domain/enums/payment-method";
import {
  type YearlyMembership,
  type YearlyMembershipInsert,
} from "~/domain/entities/yearly-membership";

export interface IYearlyMembershipsRepository {
  createYearlyMembership(
    yearlyMembership: YearlyMembershipInsert,
  ): Promise<YearlyMembership>;
  getYearlyMembership(
    memberId: number,
    workYearId: number,
  ): Promise<YearlyMembership | undefined>;
  updateYearlyMembership(
    memberId: number,
    workYearId: number,
    yearlyMembership: Partial<YearlyMembershipInsert>,
  ): Promise<YearlyMembership>;
  deleteYearlyMembership(memberId: number, workYearId: number): Promise<void>;
  getPaidYearlyMembershipsByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<YearlyMembership[]>;
  getUnpaidYearlyMembershipsByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<YearlyMembership[]>;
  markYearlyMembershipAsPaid(
    memberId: number,
    workYearId: number,
    paymentMethod: PaymentMethod,
  ): Promise<void>;
  getYearlyMembershipsForMember(memberId: number): Promise<YearlyMembership[]>;
  getYearlyMembershipsForWorkYear(
    workYearId: number,
  ): Promise<YearlyMembership[]>;
}
