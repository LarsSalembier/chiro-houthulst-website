import { type SponsorUpdate, type Sponsor } from "~/domain/entities/sponsor";

export interface ISponsorsRepository {
  /**
   * Creates a new sponsor.
   *
   * @param sponsor The sponsor data to insert.
   * @returns The created sponsor.
   * @throws {SponsorAlreadyExistsError} If a sponsor with the same company name already exists.
   * @throws {AddressNotFoundError} If the address ID is provided and the address is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createSponsor(sponsor: Sponsor): Promise<Sponsor>;

  /**
   * Returns a sponsor by id, or undefined if not found.
   *
   * @param id The sponsor id.
   * @returns The sponsor, or undefined if not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getSponsor(id: number): Promise<Sponsor | undefined>;

  /**
   * Returns a sponsor by company name, or undefined if not found.
   *
   * @param companyName The sponsor company name.
   * @returns The sponsor, or undefined if not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getSponsorByCompanyName(companyName: string): Promise<Sponsor | undefined>;

  /**
   * Gets all sponsors.
   *
   * @returns All sponsors.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getSponsors(): Promise<Sponsor[]>;

  /**
   * Updates a sponsor.
   *
   * @param id The ID of the sponsor to update.
   * @param sponsor The sponsor data to update.
   * @returns The updated sponsor.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   * @throws {AddressNotFoundError} If a new address ID is provided and the address is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  updateSponsor(id: number, sponsor: SponsorUpdate): Promise<Sponsor>;

  /**
   * Deletes a sponsor.
   *
   * @param id The ID of the sponsor to delete.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   * @throws {SponsorStillReferencedError} If the sponsor is still referenced by sponsorship agreements.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteSponsor(id: number): Promise<void>;
}
