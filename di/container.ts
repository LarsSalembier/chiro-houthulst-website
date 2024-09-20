import { Container } from "inversify";
import { startSpan } from "@sentry/nextjs";

import { type DI_RETURN_TYPES, DI_SYMBOLS } from "./types";
import { AddressesModule } from "./modules/addresses.module";
import { EmergencyContactsModule } from "./modules/emergency-contacts.module";
import { GroupsModule } from "./modules/groups.module";
import { MedicalInformationModule } from "./modules/medical-information.module";
import { MembersModule } from "./modules/members.module";
import { ParentsModule } from "./modules/parents.module";
import { SponsorsModule } from "./modules/sponsors.module";
import { SponsorshipAgreementsModule } from "./modules/sponsorship-agreements.module";
import { WorkyearsModule } from "./modules/work-years.module";
import { YearlyMembershipsModule } from "./modules/yearly-memberships.module";
import { EventsModule } from "./modules/events.module";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  ApplicationContainer.load(AddressesModule);
  ApplicationContainer.load(EmergencyContactsModule);
  ApplicationContainer.load(EventsModule);
  ApplicationContainer.load(GroupsModule);
  ApplicationContainer.load(MedicalInformationModule);
  ApplicationContainer.load(MembersModule);
  ApplicationContainer.load(ParentsModule);
  ApplicationContainer.load(SponsorsModule);
  ApplicationContainer.load(SponsorshipAgreementsModule);
  ApplicationContainer.load(WorkyearsModule);
  ApplicationContainer.load(YearlyMembershipsModule);
};

export const destroyContainer = () => {
  ApplicationContainer.unload(AddressesModule);
  ApplicationContainer.unload(EmergencyContactsModule);
  ApplicationContainer.unload(EventsModule);
  ApplicationContainer.unload(GroupsModule);
  ApplicationContainer.unload(MedicalInformationModule);
  ApplicationContainer.unload(MembersModule);
  ApplicationContainer.unload(ParentsModule);
  ApplicationContainer.unload(SponsorsModule);
  ApplicationContainer.unload(SponsorshipAgreementsModule);
  ApplicationContainer.unload(WorkyearsModule);
  ApplicationContainer.unload(YearlyMembershipsModule);
};

if (process.env.NODE_ENV !== "test") {
  initializeContainer();
}

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K,
): DI_RETURN_TYPES[K] {
  return startSpan(
    {
      name: "(di) getInjection",
      op: "function",
      attributes: { symbol: symbol.toString() },
    },
    () => ApplicationContainer.get(DI_SYMBOLS[symbol]),
  );
}

export { ApplicationContainer };
