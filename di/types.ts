import { type IAddressesRepository } from "~/application/repositories/addresses.repository.interface";
import { type IEmergencyContactsRepository } from "~/application/repositories/emergency-contacts.repository.interface";
import { type IEventRegistrationsRepository } from "~/application/repositories/event-registrations.repository.interface";
import { type IEventsRepository } from "~/application/repositories/events.repository.interface";
import { type IGroupsRepository } from "~/application/repositories/groups.repository.interface";
import { type IMedicalInformationRepository } from "~/application/repositories/medical-information.repository.interface";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";
import { type IParentsRepository } from "~/application/repositories/parents.repository.interface";
import { type ISponsorsRepository } from "~/application/repositories/sponsors.repository.interface";
import { type ISponsorshipAgreementsRepository } from "~/application/repositories/sponsorship-agreements.repository.interface";
import { type IWorkYearsRepository } from "~/application/repositories/work-years.repository.interface";
import { type IYearlyMembershipsRepository } from "~/application/repositories/yearly-memberships.repository.interface";
import { type IAuthenticationService } from "~/application/services/authentication.service.interface";

export const DI_SYMBOLS = {
  // Repositories
  IAddressesRepository: Symbol.for("IAddressesRepository"),
  IEmergencyContactsRepository: Symbol.for("IEmergencyContactsRepository"),
  IEventRegistrationsRepository: Symbol.for("IEventRegistrationsRepository"),
  IEventsRepository: Symbol.for("IEventsRepository"),
  IGroupsRepository: Symbol.for("IGroupsRepository"),
  IMedicalInformationRepository: Symbol.for("IMedicalInformationRepository"),
  IMembersRepository: Symbol.for("IMembersRepository"),
  IParentsRepository: Symbol.for("IParentsRepository"),
  ISponsorsRepository: Symbol.for("ISponsorsRepository"),
  ISponsorshipAgreementsRepository: Symbol.for(
    "ISponsorshipAgreementsRepository",
  ),
  IWorkYearsRepository: Symbol.for("IWorkyearsRepository"),
  IYearlyMembershipsRepository: Symbol.for("IYearlyMembershipsRepository"),
  // Services
  IAuthenticationService: Symbol.for("IAuthenticationService"),
};

export interface DI_RETURN_TYPES {
  // Repositories
  IAddressesRepository: IAddressesRepository;
  IEmergencyContactsRepository: IEmergencyContactsRepository;
  IEventRegistrationsRepository: IEventRegistrationsRepository;
  IEventsRepository: IEventsRepository;
  IGroupsRepository: IGroupsRepository;
  IMedicalInformationRepository: IMedicalInformationRepository;
  IMembersRepository: IMembersRepository;
  IParentsRepository: IParentsRepository;
  ISponsorsRepository: ISponsorsRepository;
  ISponsorshipAgreementsRepository: ISponsorshipAgreementsRepository;
  IWorkYearsRepository: IWorkYearsRepository;
  IYearlyMembershipsRepository: IYearlyMembershipsRepository;
  // Services
  IAuthenticationService: IAuthenticationService;
}
