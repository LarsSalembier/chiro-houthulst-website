import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { type IEventRegistrationsRepository } from "~/application/repositories/event-registrations.repository.interface";
import { MockEventRegistrationsRepository } from "~/infrastructure/repositories/event-registrations.repository.mock";
import { EventRegistrationsRepository } from "~/infrastructure/repositories/event-registrations.repository";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IEventRegistrationsRepository>(
      DI_SYMBOLS.IEmergencyContactsRepository,
    ).to(MockEventRegistrationsRepository);
  } else {
    bind<IEventRegistrationsRepository>(
      DI_SYMBOLS.IEmergencyContactsRepository,
    ).to(EventRegistrationsRepository);
  }
};

export const EventRegistrationsModule = new ContainerModule(initializeModule);
