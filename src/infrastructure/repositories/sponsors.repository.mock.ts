import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { ISponsorsRepository } from "~/application/repositories/sponsors.repository.interface";
import {
  Sponsor,
  SponsorInsert,
  SponsorUpdate,
} from "~/domain/entities/sponsor";
import {
  SponsorNotFoundError,
  SponsorStillReferencedError,
  SponsorWithThatCompanyNameAlreadyExistsError,
} from "~/domain/errors/sponsors";
import { AddressNotFoundError } from "~/domain/errors/addresses";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockSponsorsRepository implements ISponsorsRepository {
  private sponsors: Sponsor[] = mockData.sponsors;
  private autoIncrementId: number =
    this.sponsors.reduce((maxId, sponsor) => {
      return sponsor.id > maxId ? sponsor.id : maxId;
    }, 0) + 1;

  private isSponsorReferenced(sponsorId: number): boolean {
    return mockData.sponsorshipAgreements.some(
      (sa) => sa.sponsorId === sponsorId,
    );
  }

  async createSponsor(sponsor: SponsorInsert): Promise<Sponsor> {
    return startSpan({ name: "MockSponsorsRepository > createSponsor" }, () => {
      if (sponsor.addressId) {
        const addressExists = mockData.addresses.some(
          (a) => a.id === sponsor.addressId,
        );
        if (!addressExists) {
          throw new AddressNotFoundError("Address not found");
        }
      }

      const existingSponsor = this.sponsors.find(
        (s) =>
          s.companyName.toLowerCase() === sponsor.companyName.toLowerCase(),
      );
      if (existingSponsor) {
        throw new SponsorWithThatCompanyNameAlreadyExistsError(
          "A sponsor with that company name already exists",
        );
      }

      const newSponsor: Sponsor = {
        id: this.autoIncrementId++,
        ...sponsor,
      };
      this.sponsors.push(newSponsor);
      return newSponsor;
    });
  }

  async getSponsorById(id: number): Promise<Sponsor | undefined> {
    return startSpan(
      { name: "MockSponsorsRepository > getSponsorById" },
      () => {
        return this.sponsors.find((s) => s.id === id);
      },
    );
  }

  async getSponsorByCompanyName(
    companyName: string,
  ): Promise<Sponsor | undefined> {
    return startSpan(
      { name: "MockSponsorsRepository > getSponsorByCompanyName" },
      () => {
        return this.sponsors.find(
          (s) => s.companyName.toLowerCase() === companyName.toLowerCase(),
        );
      },
    );
  }

  async getAllSponsors(): Promise<Sponsor[]> {
    return startSpan(
      { name: "MockSponsorsRepository > getAllSponsors" },
      () => {
        return this.sponsors;
      },
    );
  }

  async updateSponsor(id: number, sponsor: SponsorUpdate): Promise<Sponsor> {
    return startSpan({ name: "MockSponsorsRepository > updateSponsor" }, () => {
      const sponsorIndex = this.sponsors.findIndex((s) => s.id === id);
      if (sponsorIndex === -1) {
        throw new SponsorNotFoundError("Sponsor not found");
      }

      if (sponsor.addressId) {
        const addressExists = mockData.addresses.some(
          (a) => a.id === sponsor.addressId,
        );
        if (!addressExists) {
          throw new AddressNotFoundError("Address not found");
        }
      }

      const existingSponsorWithCompanyName = this.sponsors.find(
        (s) =>
          s.companyName.toLowerCase() === sponsor.companyName?.toLowerCase() &&
          s.id !== id,
      );
      if (existingSponsorWithCompanyName) {
        throw new SponsorWithThatCompanyNameAlreadyExistsError(
          "A sponsor with that company name already exists",
        );
      }

      let updatedCompanyOwnerName =
        this.sponsors[sponsorIndex]!.companyOwnerName;
      if (sponsor.companyOwnerName !== undefined) {
        if (sponsor.companyOwnerName === null) {
          updatedCompanyOwnerName = null;
        } else {
          updatedCompanyOwnerName = {
            ...updatedCompanyOwnerName,
            ...sponsor.companyOwnerName,
          };
        }
      }

      this.sponsors[sponsorIndex] = {
        ...this.sponsors[sponsorIndex]!,
        ...sponsor,
        companyOwnerName: updatedCompanyOwnerName,
      };

      return this.sponsors[sponsorIndex];
    });
  }

  async deleteSponsor(id: number): Promise<void> {
    return startSpan({ name: "MockSponsorsRepository > deleteSponsor" }, () => {
      if (this.isSponsorReferenced(id)) {
        throw new SponsorStillReferencedError("Sponsor still referenced");
      }

      const sponsorIndex = this.sponsors.findIndex((s) => s.id === id);
      if (sponsorIndex === -1) {
        throw new SponsorNotFoundError("Sponsor not found");
      }
      this.sponsors.splice(sponsorIndex, 1);
    });
  }

  async deleteAllSponsors(): Promise<void> {
    return startSpan(
      { name: "MockSponsorsRepository > deleteAllSponsors" },
      () => {
        if (
          this.sponsors.some((sponsor) => this.isSponsorReferenced(sponsor.id))
        ) {
          throw new SponsorStillReferencedError("Sponsor still referenced");
        }

        this.sponsors = [];
      },
    );
  }
}
