import { type Address } from "~/domain/entities/address";
import { type EmergencyContact } from "~/domain/entities/emergency-contact";
import { type Event_ } from "~/domain/entities/event";
import { type EventRegistration } from "~/domain/entities/event-registration";
import { type Group } from "~/domain/entities/group";
import { type MedicalInformation } from "~/domain/entities/medical-information";
import { type Member } from "~/domain/entities/member";
import { type Parent } from "~/domain/entities/parent";
import { type Sponsor } from "~/domain/entities/sponsor";
import { type SponsorshipAgreement } from "~/domain/entities/sponsorship-agreement";
import { type WorkYear } from "~/domain/entities/work-year";
import { type YearlyMembership } from "~/domain/entities/yearly-membership";

interface EventGroup {
  eventId: number;
  groupId: number;
}

interface ParentMember {
  parentId: number;
  memberId: number;
  isPrimary: boolean;
}

interface MockData {
  addresses: Address[];
  emergencyContacts: EmergencyContact[];
  eventRegistrations: EventRegistration[];
  events: Event_[];
  eventGroups: EventGroup[];
  groups: Group[];
  medicalInformation: MedicalInformation[];
  parents: Parent[];
  members: Member[];
  parentMembers: ParentMember[];
  sponsors: Sponsor[];
  sponsorshipAgreements: SponsorshipAgreement[];
  workYears: WorkYear[];
  yearlyMemberships: YearlyMembership[];
}

export const mockData: MockData = {
  addresses: [],
  emergencyContacts: [],
  eventRegistrations: [],
  events: [],
  eventGroups: [],
  groups: [],
  medicalInformation: [],
  parents: [],
  members: [],
  parentMembers: [],
  sponsors: [],
  sponsorshipAgreements: [],
  workYears: [],
  yearlyMemberships: [],
};
