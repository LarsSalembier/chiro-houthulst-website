import {
  type EventUpdate,
  type Event_,
  type EventInsert,
} from "~/domain/entities/event";
import { type Group } from "~/domain/entities/group";
import { type PaymentMethod } from "~/domain/enums/payment-method";
import { type EventRegistration } from "~/domain/value-objects/event-registration";

export interface IEventsRepository {
  /**
   * Creates an event.
   *
   * @param event The event insert input.
   * @returns The created event.
   * @throws {EventWithSameFacebookEventUrlAlreadyExistsError} If an event with the same Facebook Event URL already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createEvent(event: EventInsert): Promise<Event_>;

  /**
   * Returns an event by id, or undefined if not found.
   *
   * @param id The event id.
   * @returns The event, or undefined if not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getEvent(id: number): Promise<Event_ | undefined>;

  /**
   * Returns all events.
   *
   * @returns All events.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getEvents(): Promise<Event_[]>;

  /**
   * Updates an event by id.
   *
   * @param id The event id.
   * @param input The event update input.
   * @returns The updated event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {EventWithSameFacebookEventUrlAlreadyExistsError} If an event with the same Facebook Event URL already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  updateEvent(id: number, event: EventUpdate): Promise<Event_>;

  /**
   * Deletes an event by id. This will also delete all registrations for the event.
   *
   * @param id The event id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteEvent(id: number): Promise<void>;

  /**
   * Gets the groups associated with an event.
   *
   * @param eventId The event id.
   * @returns The groups associated with the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getEventGroups(eventId: number): Promise<Group[]>;

  /**
   * Adds a group to an event.
   *
   * @param eventId The event id.
   * @param groupId The group id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupAlreadyLinkedToEventError} If the group is already linked to the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  addGroupToEvent(eventId: number, groupId: number): Promise<void>;

  /**
   * Removes a group from an event.
   *
   * @param eventId The event id.
   * @param groupId The group id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupNotLinkedToEventError} If the group is not linked to the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  removeGroupFromEvent(eventId: number, groupId: number): Promise<void>;

  /**
   * Gets the registrations for an event.
   *
   * @param eventId The event id.
   * @returns The registrations for the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getRegistrations(eventId: number): Promise<EventRegistration[]>;

  /**
   * Gets a registration for an event.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @returns The registration for the event, or undefined if not found.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getRegistration(
    eventId: number,
    memberId: number,
  ): Promise<EventRegistration | undefined>;

  /**
   * Gets the paid registrations for an event.
   * @param eventId The event id.
   * @returns The paid registrations for the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getPaidRegistrations(eventId: number): Promise<EventRegistration[]>;

  /**
   * Gets the unpaid registrations for an event.
   *
   * @param eventId The event id.
   * @returns The unpaid registrations for the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getUnpaidRegistrations(eventId: number): Promise<EventRegistration[]>;

  /**
   * Registers a member to an event.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @param workYearId The id of the work year the member is enrolled in.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {WorkyearNotFoundError} If no workyear is found for the given date.
   * @throws {MemberAlreadyRegisteredError} If the member is already registered to the event.
   * @throws {MemberNotEnrolledThisYearError} If the member is not enrolled in the given work year.
   * @throws {MemberNotInGroupError} If the member is not in a group associated with the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  registerToEvent(eventId: number, memberId: number, date: Date): Promise<void>;

  /**
   * Unregisters a member from an event.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberNotRegisteredError} If the member is not registered to the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  unregisterFromEvent(eventId: number, memberId: number): Promise<void>;

  /**
   * Marks a registration as paid.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @param paymentMethod The payment method.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberNotRegisteredError} If the member is not registered to the event.
   * @throws {MemberAlreadyPaidError} If the member has already paid for the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  markRegistrationAsPaid(
    eventId: number,
    memberId: number,
    paymentMethod: PaymentMethod,
  ): Promise<void>;

  /**
   * Gets the events for a member.
   *
   * @param memberId The member id.
   * @returns The events for the member.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getEventsForMember(memberId: number): Promise<Event_[]>;

  /**
   * Gets the events for a group.
   *
   * @param groupId The group id.
   * @returns The events for the group.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {DatabaseOperationError} If the operation fails
   */
  getEventsForGroup(groupId: number): Promise<Event_[]>;

  /**
   * Gets the registration count for an event.
   *
   * @param eventId The event id.
   * @returns The registration count for the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getRegistrationCount(eventId: number): Promise<number>;
}
