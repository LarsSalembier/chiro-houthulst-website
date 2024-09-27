import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IEventRegistrationsRepository } from "~/application/repositories/event-registrations.repository.interface";
import {
  EventRegistration,
  EventRegistrationInsert,
  EventRegistrationUpdate,
} from "~/domain/entities/event-registration";
import {
  EventRegistrationNotFoundError,
  MemberAlreadyRegisteredForEventError,
} from "~/domain/errors/event-registrations";
import { EventNotFoundError } from "~/domain/errors/events";
import { MemberNotFoundError } from "~/domain/errors/members";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockEventRegistrationsRepository
  implements IEventRegistrationsRepository
{
  private eventRegistrations: EventRegistration[] = mockData.eventRegistrations;

  async createEventRegistration(
    eventRegistration: EventRegistrationInsert,
  ): Promise<EventRegistration> {
    return startSpan(
      {
        name: "MockEventRegistrationsRepository > createEventRegistration",
      },
      () => {
        const event = mockData.events.find(
          (e) => e.id === eventRegistration.eventId,
        );

        if (!event) {
          throw new EventNotFoundError("Event not found");
        }

        const member = mockData.members.find(
          (m) => m.id === eventRegistration.memberId,
        );

        if (!member) {
          throw new MemberNotFoundError("Member not found");
        }

        const existingRegistration = this.eventRegistrations.find(
          (er) =>
            er.eventId === eventRegistration.eventId &&
            er.memberId === eventRegistration.memberId,
        );
        if (existingRegistration) {
          throw new MemberAlreadyRegisteredForEventError(
            "Member is already registered for this event",
          );
        }

        this.eventRegistrations.push(eventRegistration);
        return eventRegistration;
      },
    );
  }

  async getEventRegistrationByIds(
    eventId: number,
    memberId: number,
  ): Promise<EventRegistration | undefined> {
    return startSpan(
      {
        name: "MockEventRegistrationsRepository > getEventRegistrationByIds",
      },
      () => {
        const eventRegistration = this.eventRegistrations.find(
          (er) => er.eventId === eventId && er.memberId === memberId,
        );
        return eventRegistration;
      },
    );
  }

  async getAllEventRegistrations(): Promise<EventRegistration[]> {
    return startSpan(
      {
        name: "MockEventRegistrationsRepository > getAllEventRegistrations",
      },
      () => {
        return this.eventRegistrations;
      },
    );
  }

  async updateEventRegistration(
    eventId: number,
    memberId: number,
    eventRegistration: EventRegistrationUpdate,
  ): Promise<EventRegistration> {
    return startSpan(
      {
        name: "MockEventRegistrationsRepository > updateEventRegistration",
      },
      () => {
        const registrationIndex = this.eventRegistrations.findIndex(
          (er) => er.eventId === eventId && er.memberId === memberId,
        );
        if (registrationIndex === -1) {
          throw new EventRegistrationNotFoundError(
            "Event registration not found",
          );
        }

        this.eventRegistrations[registrationIndex] = {
          ...this.eventRegistrations[registrationIndex]!,
          ...eventRegistration,
        };
        return this.eventRegistrations[registrationIndex];
      },
    );
  }

  async deleteEventRegistration(
    eventId: number,
    memberId: number,
  ): Promise<void> {
    return startSpan(
      {
        name: "MockEventRegistrationsRepository > deleteEventRegistration",
      },
      () => {
        const registrationIndex = this.eventRegistrations.findIndex(
          (er) => er.eventId === eventId && er.memberId === memberId,
        );
        if (registrationIndex === -1) {
          throw new EventRegistrationNotFoundError(
            "Event registration not found",
          );
        }

        this.eventRegistrations.splice(registrationIndex, 1);
      },
    );
  }

  async deleteAllEventRegistrations(): Promise<void> {
    return startSpan(
      {
        name: "MockEventRegistrationsRepository > deleteAllEventRegistrations",
      },
      () => {
        this.eventRegistrations = [];
      },
    );
  }
}
