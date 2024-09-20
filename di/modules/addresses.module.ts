import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import { type IAddressesRepository } from "~/application/repositories/addresses.repository.interface";
import { MockAddressesRepository } from "~/infrastructure/repositories/addresses.repository.mock";
import { AddressesRepository } from "~/infrastructure/repositories/addresses.repository";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IAddressesRepository>(DI_SYMBOLS.IAddressesRepository).to(
      MockAddressesRepository,
    );
  } else {
    bind<IAddressesRepository>(DI_SYMBOLS.IAddressesRepository).to(
      AddressesRepository,
    );
  }
};

export const AddressesModule = new ContainerModule(initializeModule);
