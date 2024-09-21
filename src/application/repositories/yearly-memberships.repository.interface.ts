import { type PaymentMethod } from "~/domain/enums/payment-method";
import {
  type YearlyMembershipUpdate,
  type YearlyMembership,
  type YearlyMembershipInsert,
} from "~/domain/entities/yearly-membership";

export interface IYearlyMembershipsRepository {
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
  createYearlyMembership(
    yearlyMembership: YearlyMembershipInsert,
  ): Promise<YearlyMembership>;

  /**
   * Gets the yearly membership for a specific member and work year.
   *
   * @param memberId The ID of the member.
   * @param workYearId The ID of the work year.
   * @returns The yearly membership if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getYearlyMembership(
    memberId: number,
    workYearId: number,
  ): Promise<YearlyMembership | undefined>;

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
  updateYearlyMembership(
    memberId: number,
    workYearId: number,
    yearlyMembership: YearlyMembershipUpdate,
  ): Promise<YearlyMembership>;

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
  deleteYearlyMembership(memberId: number, workYearId: number): Promise<void>;

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
  getPaidYearlyMembershipsByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<YearlyMembership[]>;

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
  getUnpaidYearlyMembershipsByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<YearlyMembership[]>;

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
  markYearlyMembershipAsPaid(
    memberId: number,
    workYearId: number,
    paymentMethod: PaymentMethod,
  ): Promise<void>;

  /**
   * Gets all yearly memberships for a specific member.
   *
   * @param memberId The ID of the member.
   * @returns An array of yearly memberships.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getYearlyMembershipsForMember(memberId: number): Promise<YearlyMembership[]>;

  /**
   * Gets all yearly memberships for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of yearly memberships.
   * @throws {WorkyearNotFoundError} If the workyear is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getYearlyMembershipsForWorkYear(
    workYearId: number,
  ): Promise<YearlyMembership[]>;
}
