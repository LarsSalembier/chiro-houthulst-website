import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { WorkyearsRepository } from "~/infrastructure/repositories/workyears.repository";
import { type IWorkyearsRepository } from "~/application/repositories/workyears.repository.interface";
import { MockWorkyearsRepository } from "~/infrastructure/repositories/workyears.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IWorkyearsRepository>(DI_SYMBOLS.IWorkyearsRepository).to(
      MockWorkyearsRepository,
    );
  } else {
    bind<IWorkyearsRepository>(DI_SYMBOLS.IWorkyearsRepository).to(
      WorkyearsRepository,
    );
  }
};

export const WorkyearsModule = new ContainerModule(initializeModule);
