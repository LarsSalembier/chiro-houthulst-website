import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { YearlyMembershipsRepository } from "~/infrastructure/repositories/yearly-memberships.repository";
import { type IYearlyMembershipsRepository } from "~/application/repositories/yearly-memberships.repository.interface";
import { MockYearlyMembershipsRepository } from "~/infrastructure/repositories/yearly-memberships.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IYearlyMembershipsRepository>(
      DI_SYMBOLS.IYearlyMembershipsRepository,
    ).to(MockYearlyMembershipsRepository);
  } else {
    bind<IYearlyMembershipsRepository>(
      DI_SYMBOLS.IYearlyMembershipsRepository,
    ).to(YearlyMembershipsRepository);
  }
};

export const YearlyMembershipsModule = new ContainerModule(initializeModule);
