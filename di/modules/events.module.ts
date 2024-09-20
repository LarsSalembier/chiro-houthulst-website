import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { EventsRepository } from "~/infrastructure/repositories/events.repository";
import { type IEventsRepository } from "~/application/repositories/events.repository.interface";
import { MockEventsRepository } from "~/infrastructure/repositories/events.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IEventsRepository>(DI_SYMBOLS.IEventsRepository).to(
      MockEventsRepository,
    );
  } else {
    bind<IEventsRepository>(DI_SYMBOLS.IEventsRepository).to(EventsRepository);
  }
};

export const EventsModule = new ContainerModule(initializeModule);
