import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { SponsorsRepository } from "~/infrastructure/repositories/sponsors.repository";
import { type ISponsorsRepository } from "~/application/repositories/sponsors.repository.interface";
import { MockSponsorsRepository } from "~/infrastructure/repositories/sponsors.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ISponsorsRepository>(DI_SYMBOLS.ISponsorsRepository).to(
      MockSponsorsRepository,
    );
  } else {
    bind<ISponsorsRepository>(DI_SYMBOLS.ISponsorsRepository).to(
      SponsorsRepository,
    );
  }
};

export const SponsorsModule = new ContainerModule(initializeModule);
