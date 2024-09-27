import {
  type SponsorshipAgreement,
  type SponsorshipAgreementInsert,
  type SponsorshipAgreementUpdate,
} from "~/domain/entities/sponsorship-agreement";

/**
 * Repository interface for accessing and managing sponsorship agreements.
 */
export interface ISponsorshipAgreementsRepository {
  /**
   * Creates a new sponsorship agreement.
   *
   * @param sponsorshipAgreement - The sponsorship agreement data to insert.
   * @returns The created sponsorship agreement.
   *
   * @throws {SponsorAlreadyHasSponsorshipAgreementForWorkYearError} If the sponsor already has a sponsorship agreement for this work year.
   * @throws {SponsorNotFoundError} If the sponsor associated with the sponsorship agreement is not found.
   * @throws {WorkYearNotFoundError} If the work year associated with the sponsorship agreement is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createSponsorshipAgreement(
    sponsorshipAgreement: SponsorshipAgreementInsert,
  ): Promise<SponsorshipAgreement>;

  /**
   * Retrieves a sponsorship agreement by the sponsor's ID and the work year's ID.
   *
   * @param sponsorId - The ID of the sponsor.
   * @param workYearId - The ID of the work year.
   * @returns The sponsorship agreement, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getSponsorshipAgreementByIds(
    sponsorId: number,
    workYearId: number,
  ): Promise<SponsorshipAgreement | undefined>;

  /**
   * Retrieves all sponsorship agreements.
   *
   * @returns A list of all sponsorship agreements.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllSponsorshipAgreements(): Promise<SponsorshipAgreement[]>;

  /**
   * Updates an existing sponsorship agreement.
   *
   * @param sponsorId - The ID of the sponsor.
   * @param workYearId - The ID of the work year.
   * @param sponsorshipAgreement - The sponsorship agreement data to apply as updates.
   * @returns The updated sponsorship agreement.
   *
   * @throws {SponsorshipAgreementNotFoundError} If the sponsorship agreement is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
    sponsorshipAgreement: SponsorshipAgreementUpdate,
  ): Promise<SponsorshipAgreement>;

  /**
   * Deletes a sponsorship agreement.
   *
   * @param sponsorId - The ID of the sponsor.
   * @param workYearId - The ID of the work year.
   *
   * @throws {SponsorshipAgreementNotFoundError} If the sponsorship agreement is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<void>;

  /**
   * Deletes all sponsorship agreements.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  deleteAllSponsorshipAgreements(): Promise<void>;
}
