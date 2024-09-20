import {
  type SponsorshipAgreementUpdate,
  type SponsorshipAgreement,
  type SponsorshipAgreementInsert,
} from "~/domain/entities/sponsorship-agreement";

export interface ISponsorshipAgreementsRepository {
  createSponsorshipAgreement(
    sponsorshipAgreement: SponsorshipAgreementInsert,
  ): Promise<SponsorshipAgreement>;
  getSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<SponsorshipAgreement | undefined>;
  getSponsorshipAgreements(): Promise<SponsorshipAgreement[]>;
  getSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]>;
  getSponsorshipAgreementsForSponsor(
    sponsorId: number,
  ): Promise<SponsorshipAgreement[]>;
  updateSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
    input: SponsorshipAgreementUpdate,
  ): Promise<SponsorshipAgreement>;
  deleteSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<void>;
  getUnpaidSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]>;
  getPaidSponsorshipAgreementsForWorkYear(
    workYearId: number,
  ): Promise<SponsorshipAgreement[]>;
}
