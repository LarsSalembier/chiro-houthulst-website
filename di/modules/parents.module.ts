import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { ParentsRepository } from "~/infrastructure/repositories/parents.repository";
import { type IParentsRepository } from "~/application/repositories/parents.repository.interface";
import { MockParentsRepository } from "~/infrastructure/repositories/parents.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IParentsRepository>(DI_SYMBOLS.IParentsRepository).to(
      MockParentsRepository,
    );
  } else {
    bind<IParentsRepository>(DI_SYMBOLS.IParentsRepository).to(
      ParentsRepository,
    );
  }
};

export const ParentsModule = new ContainerModule(initializeModule);
