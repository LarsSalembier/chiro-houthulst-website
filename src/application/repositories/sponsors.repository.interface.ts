import {
  type Sponsor,
  type SponsorInsert,
  type SponsorUpdate,
} from "~/domain/entities/sponsor";

/**
 * Repository interface for accessing and managing sponsors.
 */
export interface ISponsorsRepository {
  /**
   * Creates a new sponsor.
   *
   * @param sponsor - The sponsor data to insert.
   * @returns The created sponsor.
   *
   * @throws {SponsorWithThatCompanyNameAlreadyExistsError} If a sponsor with the same company name already exists.
   * @throws {AddressNotFoundError} If the address associated with the sponsor is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createSponsor(sponsor: SponsorInsert): Promise<Sponsor>;

  /**
   * Retrieves a sponsor by their unique identifier.
   *
   * @param id - The ID of the sponsor to retrieve.
   * @returns The sponsor matching the given ID, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getSponsorById(id: number): Promise<Sponsor | undefined>;

  /**
   * Retrieves a sponsor by their unique company name.
   *
   * @param companyName - The company name of the sponsor.
   * @returns The sponsor matching the given company name, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getSponsorByCompanyName(companyName: string): Promise<Sponsor | undefined>;

  /**
   * Retrieves all sponsors.
   *
   * @returns A list of all sponsors.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllSponsors(): Promise<Sponsor[]>;

  /**
   * Updates an existing sponsor.
   *
   * @param id - The ID of the sponsor to update.
   * @param sponsor - The sponsor data to apply as updates.
   * @returns The updated sponsor.
   *
   * @throws {SponsorNotFoundError} If no sponsor with the given ID exists.
   * @throws {SponsorWithThatCompanyNameAlreadyExistsError} If a sponsor with the same company name already exists.
   * @throws {AddressNotFoundError} If the address associated with the sponsor is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateSponsor(id: number, sponsor: SponsorUpdate): Promise<Sponsor>;

  /**
   * Deletes a sponsor by their unique identifier.
   *
   * @param id - The ID of the sponsor to delete.
   *
   * @throws {SponsorNotFoundError} If no sponsor with the given ID exists.
   * @throws {SponsorStillReferencedError} If the sponsor is still referenced by other entities (e.g., sponsorship_agreements table) and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteSponsor(id: number): Promise<void>;

  /**
   * Deletes all sponsors.
   *
   * @throws {SponsorStillReferencedError} If any sponsor is still referenced by other entities (e.g., sponsorship_agreements table) and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteAllSponsors(): Promise<void>;
}
