import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { MedicalInformationRepository } from "~/infrastructure/repositories/medical-information.repository";
import { type IMedicalInformationRepository } from "~/application/repositories/medical-information.repository.interface";
import { MockMedicalInformationRepository } from "~/infrastructure/repositories/medical-information.repository.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IMedicalInformationRepository>(
      DI_SYMBOLS.IMedicalInformationRepository,
    ).to(MockMedicalInformationRepository);
  } else {
    bind<IMedicalInformationRepository>(
      DI_SYMBOLS.IMedicalInformationRepository,
    ).to(MedicalInformationRepository);
  }
};

export const MedicalInformationModule = new ContainerModule(initializeModule);
