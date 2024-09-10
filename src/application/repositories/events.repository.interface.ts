import { type Event_, type EventInsert } from "../models/entities/event";
import { type EventRegistration } from "../models/value-objects/event-registration";

export interface IEventsRepository {
  createEvent(event: EventInsert): Promise<Event_>;
  getEvent(eventId: number): Promise<Event_>;
  getEvents(): Promise<Event_[]>;
  updateEvent(event: Event_): Promise<Event_>;
  getRegistrations(eventId: number): Promise<EventRegistration>;
  registerToEvent(eventId: number, memberId: number): Promise<void>;
}
