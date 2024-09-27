import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import { type IAuthenticationService } from "~/application/services/authentication.service.interface";
import { MockAuthenticationService } from "~/infrastructure/services/authentication.service.mock";
import { AuthenticationService } from "~/infrastructure/services/authentication.service";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      MockAuthenticationService,
    );
  } else {
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      AuthenticationService,
    );
  }
};

export const AuthenticationModule = new ContainerModule(initializeModule);
