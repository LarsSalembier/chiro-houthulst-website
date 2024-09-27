import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { WorkYearsRepository } from "~/infrastructure/repositories/work-years.repository";
import { type IWorkYearsRepository } from "~/application/repositories/work-years.repository.interface";
import { MockWorkYearsRepository } from "~/infrastructure/repositories/work-years.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IWorkYearsRepository>(DI_SYMBOLS.IWorkYearsRepository).to(
      MockWorkYearsRepository,
    );
  } else {
    bind<IWorkYearsRepository>(DI_SYMBOLS.IWorkYearsRepository).to(
      WorkYearsRepository,
    );
  }
};

export const WorkYearsModule = new ContainerModule(initializeModule);
