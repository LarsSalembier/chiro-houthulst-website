import {
  type SponsorshipAgreement,
  type SponsorshipAgreementInsert,
} from "../models/entities/sponsorship-agreement";

export interface ISponsorshipAgreementsRepository {
  createSponsorshipAgreement(
    sponsorshipAgreement: SponsorshipAgreementInsert,
  ): Promise<SponsorshipAgreement>;
  getSponsorshipAgreement(
    sponsorCompanyName: string,
    workYearId: number,
  ): Promise<SponsorshipAgreement>;
  getSponsorshipAgreements(workYearId: number): Promise<SponsorshipAgreement[]>;
  updateSponsorshipAgreement(
    sponsorshipAgreement: SponsorshipAgreement,
  ): Promise<SponsorshipAgreement>;
}
