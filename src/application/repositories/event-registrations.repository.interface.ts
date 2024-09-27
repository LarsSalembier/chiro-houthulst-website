import {
  type EventRegistration,
  type EventRegistrationInsert,
  type EventRegistrationUpdate,
} from "~/domain/entities/event-registration";

/**
 * Repository interface for accessing and managing event registrations.
 */
export interface IEventRegistrationsRepository {
  /**
   * Creates a new event registration.
   *
   * @param eventRegistration - The event registration data to insert.
   * @returns The created event registration.
   *
   * @throws {MemberAlreadyRegisteredForEventError} If the member is already registered for this event.
   * @throws {EventNotFoundError} If the event associated with the registration is not found.
   * @throws {MemberNotFoundError} If the member associated with the registration is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createEventRegistration(
    eventRegistration: EventRegistrationInsert,
  ): Promise<EventRegistration>;

  /**
   * Retrieves an event registration by the event's ID and the member's ID.
   *
   * @param eventId - The ID of the event.
   * @param memberId - The ID of the member.
   * @returns The event registration, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getEventRegistrationByIds(
    eventId: number,
    memberId: number,
  ): Promise<EventRegistration | undefined>;

  /**
   * Retrieves all event registrations.
   *
   * @returns A list of all event registrations.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllEventRegistrations(): Promise<EventRegistration[]>;

  /**
   * Updates an existing event registration.
   *
   * @param eventId - The ID of the event.
   * @param memberId - The ID of the member.
   * @param eventRegistration - The event registration data to apply as updates.
   * @returns The updated event registration.
   *
   * @throws {EventRegistrationNotFoundError} If the event registration is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateEventRegistration(
    eventId: number,
    memberId: number,
    eventRegistration: EventRegistrationUpdate,
  ): Promise<EventRegistration>;

  /**
   * Deletes an event registration.
   *
   * @param eventId - The ID of the event.
   * @param memberId - The ID of the member.
   *
   * @throws {EventRegistrationNotFoundError} If the event registration is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteEventRegistration(eventId: number, memberId: number): Promise<void>;

  /**
   * Deletes all event registrations.
   *
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteAllEventRegistrations(): Promise<void>;
}
