import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { MembersRepository } from "~/infrastructure/repositories/members.repository";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";
import { MockMembersRepository } from "~/infrastructure/repositories/members.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IMembersRepository>(DI_SYMBOLS.IMembersRepository).to(
      MockMembersRepository,
    );
  } else {
    bind<IMembersRepository>(DI_SYMBOLS.IMembersRepository).to(
      MembersRepository,
    );
  }
};

export const MembersModule = new ContainerModule(initializeModule);
