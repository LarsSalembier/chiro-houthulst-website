import { type SponsorUpdate, type Sponsor } from "~/domain/entities/sponsor";

export interface ISponsorsRepository {
  createSponsor(sponsor: Sponsor): Promise<Sponsor>;
  getSponsor(id: number): Promise<Sponsor | undefined>;
  getSponsorByCompanyName(companyName: string): Promise<Sponsor | undefined>;
  getSponsors(): Promise<Sponsor[]>;
  updateSponsor(id: number, sponsor: SponsorUpdate): Promise<Sponsor>;
  deleteSponsor(id: number): Promise<void>;
}
