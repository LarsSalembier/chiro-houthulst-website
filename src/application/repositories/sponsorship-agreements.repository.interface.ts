import {
  type SponsorshipAgreementUpdate,
  type SponsorshipAgreement,
  type SponsorshipAgreementInsert,
} from "~/domain/entities/sponsorship-agreement";

export interface ISponsorshipAgreementsRepository {
  /**
   * Creates a new sponsorship agreement.
   *
   * @param sponsorshipAgreement The sponsorship agreement data to insert.
   * @returns The created sponsorship agreement.
   * @throws {SponsorshipAgreementAlreadyExistsError} If the agreement already exists.
   * @throws {SponsorNotFoundError} If the sponsor does not exist.
   * @throws {WorkyearNotFoundError} If the work year does not exist.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createSponsorshipAgreement(
    sponsorshipAgreement: SponsorshipAgreementInsert,
  ): Promise<SponsorshipAgreement>;

  /**
   * Gets a sponsorship agreement by sponsor ID and work year ID.
   *
   * @param sponsorId The ID of the sponsor.
   * @param workYearId The ID of the work year.
   * @returns The sponsorship agreement if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<SponsorshipAgreement | undefined>;

  /**
   * Gets all sponsorship agreements.
   *
   * @returns An array of sponsorship agreements.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getSponsorshipAgreements(): Promise<SponsorshipAgreement[]>;

  /**
   * Gets sponsorship agreements for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of sponsorship agreements.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]>;

  /**
   * Gets sponsorship agreements for a specific sponsor.
   *
   * @param sponsorId The ID of the sponsor.
   * @returns An array of sponsorship agreements.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getSponsorshipAgreementsForSponsor(
    sponsorId: number,
  ): Promise<SponsorshipAgreement[]>;

  /**
   * Updates a sponsorship agreement.
   *
   * @param sponsorId The ID of the sponsor.
   * @param workYearId The ID of the work year.
   * @param input The data to update.
   * @returns The updated sponsorship agreement.
   * @throws {SponsorshipAgreementNotFoundError} If the agreement is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  updateSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
    input: SponsorshipAgreementUpdate,
  ): Promise<SponsorshipAgreement>;

  /**
   * Deletes a sponsorship agreement.
   *
   * @param sponsorId The ID of the sponsor.
   * @param workYearId The ID of the work year.
   * @throws {SponsorshipAgreementNotFoundError} If the agreement is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<void>;

  /**
   * Gets unpaid sponsorship agreements for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of unpaid sponsorship agreements.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getUnpaidSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]>;
  getPaidSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]>;
}
