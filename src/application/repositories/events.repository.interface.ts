import {
  type EventUpdate,
  type Event_,
  type EventInsert,
} from "~/domain/entities/event";
import { type Group } from "~/domain/entities/group";
import { type PaymentMethod } from "~/domain/enums/payment-method";
import { type EventRegistration } from "~/domain/value-objects/event-registration";

export interface IEventsRepository {
  createEvent(event: EventInsert): Promise<Event_>;
  getEvent(id: number): Promise<Event_ | undefined>;
  getEvents(): Promise<Event_[]>;
  updateEvent(id: number, event: EventUpdate): Promise<Event_>;
  deleteEvent(id: number): Promise<void>;
  getEventGroups(eventId: number): Promise<Group[]>;
  addGroupToEvent(eventId: number, groupId: number): Promise<void>;
  removeGroupFromEvent(eventId: number, groupId: number): Promise<void>;
  getRegistrations(eventId: number): Promise<EventRegistration[]>;
  getRegistration(
    eventId: number,
    memberId: number,
  ): Promise<EventRegistration | undefined>;
  getPaidRegistrations(eventId: number): Promise<EventRegistration[]>;
  getUnpaidRegistrations(eventId: number): Promise<EventRegistration[]>;
  registerToEvent(eventId: number, memberId: number, date: Date): Promise<void>;
  unregisterFromEvent(eventId: number, memberId: number): Promise<void>;
  markRegistrationAsPaid(
    eventId: number,
    memberId: number,
    paymentMethod: PaymentMethod,
  ): Promise<void>;
  getEventsForMember(memberId: number): Promise<Event_[]>;
  getEventsForGroup(groupId: number): Promise<Event_[]>;
  getRegistrationCount(eventId: number): Promise<number>;
}
