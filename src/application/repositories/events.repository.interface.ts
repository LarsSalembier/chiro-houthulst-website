import {
  type Event_,
  type EventInsert,
  type EventUpdate,
} from "~/domain/entities/event";

/**
 * Repository interface for accessing and managing events.
 */
export interface IEventsRepository {
  /**
   * Creates a new event.
   *
   * @param event - The event data to insert.
   * @returns The created event.
   *
   * @throws {EventWithSameFacebookEventUrlAlreadyExistsError} If an event with the same Facebook event URL already exists.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createEvent(event: EventInsert): Promise<Event_>;

  /**
   * Retrieves an event by its unique identifier.
   *
   * @param id - The ID of the event to retrieve.
   * @returns The event matching the given ID, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getEventById(id: number): Promise<Event_ | undefined>;

  /**
   * Retrieves all events.
   *
   * @returns A list of all events.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllEvents(): Promise<Event_[]>;

  /**
   * Get all events that are linked to a group.
   *
   * @param groupId - The ID of the group to get events for.
   * @returns A list of all events linked to the group.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getEventsByGroupId(groupId: number): Promise<Event_[]>;

  /**
   * Updates an existing event.
   *
   * @param id - The ID of the event to update.
   * @param event - The event data to apply as updates.
   * @returns The updated event.
   *
   * @throws {EventNotFoundError} If no event with the given ID exists.
   * @throws {EventWithSameFacebookEventUrlAlreadyExistsError} If an event with the same Facebook event URL already exists.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateEvent(id: number, event: EventUpdate): Promise<Event_>;

  /**
   * Deletes an event by its unique identifier.
   *
   * @param id - The ID of the event to delete.
   *
   * @throws {EventNotFoundError} If no event with the given ID exists.
   * @throws {EventStillReferencedError} If the event is still referenced by other entities (e.g., event_groups, event_registrations tables) and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteEvent(id: number): Promise<void>;

  /**
   * Deletes all events.
   *
   * @throws {EventStillReferencedError} If any event is still referenced by other entities (e.g., event_groups, event_registrations tables) and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  deleteAllEvents(): Promise<void>;

  /**
   * Adds a group to an event.
   *
   * @param eventId - The ID of the event to add the group to.
   * @param groupId - The ID of the group to add to the event.
   *
   * @throws {EventNotFoundError} If no event with the given ID exists.
   * @throws {GroupNotFoundError} If no group with the given ID exists.
   * @throws {GroupAlreadyLinkedToEventError} If the group is already linked to the event.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  addGroupToEvent(eventId: number, groupId: number): Promise<void>;

  /**
   * Removes a group from an event.
   *
   * @param eventId - The ID of the event to remove the group from.
   * @param groupId - The ID of the group to remove from the event.
   *
   * @throws {GroupNotLinkedToEventError} If the group is not linked to the event.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  removeGroupFromEvent(eventId: number, groupId: number): Promise<void>;

  /**
   * Removes all groups from an event.
   *
   * @param eventId - The ID of the event to remove all groups from.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  removeAllGroupsFromEvent(eventId: number): Promise<void>;

  /**
   * Removes all groups from all events.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  removeAllGroupsFromAllEvents(): Promise<void>;
}
