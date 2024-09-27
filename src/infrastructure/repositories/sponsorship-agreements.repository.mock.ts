import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { ISponsorshipAgreementsRepository } from "~/application/repositories/sponsorship-agreements.repository.interface";
import {
  SponsorshipAgreement,
  SponsorshipAgreementInsert,
  SponsorshipAgreementUpdate,
} from "~/domain/entities/sponsorship-agreement";
import {
  SponsorAlreadyHasSponsorshipAgreementForWorkYearError,
  SponsorshipAgreementNotFoundError,
} from "~/domain/errors/sponsorship-agreements";
import { SponsorNotFoundError } from "~/domain/errors/sponsors";
import { WorkYearNotFoundError } from "~/domain/errors/work-years";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockSponsorshipAgreementsRepository
  implements ISponsorshipAgreementsRepository
{
  private sponsorshipAgreements: SponsorshipAgreement[] =
    mockData.sponsorshipAgreements;

  async createSponsorshipAgreement(
    sponsorshipAgreement: SponsorshipAgreementInsert,
  ): Promise<SponsorshipAgreement> {
    return startSpan(
      {
        name: "MockSponsorshipAgreementsRepository > createSponsorshipAgreement",
      },
      () => {
        const sponsor = mockData.sponsors.find(
          (s) => s.id === sponsorshipAgreement.sponsorId,
        );
        if (!sponsor) {
          throw new SponsorNotFoundError("Sponsor not found");
        }

        const workYear = mockData.workYears.find(
          (wy) => wy.id === sponsorshipAgreement.workYearId,
        );
        if (!workYear) {
          throw new WorkYearNotFoundError("Work year not found");
        }

        const existingAgreement = this.sponsorshipAgreements.find(
          (sa) =>
            sa.sponsorId === sponsorshipAgreement.sponsorId &&
            sa.workYearId === sponsorshipAgreement.workYearId,
        );
        if (existingAgreement) {
          throw new SponsorAlreadyHasSponsorshipAgreementForWorkYearError(
            "Sponsor already has a sponsorship agreement for this work year",
          );
        }

        this.sponsorshipAgreements.push(sponsorshipAgreement);
        return sponsorshipAgreement;
      },
    );
  }

  async getSponsorshipAgreementByIds(
    sponsorId: number,
    workYearId: number,
  ): Promise<SponsorshipAgreement | undefined> {
    return startSpan(
      {
        name: "MockSponsorshipAgreementsRepository > getSponsorshipAgreementByIds",
      },
      () => {
        const sponsorshipAgreement = this.sponsorshipAgreements.find(
          (sa) => sa.sponsorId === sponsorId && sa.workYearId === workYearId,
        );
        return sponsorshipAgreement;
      },
    );
  }

  async getAllSponsorshipAgreements(): Promise<SponsorshipAgreement[]> {
    return startSpan(
      {
        name: "MockSponsorshipAgreementsRepository > getAllSponsorshipAgreements",
      },
      () => {
        return this.sponsorshipAgreements;
      },
    );
  }

  async updateSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
    sponsorshipAgreement: SponsorshipAgreementUpdate,
  ): Promise<SponsorshipAgreement> {
    return startSpan(
      {
        name: "MockSponsorshipAgreementsRepository > updateSponsorshipAgreement",
      },
      () => {
        const agreementIndex = this.sponsorshipAgreements.findIndex(
          (sa) => sa.sponsorId === sponsorId && sa.workYearId === workYearId,
        );
        if (agreementIndex === -1) {
          throw new SponsorshipAgreementNotFoundError(
            "Sponsorship agreement not found",
          );
        }

        this.sponsorshipAgreements[agreementIndex] = {
          ...this.sponsorshipAgreements[agreementIndex]!,
          ...sponsorshipAgreement,
        };
        return this.sponsorshipAgreements[agreementIndex];
      },
    );
  }

  async deleteSponsorshipAgreement(
    sponsorId: number,
    workYearId: number,
  ): Promise<void> {
    return startSpan(
      {
        name: "MockSponsorshipAgreementsRepository > deleteSponsorshipAgreement",
      },
      () => {
        const agreementIndex = this.sponsorshipAgreements.findIndex(
          (sa) => sa.sponsorId === sponsorId && sa.workYearId === workYearId,
        );
        if (agreementIndex === -1) {
          throw new SponsorshipAgreementNotFoundError(
            "Sponsorship agreement not found",
          );
        }

        this.sponsorshipAgreements.splice(agreementIndex, 1);
      },
    );
  }

  async deleteAllSponsorshipAgreements(): Promise<void> {
    return startSpan(
      {
        name: "MockSponsorshipAgreementsRepository > deleteAllSponsorshipAgreements",
      },
      () => {
        this.sponsorshipAgreements = [];
      },
    );
  }
}
