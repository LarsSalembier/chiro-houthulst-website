import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { GroupsRepository } from "~/infrastructure/repositories/groups.repository";
import { type IGroupsRepository } from "~/application/repositories/groups.repository.interface";
import { MockGroupsRepository } from "~/infrastructure/repositories/groups.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IGroupsRepository>(DI_SYMBOLS.IGroupsRepository).to(
      MockGroupsRepository,
    );
  } else {
    bind<IGroupsRepository>(DI_SYMBOLS.IGroupsRepository).to(GroupsRepository);
  }
};

export const GroupsModule = new ContainerModule(initializeModule);
