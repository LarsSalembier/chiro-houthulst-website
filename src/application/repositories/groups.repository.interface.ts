import {
  type Group,
  type GroupInsert,
  type GroupUpdate,
} from "~/domain/entities/group";

/**
 * Repository interface for accessing and managing groups.
 */
export interface IGroupsRepository {
  /**
   * Creates a new group.
   *
   * @param group - The group data to insert.
   * @returns The created group.
   *
   * @throws {GroupWithThatNameAlreadyExistsError} If a group with the same name already exists.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createGroup(group: GroupInsert): Promise<Group>;

  /**
   * Retrieves a group by its unique identifier.
   *
   * @param id - The ID of the group to retrieve.
   * @returns The group matching the given ID, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getGroupById(id: number): Promise<Group | undefined>;

  /**
   * Retrieves a group by its unique name.
   *
   * @param name - The name of the group to retrieve.
   * @returns The group matching the given name, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getGroupByName(name: string): Promise<Group | undefined>;

  /**
   * Retrieves all groups.
   *
   * @returns A list of all groups.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllGroups(): Promise<Group[]>;

  /**
   * Retrieves all groups linked to an event.
   *
   * @param eventId - The ID of the event to retrieve groups for.
   * @returns A list of all groups linked to the event.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getGroupsByEventId(eventId: number): Promise<Group[]>;

  /**
   * Updates an existing group.
   *
   * @param id - The ID of the group to update.
   * @param group - The group data to apply as updates.
   * @returns The updated group.
   *
   * @throws {GroupNotFoundError} If no group with the given ID exists.
   * @throws {GroupWithThatNameAlreadyExistsError} If the updated group name would create a duplicate.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateGroup(id: number, group: GroupUpdate): Promise<Group>;

  /**
   * Deletes a group by its unique identifier.
   *
   * @param id - The ID of the group to delete.
   *
   * @throws {GroupNotFoundError} If no group with the given ID exists.
   * @throws {GroupStillReferencedError} If the group is still referenced by other entities and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteGroup(id: number): Promise<void>;

  /**
   * Deletes all groups.
   *
   * @throws {GroupStillReferencedError} If any group is still referenced by other entities and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  deleteAllGroups(): Promise<void>;
}
