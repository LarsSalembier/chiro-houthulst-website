import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { SponsorshipAgreementsRepository } from "~/infrastructure/repositories/sponsorship-agreements.repository";
import { type ISponsorshipAgreementsRepository } from "~/application/repositories/sponsorship-agreements.repository.interface";
import { MockSponsorshipAgreementsRepository } from "~/infrastructure/repositories/sponsorship-agreements.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ISponsorshipAgreementsRepository>(
      DI_SYMBOLS.ISponsorshipAgreementsRepository,
    ).to(MockSponsorshipAgreementsRepository);
  } else {
    bind<ISponsorshipAgreementsRepository>(
      DI_SYMBOLS.ISponsorshipAgreementsRepository,
    ).to(SponsorshipAgreementsRepository);
  }
};

export const SponsorshipAgreementsModule = new ContainerModule(
  initializeModule,
);
