import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IEventsRepository } from "~/application/repositories/events.repository.interface";
import { Event_, EventInsert, EventUpdate } from "~/domain/entities/event";
import {
  EventNotFoundError,
  EventStillReferencedError,
  EventWithSameFacebookEventUrlAlreadyExistsError,
  GroupAlreadyLinkedToEventError,
  GroupNotLinkedToEventError,
} from "~/domain/errors/events";
import { GroupNotFoundError } from "~/domain/errors/groups";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockEventsRepository implements IEventsRepository {
  private events: Event_[] = mockData.events;
  private eventGroups: { eventId: number; groupId: number }[] =
    mockData.eventGroups;
  private autoIncrementId: number =
    this.events.reduce((maxId, event) => {
      return event.id > maxId ? event.id : maxId;
    }, 0) + 1;

  private isEventReferenced(eventId: number): boolean {
    const groupWithEventExists = this.eventGroups.some(
      (eg) => eg.eventId === eventId,
    );

    const eventRegistrationWithEventExists = mockData.eventRegistrations.some(
      (er) => er.eventId === eventId,
    );

    return groupWithEventExists || eventRegistrationWithEventExists;
  }

  async createEvent(event: EventInsert): Promise<Event_> {
    return startSpan({ name: "MockEventsRepository > createEvent" }, () => {
      const existingEventWithFacebookUrl = this.events.find(
        (e) => e.facebookEventUrl === event.facebookEventUrl,
      );
      if (existingEventWithFacebookUrl) {
        throw new EventWithSameFacebookEventUrlAlreadyExistsError(
          "Event with the same Facebook event URL already exists",
        );
      }

      const newEvent: Event_ = {
        id: this.autoIncrementId++,
        ...event,
      };
      this.events.push(newEvent);
      return newEvent;
    });
  }

  async getEventById(id: number): Promise<Event_ | undefined> {
    return startSpan({ name: "MockEventsRepository > getEventById" }, () => {
      return this.events.find((e) => e.id === id);
    });
  }

  async getAllEvents(): Promise<Event_[]> {
    return startSpan({ name: "MockEventsRepository > getAllEvents" }, () => {
      return this.events;
    });
  }

  async getEventsByGroupId(groupId: number): Promise<Event_[]> {
    return startSpan(
      { name: "MockEventsRepository > getEventsByGroupId" },
      () => {
        const eventIds = this.eventGroups
          .filter((eg) => eg.groupId === groupId)
          .map((eg) => eg.eventId);

        return this.events.filter((e) => eventIds.includes(e.id));
      },
    );
  }

  async updateEvent(id: number, event: EventUpdate): Promise<Event_> {
    return startSpan({ name: "MockEventsRepository > updateEvent" }, () => {
      const existingEventIndex = this.events.findIndex((e) => e.id === id);
      if (existingEventIndex === -1) {
        throw new EventNotFoundError("Event not found");
      }

      const existingEventWithFacebookUrl = this.events.find(
        (e) => e.facebookEventUrl === event.facebookEventUrl && e.id !== id,
      );
      if (existingEventWithFacebookUrl) {
        throw new EventWithSameFacebookEventUrlAlreadyExistsError(
          "Event with the same Facebook event URL already exists",
        );
      }

      this.events[existingEventIndex] = {
        ...this.events[existingEventIndex]!,
        ...event,
      };
      return this.events[existingEventIndex];
    });
  }

  async deleteEvent(id: number): Promise<void> {
    return startSpan({ name: "MockEventsRepository > deleteEvent" }, () => {
      if (this.isEventReferenced(id)) {
        throw new EventStillReferencedError("Event still referenced");
      }

      const eventIndex = this.events.findIndex((e) => e.id === id);
      if (eventIndex === -1) {
        throw new EventNotFoundError("Event not found");
      }

      this.events.splice(eventIndex, 1);
    });
  }

  async deleteAllEvents(): Promise<void> {
    return startSpan({ name: "MockEventsRepository > deleteAllEvents" }, () => {
      const eventsReferenced = this.events.some((event) =>
        this.isEventReferenced(event.id),
      );

      if (eventsReferenced) {
        throw new EventStillReferencedError("Event still referenced");
      }

      this.events = [];
    });
  }

  async addGroupToEvent(eventId: number, groupId: number): Promise<void> {
    return startSpan({ name: "MockEventsRepository > addGroupToEvent" }, () => {
      const existingEvent = this.events.find((e) => e.id === eventId);
      if (!existingEvent) {
        throw new EventNotFoundError("Event not found");
      }

      const existingGroup = mockData.groups.find((g) => g.id === groupId);

      if (!existingGroup) {
        throw new GroupNotFoundError("Group not found");
      }

      const existingGroupLink = this.eventGroups.find(
        (eg) => eg.eventId === eventId && eg.groupId === groupId,
      );
      if (existingGroupLink) {
        throw new GroupAlreadyLinkedToEventError(
          "Group is already linked to event",
        );
      }

      this.eventGroups.push({ eventId, groupId });
    });
  }

  async removeGroupFromEvent(eventId: number, groupId: number): Promise<void> {
    return startSpan(
      { name: "MockEventsRepository > removeGroupFromEvent" },
      () => {
        const existingGroupLinkIndex = this.eventGroups.findIndex(
          (eg) => eg.eventId === eventId && eg.groupId === groupId,
        );
        if (existingGroupLinkIndex === -1) {
          throw new GroupNotLinkedToEventError("Group is not linked to event");
        }

        this.eventGroups.splice(existingGroupLinkIndex, 1);
      },
    );
  }

  async removeAllGroupsFromEvent(eventId: number): Promise<void> {
    return startSpan(
      { name: "MockEventsRepository > removeAllGroupsFromEvent" },
      () => {
        this.eventGroups = this.eventGroups.filter(
          (eg) => eg.eventId !== eventId,
        );
      },
    );
  }

  async removeAllGroupsFromAllEvents(): Promise<void> {
    return startSpan(
      { name: "MockEventsRepository > removeAllGroupsFromAllEvents" },
      () => {
        this.eventGroups = [];
      },
    );
  }
}
