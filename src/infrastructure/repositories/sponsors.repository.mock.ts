import { injectable } from "inversify";
import { type ISponsorsRepository } from "~/application/repositories/sponsors.repository.interface";
import {
  type Sponsor,
  type SponsorInsert,
  type SponsorUpdate,
} from "~/domain/entities/sponsor";
import {
  SponsorAlreadyExistsError,
  SponsorNotFoundError,
  SponsorStillReferencedError,
} from "~/domain/errors/sponsors";
import { AddressNotFoundError } from "~/domain/errors/addresses";
import { type IAddressesRepository } from "~/application/repositories/addresses.repository.interface";

@injectable()
export class MockSponsorsRepository implements ISponsorsRepository {
  private _sponsors = new Map<number, Sponsor>();
  private _nextSponsorId = 1;
  private _sponsorReferences = new Map<number, number>(); // sponsorId -> reference count

  constructor(private readonly addressRepository: IAddressesRepository) {}

  /**
   * Creates a new sponsor.
   *
   * @param sponsor The sponsor data to insert.
   * @returns The created sponsor.
   * @throws {SponsorAlreadyExistsError} If a sponsor with the same company name already exists.
   * @throws {AddressNotFoundError} If the address ID is provided and the address is not found.
   */
  async createSponsor(sponsor: SponsorInsert): Promise<Sponsor> {
    if (sponsor.addressId) {
      const address = await this.addressRepository.getAddressById(
        sponsor.addressId,
      );
      if (!address) {
        throw new AddressNotFoundError("Address not found");
      }
    }

    // Check for existing sponsor with the same company name
    for (const existingSponsor of this._sponsors.values()) {
      if (existingSponsor.companyName === sponsor.companyName) {
        throw new SponsorAlreadyExistsError(
          `Sponsor with company name ${sponsor.companyName} already exists`,
        );
      }
    }

    const newSponsor = {
      ...sponsor,
      id: this._nextSponsorId++,
    };
    this._sponsors.set(newSponsor.id, newSponsor);
    this._sponsorReferences.set(newSponsor.id, 0); // Initialize reference count
    return newSponsor;
  }

  /**
   * Gets a sponsor by ID.
   *
   * @param id The ID of the sponsor.
   * @returns The sponsor if found, undefined otherwise.
   */
  async getSponsor(id: number): Promise<Sponsor | undefined> {
    return this._sponsors.get(id);
  }

  /**
   * Gets a sponsor by company name.
   *
   * @param companyName The company name of the sponsor.
   * @returns The sponsor if found, undefined otherwise.
   */
  async getSponsorByCompanyName(
    companyName: string,
  ): Promise<Sponsor | undefined> {
    for (const sponsor of this._sponsors.values()) {
      if (sponsor.companyName === companyName) {
        return sponsor;
      }
    }
    return undefined;
  }

  /**
   * Gets all sponsors.
   *
   * @returns All sponsors.
   */
  async getSponsors(): Promise<Sponsor[]> {
    return Array.from(this._sponsors.values());
  }

  /**
   * Updates a sponsor.
   *
   * @param id The ID of the sponsor to update.
   * @param sponsor The sponsor data to update.
   * @returns The updated sponsor.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   * @throws {AddressNotFoundError} If a new address ID is provided and the address is not found.
   */
  async updateSponsor(id: number, sponsor: SponsorUpdate): Promise<Sponsor> {
    const existingSponsor = this._sponsors.get(id);
    if (!existingSponsor) {
      throw new SponsorNotFoundError("Sponsor not found");
    }

    if (sponsor.addressId && sponsor.addressId !== existingSponsor.addressId) {
      const address = await this.addressRepository.getAddressById(
        sponsor.addressId,
      );
      if (!address) {
        throw new AddressNotFoundError("Address not found");
      }
    }

    // If company name is being updated, check for uniqueness
    if (
      sponsor.companyName &&
      sponsor.companyName !== existingSponsor.companyName
    ) {
      for (const otherSponsor of this._sponsors.values()) {
        if (
          otherSponsor.companyName === sponsor.companyName &&
          otherSponsor.id !== id
        ) {
          throw new SponsorAlreadyExistsError(
            `Sponsor with company name ${sponsor.companyName} already exists`,
          );
        }
      }
    }

    const updatedSponsor: Sponsor = {
      ...existingSponsor,
      ...sponsor,
      companyOwnerName:
        sponsor.companyOwnerName ?? existingSponsor.companyOwnerName,
    };

    this._sponsors.set(id, updatedSponsor);
    return updatedSponsor;
  }

  /**
   * Deletes a sponsor.
   *
   * @param id The ID of the sponsor to delete.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   * @throws {SponsorStillReferencedError} If the sponsor is still referenced by sponsorship agreements.
   */
  async deleteSponsor(id: number): Promise<void> {
    const existingSponsor = this._sponsors.get(id);
    if (!existingSponsor) {
      throw new SponsorNotFoundError("Sponsor not found");
    }

    const referenceCount = this._sponsorReferences.get(id) ?? 0;
    if (referenceCount > 0) {
      throw new SponsorStillReferencedError(
        "Sponsor is still referenced by sponsorship agreements",
      );
    }

    this._sponsors.delete(id);
    this._sponsorReferences.delete(id);
  }

  /**
   * Increments the reference count for a sponsor.
   *
   * @param sponsorId The sponsor ID.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   */
  async incrementReference(sponsorId: number): Promise<void> {
    const sponsor = this._sponsors.get(sponsorId);
    if (!sponsor) {
      throw new SponsorNotFoundError(`Sponsor with ID ${sponsorId} not found`);
    }

    const count = this._sponsorReferences.get(sponsorId) ?? 0;
    this._sponsorReferences.set(sponsorId, count + 1);
  }

  /**
   * Decrements the reference count for a sponsor.
   *
   * @param sponsorId The sponsor ID.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   */
  async decrementReference(sponsorId: number): Promise<void> {
    const sponsor = this._sponsors.get(sponsorId);
    if (!sponsor) {
      throw new SponsorNotFoundError(`Sponsor with ID ${sponsorId} not found`);
    }

    const count = this._sponsorReferences.get(sponsorId) ?? 0;
    if (count > 0) {
      this._sponsorReferences.set(sponsorId, count - 1);
    }
  }
}
