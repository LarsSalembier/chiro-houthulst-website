import {
  type YearlyMembership,
  type YearlyMembershipInsert,
  type YearlyMembershipUpdate,
} from "~/domain/entities/yearly-membership";

/**
 * Repository interface for accessing and managing yearly memberships.
 */
export interface IYearlyMembershipsRepository {
  /**
   * Creates a new yearly membership.
   *
   * @param yearlyMembership - The yearly membership data to insert.
   * @returns The created yearly membership.
   *
   * @throws {MemberAlreadyHasYearlyMembershipError} If the member already has a yearly membership for the given work year.
   * @throws {MemberNotFoundError} If the member associated with the yearly membership is not found.
   * @throws {WorkYearNotFoundError} If the work year associated with the yearly membership is not found.
   * @throws {GroupNotFoundError} If the group associated with the yearly membership is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createYearlyMembership(
    yearlyMembership: YearlyMembershipInsert,
  ): Promise<YearlyMembership>;

  /**
   * Retrieves a yearly membership by the member's ID and the work year's ID.
   *
   * @param memberId - The ID of the member.
   * @param workYearId - The ID of the work year.
   * @returns The yearly membership, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getYearlyMembershipByIds(
    memberId: number,
    workYearId: number,
  ): Promise<YearlyMembership | undefined>;

  /**
   * Retrieves all yearly memberships.
   *
   * @returns A list of all yearly memberships.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllYearlyMemberships(): Promise<YearlyMembership[]>;

  /**
   * Updates an existing yearly membership.
   *
   * @param memberId - The ID of the member.
   * @param workYearId - The ID of the work year.
   * @param yearlyMembership - The yearly membership data to apply as updates.
   * @returns The updated yearly membership.
   *
   * @throws {YearlyMembershipNotFoundError} If the yearly membership is not found.
   * @throws {GroupNotFoundError} If the group associated with the yearly membership is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateYearlyMembership(
    memberId: number,
    workYearId: number,
    yearlyMembership: YearlyMembershipUpdate,
  ): Promise<YearlyMembership>;

  /**
   * Deletes a yearly membership.
   *
   * @param memberId - The ID of the member.
   * @param workYearId - The ID of the work year.
   *
   * @throws {YearlyMembershipNotFoundError} If the yearly membership is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteYearlyMembership(memberId: number, workYearId: number): Promise<void>;

  /**
   * Deletes all yearly memberships.
   *
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteAllYearlyMemberships(): Promise<void>;
}
