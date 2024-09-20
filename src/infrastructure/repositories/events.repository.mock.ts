import { injectable } from "inversify";
import { type IEventsRepository } from "~/application/repositories/events.repository.interface";
import {
  type Event_,
  type EventInsert,
  type EventUpdate,
} from "~/domain/entities/event";
import { type EventRegistration } from "~/domain/value-objects/event-registration";
import {
  EventNotFoundError,
  EventWithSameFacebookEventUrlAlreadyExistsError,
  GroupAlreadyLinkedToEventError,
  GroupNotLinkedToEventError,
} from "~/domain/errors/events";
import {
  MemberAlreadyPaidError,
  MemberAlreadyRegisteredError,
  MemberNotEnrolledThisYearError,
  MemberNotFoundError,
  MemberNotInGroupError,
  MemberNotRegisteredError,
} from "~/domain/errors/members";
import { GroupNotFoundError } from "~/domain/errors/groups";
import { WorkyearNotFoundError } from "~/domain/errors/workyears";
import { type Group } from "~/domain/entities/group";
import { type PaymentMethod } from "~/domain/enums/payment-method";
import { type IGroupsRepository } from "~/application/repositories/groups.repository.interface";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";
import { type IYearlyMembershipsRepository } from "~/application/repositories/yearly-memberships.repository.interface";
import { type IWorkyearsRepository } from "~/application/repositories/workyears.repository.interface";

@injectable()
export class MockEventsRepository implements IEventsRepository {
  private _events: Event_[] = [];
  private _eventGroups: { eventId: number; groupId: number }[] = [];
  private _eventRegistrations: {
    eventId: number;
    eventRegistration: EventRegistration;
  }[] = [];
  private _nextEventId = 1;

  constructor(
    private readonly groupsRepository: IGroupsRepository,
    private readonly membersRepository: IMembersRepository,
    private readonly workyearsRepository: IWorkyearsRepository,
    private readonly yearlyMembershipsRepository: IYearlyMembershipsRepository,
  ) {}

  /**
   * Creates an event.
   *
   * @param event The event insert input.
   * @returns The created event.
   * @throws {EventWithSameFacebookEventUrlAlreadyExistsError} If an event with the same Facebook Event URL already exists.
   */
  async createEvent(event: EventInsert): Promise<Event_> {
    const existingEvent = this._events.find(
      (e) => e.facebookEventUrl === event.facebookEventUrl,
    );

    if (existingEvent) {
      throw new EventWithSameFacebookEventUrlAlreadyExistsError(
        "Event with the same Facebook Event URL already exists",
      );
    }

    const newEvent: Event_ = {
      ...event,
      id: this._nextEventId++,
    };

    this._events.push(newEvent);
    return newEvent;
  }

  /**
   * Returns an event by id, or undefined if not found.
   *
   * @param id The event id.
   * @returns The event, or undefined if not found.
   */
  async getEvent(id: number): Promise<Event_ | undefined> {
    return this._events.find((event) => event.id === id);
  }

  /**
   * Returns all events.
   *
   * @returns All events.
   */
  async getEvents(): Promise<Event_[]> {
    return [...this._events];
  }

  /**
   * Updates an event by id.
   *
   * @param id The event id.
   * @param input The event update input.
   * @returns The updated event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {EventWithSameFacebookEventUrlAlreadyExistsError} If an event with the same Facebook Event URL already exists.
   */
  async updateEvent(id: number, input: EventUpdate): Promise<Event_> {
    const index = this._events.findIndex((event) => event.id === id);

    if (index === -1) {
      throw new EventNotFoundError("Event not found");
    }

    // Check for unique Facebook Event URL
    if (input.facebookEventUrl) {
      const existingEvent = this._events.find(
        (e) => e.facebookEventUrl === input.facebookEventUrl && e.id !== id,
      );
      if (existingEvent) {
        throw new EventWithSameFacebookEventUrlAlreadyExistsError(
          "Event with the same Facebook Event URL already exists",
        );
      }
    }

    const updatedEvent = {
      ...this._events[index]!,
      ...input,
    };

    this._events[index] = updatedEvent;
    return updatedEvent;
  }

  /**
   * Deletes an event by id. This will also delete all registrations and event groups for the event.
   *
   * @param id The event id.
   * @throws {EventNotFoundError} If the event is not found.
   */
  async deleteEvent(id: number): Promise<void> {
    const index = this._events.findIndex((event) => event.id === id);

    if (index === -1) {
      throw new EventNotFoundError("Event not found");
    }

    // Remove event
    this._events.splice(index, 1);

    // Remove associated registrations
    this._eventRegistrations = this._eventRegistrations.filter(
      (reg) => reg.eventId !== id,
    );

    // Remove associated event groups
    this._eventGroups = this._eventGroups.filter((eg) => eg.eventId !== id);
  }

  /**
   * Gets the groups associated with an event.
   *
   * @param eventId The event id.
   * @returns The groups associated with the event.
   * @throws {EventNotFoundError} If the event is not found.
   */
  async getEventGroups(eventId: number): Promise<Group[]> {
    const event = await this.getEvent(eventId);

    if (!event) {
      throw new EventNotFoundError("Event not found");
    }

    const groupIds = this._eventGroups
      .filter((eg) => eg.eventId === eventId)
      .map((eg) => eg.groupId);

    const groups = await Promise.all(
      groupIds.map((groupId) => this.groupsRepository.getGroup(groupId)),
    );

    return groups.filter((group): group is Group => group !== undefined);
  }

  /**
   * Adds a group to an event.
   *
   * @param eventId The event id.
   * @param groupId The group id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupAlreadyLinkedToEventError} If the group is already linked to the event.
   */
  async addGroupToEvent(eventId: number, groupId: number): Promise<void> {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new EventNotFoundError(`Event with id ${eventId} not found`);
    }

    const group = await this.groupsRepository.getGroup(groupId);
    if (!group) {
      throw new GroupNotFoundError(`Group with id ${groupId} not found`);
    }

    const existingLink = this._eventGroups.find(
      (eg) => eg.eventId === eventId && eg.groupId === groupId,
    );

    if (existingLink) {
      throw new GroupAlreadyLinkedToEventError(
        `Group with id ${groupId} is already linked to event with id ${eventId}`,
      );
    }

    this._eventGroups.push({ eventId, groupId });
  }

  /**
   * Removes a group from an event.
   *
   * @param eventId The event id.
   * @param groupId The group id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupNotLinkedToEventError} If the group is not linked to the event.
   */
  async removeGroupFromEvent(eventId: number, groupId: number): Promise<void> {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new EventNotFoundError(`Event with id ${eventId} not found`);
    }

    const group = await this.groupsRepository.getGroup(groupId);
    if (!group) {
      throw new GroupNotFoundError(`Group with id ${groupId} not found`);
    }

    const index = this._eventGroups.findIndex(
      (eg) => eg.eventId === eventId && eg.groupId === groupId,
    );

    if (index === -1) {
      throw new GroupNotLinkedToEventError(
        `Group with id ${groupId} is not linked to event with id ${eventId}`,
      );
    }

    this._eventGroups.splice(index, 1);
  }

  /**
   * Gets the registrations for an event.
   *
   * @param eventId The event id.
   * @returns The registrations for the event.
   * @throws {EventNotFoundError} If the event is not found.
   */
  async getRegistrations(eventId: number): Promise<EventRegistration[]> {
    const event = await this.getEvent(eventId);

    if (!event) {
      throw new EventNotFoundError("Event not found");
    }

    return this._eventRegistrations
      .filter((reg) => reg.eventId === eventId)
      .map((reg) => reg.eventRegistration);
  }

  /**
   * Gets a registration for an event.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @returns The registration for the event, or undefined if not found.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   */
  async getRegistration(
    eventId: number,
    memberId: number,
  ): Promise<EventRegistration | undefined> {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new EventNotFoundError("Event not found");
    }

    const member = await this.membersRepository.getMember(memberId);
    if (!member) {
      throw new MemberNotFoundError("Member not found");
    }

    return this._eventRegistrations.find(
      (reg) =>
        reg.eventId === eventId && reg.eventRegistration.memberId === memberId,
    )?.eventRegistration;
  }

  /**
   * Registers a member to an event.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @param date The date for determining the work year.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {WorkyearNotFoundError} If no workyear is found for the given date.
   * @throws {MemberAlreadyRegisteredError} If the member is already registered to the event.
   * @throws {MemberNotEnrolledThisYearError} If the member is not enrolled in the given work year.
   * @throws {MemberNotInGroupError} If the member is not in a group associated with the event.
   */
  async registerToEvent(
    eventId: number,
    memberId: number,
    date: Date,
  ): Promise<void> {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new EventNotFoundError("Event not found");
    }

    const member = await this.membersRepository.getMember(memberId);
    if (!member) {
      throw new MemberNotFoundError("Member not found");
    }

    const existingRegistration = await this.getRegistration(eventId, memberId);
    if (existingRegistration) {
      throw new MemberAlreadyRegisteredError("Member already registered");
    }

    const workyear = await this.workyearsRepository.getWorkyearByDate(date);
    if (!workyear) {
      throw new WorkyearNotFoundError("Work year not found");
    }

    const yearlyMembership =
      await this.yearlyMembershipsRepository.getYearlyMembership(
        memberId,
        workyear.id,
      );

    if (!yearlyMembership) {
      throw new MemberNotEnrolledThisYearError("Member not enrolled");
    }

    const groupsForEvent = await this.getEventGroups(eventId);

    if (groupsForEvent.length !== 0) {
      const isMemberInGroup = groupsForEvent.some(
        (group) => group.id === yearlyMembership.groupId,
      );

      if (!isMemberInGroup) {
        throw new MemberNotInGroupError(
          "Member not in group associated with event",
        );
      }
    }

    this._eventRegistrations.push({
      eventId,
      eventRegistration: {
        memberId,
        paymentReceived: false,
        paymentMethod: null,
        paymentDate: null,
      },
    });
  }

  /**
   * Unregisters a member from an event.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @throws {MemberNotRegisteredError} If the member is not registered to the event.
   */
  async unregisterFromEvent(eventId: number, memberId: number): Promise<void> {
    const registrationIndex = this._eventRegistrations.findIndex(
      (reg) =>
        reg.eventId === eventId && reg.eventRegistration.memberId === memberId,
    );

    if (registrationIndex === -1) {
      throw new MemberNotRegisteredError("Member not registered");
    }

    this._eventRegistrations.splice(registrationIndex, 1);
  }

  /**
   * Marks a registration as paid.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @param paymentMethod The payment method.
   * @throws {MemberNotRegisteredError} If the member is not registered to the event.
   * @throws {MemberAlreadyPaidError} If the member has already paid for the event.
   */
  async markRegistrationAsPaid(
    eventId: number,
    memberId: number,
    paymentMethod: PaymentMethod,
  ): Promise<void> {
    const registration = await this.getRegistration(eventId, memberId);

    if (!registration) {
      throw new MemberNotRegisteredError("Member not registered");
    }

    if (registration.paymentReceived) {
      throw new MemberAlreadyPaidError("Member already paid");
    }

    registration.paymentReceived = true;
    registration.paymentMethod = paymentMethod;
    registration.paymentDate = new Date();
  }

  /**
   * Gets the events for a member.
   *
   * @param memberId The member id.
   * @returns The events for the member.
   * @throws {MemberNotFoundError} If the member is not found.
   */
  async getEventsForMember(memberId: number): Promise<Event_[]> {
    const member = await this.membersRepository.getMember(memberId);
    if (!member) {
      throw new MemberNotFoundError("Member not found");
    }

    const eventIds = this._eventRegistrations
      .filter((reg) => reg.eventRegistration.memberId === memberId)
      .map((reg) => reg.eventId);

    const events = this._events.filter((event) => eventIds.includes(event.id));

    return events;
  }

  /**
   * Gets the events for a group.
   *
   * @param groupId The group id.
   * @returns The events for the group.
   * @throws {GroupNotFoundError} If the group is not found.
   */
  async getEventsForGroup(groupId: number): Promise<Event_[]> {
    const group = await this.groupsRepository.getGroup(groupId);
    if (!group) {
      throw new GroupNotFoundError(`Group with id ${groupId} not found`);
    }

    const eventIds = this._eventGroups
      .filter((eg) => eg.groupId === groupId)
      .map((eg) => eg.eventId);

    const events = this._events.filter((event) => eventIds.includes(event.id));

    return events;
  }

  /**
   * Gets the registration count for an event.
   *
   * @param eventId The event id.
   * @returns The registration count for the event.
   * @throws {EventNotFoundError} If the event is not found.
   */
  async getRegistrationCount(eventId: number): Promise<number> {
    const event = await this.getEvent(eventId);

    if (!event) {
      throw new EventNotFoundError("Event not found");
    }

    return this._eventRegistrations.filter((reg) => reg.eventId === eventId)
      .length;
  }

  /**
   * Gets the paid registrations for an event.
   *
   * @param eventId The event id.
   * @returns The paid registrations for the event.
   * @throws {EventNotFoundError} If the event is not found.
   */
  async getPaidRegistrations(eventId: number): Promise<EventRegistration[]> {
    const event = await this.getEvent(eventId);

    if (!event) {
      throw new EventNotFoundError("Event not found");
    }

    return this._eventRegistrations
      .filter(
        (reg) =>
          reg.eventId === eventId && reg.eventRegistration.paymentReceived,
      )
      .map((reg) => reg.eventRegistration);
  }

  /**
   * Gets the unpaid registrations for an event.
   *
   * @param eventId The event id.
   * @returns The unpaid registrations for the event.
   * @throws {EventNotFoundError} If the event is not found.
   */
  async getUnpaidRegistrations(eventId: number): Promise<EventRegistration[]> {
    const event = await this.getEvent(eventId);

    if (!event) {
      throw new EventNotFoundError("Event not found");
    }

    return this._eventRegistrations
      .filter(
        (reg) =>
          reg.eventId === eventId && !reg.eventRegistration.paymentReceived,
      )
      .map((reg) => reg.eventRegistration);
  }
}
