import { injectable } from "inversify";
import { type ISponsorshipAgreementsRepository } from "~/application/repositories/sponsorship-agreements.repository.interface";
import {
  type SponsorshipAgreement,
  type SponsorshipAgreementInsert,
  type SponsorshipAgreementUpdate,
} from "~/domain/entities/sponsorship-agreement";
import {
  SponsorshipAgreementAlreadyExistsError,
  SponsorshipAgreementNotFoundError,
} from "~/domain/errors/sponsorship-agreements";
import { WorkyearNotFoundError } from "~/domain/errors/workyears";
import { SponsorNotFoundError } from "~/domain/errors/sponsors";
import { type IWorkyearsRepository } from "~/application/repositories/workyears.repository.interface";
import { type MockSponsorsRepository } from "./sponsors.repository.mock";

@injectable()
export class MockSponsorshipAgreementsRepository
  implements ISponsorshipAgreementsRepository
{
  private _sponsorshipAgreements: SponsorshipAgreement[] = [];

  constructor(
    private readonly sponsorsRepository: MockSponsorsRepository,
    private readonly workyearsRepository: IWorkyearsRepository,
  ) {}

  /**
   * Creates a new sponsorship agreement.
   *
   * @param sponsorshipAgreement The sponsorship agreement data to insert.
   * @returns The created sponsorship agreement.
   * @throws {SponsorshipAgreementAlreadyExistsError} If the agreement already exists.
   * @throws {SponsorNotFoundError} If the sponsor does not exist.
   * @throws {WorkyearNotFoundError} If the work year does not exist.
   */
  async createSponsorshipAgreement(
    sponsorshipAgreement: SponsorshipAgreementInsert,
  ): Promise<SponsorshipAgreement> {
    const sponsorExists = await this.sponsorsRepository.getSponsor(
      sponsorshipAgreement.sponsorId,
    );

    if (!sponsorExists) {
      throw new SponsorNotFoundError("Sponsor not found");
    }

    const workYearExists = await this.workyearsRepository.getWorkyear(
      sponsorshipAgreement.workYearId,
    );

    if (!workYearExists) {
      throw new WorkyearNotFoundError("Work year not found");
    }

    // Check if the agreement already exists
    const existingAgreement = this._sponsorshipAgreements.find(
      (agreement) =>
        agreement.sponsorId === sponsorshipAgreement.sponsorId &&
        agreement.workYearId === sponsorshipAgreement.workYearId,
    );

    if (existingAgreement) {
      throw new SponsorshipAgreementAlreadyExistsError(
        "Sponsorship agreement already exists",
      );
    }

    this._sponsorshipAgreements.push(sponsorshipAgreement);

    // Increment sponsor reference count
    await this.sponsorsRepository.incrementReference(
      sponsorshipAgreement.sponsorId,
    );

    return sponsorshipAgreement;
  }

  /**
   * Gets a sponsorship agreement by sponsor ID and work year ID.
   *
   * @param sponsorId The ID of the sponsor.
   * @param workYearId The ID of the work year.
   * @returns The sponsorship agreement if found, undefined otherwise.
   */
  async getSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<SponsorshipAgreement | undefined> {
    return this._sponsorshipAgreements.find(
      (agreement) =>
        agreement.sponsorId === sponsorId &&
        agreement.workYearId === workYearId,
    );
  }

  /**
   * Gets all sponsorship agreements.
   *
   * @returns An array of sponsorship agreements.
   */
  async getSponsorshipAgreements(): Promise<SponsorshipAgreement[]> {
    return [...this._sponsorshipAgreements];
  }

  /**
   * Gets sponsorship agreements for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of sponsorship agreements.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   */
  async getSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]> {
    const workYearExists =
      await this.workyearsRepository.getWorkyear(workYearId);

    if (!workYearExists) {
      throw new WorkyearNotFoundError("Work year not found");
    }

    return this._sponsorshipAgreements.filter(
      (agreement) => agreement.workYearId === workYearId,
    );
  }

  /**
   * Gets sponsorship agreements for a specific sponsor.
   *
   * @param sponsorId The ID of the sponsor.
   * @returns An array of sponsorship agreements.
   * @throws {SponsorNotFoundError} If the sponsor is not found.
   */
  async getSponsorshipAgreementsForSponsor(
    sponsorId: number,
  ): Promise<SponsorshipAgreement[]> {
    const sponsorExists = await this.sponsorsRepository.getSponsor(sponsorId);

    if (!sponsorExists) {
      throw new SponsorNotFoundError("Sponsor not found");
    }

    return this._sponsorshipAgreements.filter(
      (agreement) => agreement.sponsorId === sponsorId,
    );
  }

  /**
   * Updates a sponsorship agreement.
   *
   * @param sponsorId The ID of the sponsor.
   * @param workYearId The ID of the work year.
   * @param input The data to update.
   * @returns The updated sponsorship agreement.
   * @throws {SponsorshipAgreementNotFoundError} If the agreement is not found.
   */
  async updateSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
    input: SponsorshipAgreementUpdate,
  ): Promise<SponsorshipAgreement> {
    const index = this._sponsorshipAgreements.findIndex(
      (agreement) =>
        agreement.sponsorId === sponsorId &&
        agreement.workYearId === workYearId,
    );

    if (index === -1) {
      throw new SponsorshipAgreementNotFoundError(
        "Sponsorship agreement not found",
      );
    }

    const existingAgreement = this._sponsorshipAgreements[index];
    const updatedAgreement: SponsorshipAgreement = {
      ...existingAgreement!,
      ...input,
    };

    this._sponsorshipAgreements[index] = updatedAgreement;

    return updatedAgreement;
  }

  /**
   * Deletes a sponsorship agreement.
   *
   * @param sponsorId The ID of the sponsor.
   * @param workYearId The ID of the work year.
   * @throws {SponsorshipAgreementNotFoundError} If the agreement is not found.
   */
  async deleteSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<void> {
    const index = this._sponsorshipAgreements.findIndex(
      (agreement) =>
        agreement.sponsorId === sponsorId &&
        agreement.workYearId === workYearId,
    );

    if (index === -1) {
      throw new SponsorshipAgreementNotFoundError(
        "Sponsorship agreement not found",
      );
    }

    this._sponsorshipAgreements.splice(index, 1);

    // Decrement sponsor reference count
    await this.sponsorsRepository.decrementReference(sponsorId);
  }

  /**
   * Gets unpaid sponsorship agreements for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of unpaid sponsorship agreements.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   */
  async getUnpaidSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]> {
    const workYearExists =
      await this.workyearsRepository.getWorkyear(workYearId);

    if (!workYearExists) {
      throw new WorkyearNotFoundError("Work year not found");
    }

    return this._sponsorshipAgreements.filter(
      (agreement) =>
        agreement.workYearId === workYearId && !agreement.paymentReceived,
    );
  }

  /**
   * Gets paid sponsorship agreements for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of paid sponsorship agreements.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   */
  async getPaidSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]> {
    const workYearExists =
      await this.workyearsRepository.getWorkyear(workYearId);

    if (!workYearExists) {
      throw new WorkyearNotFoundError("Work year not found");
    }

    return this._sponsorshipAgreements.filter(
      (agreement) =>
        agreement.workYearId === workYearId && agreement.paymentReceived,
    );
  }
}
