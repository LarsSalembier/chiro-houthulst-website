import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { EmergencyContactsRepository } from "~/infrastructure/repositories/emergency-contacts.repository";
import { type IEmergencyContactsRepository } from "~/application/repositories/emergency-contacts.repository.interface";
import { MockEmergencyContactsRepository } from "~/infrastructure/repositories/emergency-contacts.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IEmergencyContactsRepository>(
      DI_SYMBOLS.IEmergencyContactsRepository,
    ).to(MockEmergencyContactsRepository);
  } else {
    bind<IEmergencyContactsRepository>(
      DI_SYMBOLS.IEmergencyContactsRepository,
    ).to(EmergencyContactsRepository);
  }
};

export const EmergencyContactsModule = new ContainerModule(initializeModule);
