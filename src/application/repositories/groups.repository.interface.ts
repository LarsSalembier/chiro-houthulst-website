import {
  type GroupUpdate,
  type Group,
  type GroupInsert,
} from "~/domain/entities/group";
import { type Gender } from "~/domain/enums/gender";

export interface IGroupsRepository {
  /**
   * Creates a new group.
   *
   * @param group The group data to insert.
   * @returns The created group.
   * @throws {GroupNameAlreadyExistsError} If a group with the same name already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createGroup(group: GroupInsert): Promise<Group>;

  /**
   * Returns a group by id, or undefined if not found.
   *
   * @param id The group id.
   * @returns The group, or undefined if not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getGroup(id: number): Promise<Group | undefined>;

  /**
   * Returns a group by name, or undefined if not found.
   *
   * @param groupName The group name.
   * @returns The group, or undefined if not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getGroupByName(groupName: string): Promise<Group | undefined>;

  /**
   * Returns all groups.
   *
   * @returns All groups.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getGroups(): Promise<Group[]>;

  /**
   * Returns all active groups.
   *
   * @returns All active groups.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getActiveGroups(): Promise<Group[]>;

  /**
   * Returns all active groups a member can be registered in for the given birth date and gender.
   *
   * @param birthDate The member's birth date.
   * @param gender The member's gender.
   * @returns All groups for the given birth date.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getActiveGroupsForBirthDateAndGender(
    birthDate: Date,
    gender: Gender,
  ): Promise<Group[]>;

  /**
   * Updates a group by name.
   *
   * @param id The group id.
   * @param group The group data to update.
   * @returns The updated group.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupNameAlreadyExistsError} If a group with the same name already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  updateGroup(id: number, group: GroupUpdate): Promise<Group>;

  /**
   * Deletes a group by name.
   *
   * @param id The group id.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupIsStillReferencedError} If the group is still referenced.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteGroup(id: number): Promise<void>;

  /**
   * Checks if a group is active.
   *
   * @param id The group id.
   * @returns True if the group is active, false otherwise.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  isGroupActive(id: number): Promise<boolean>;

  /**
   * Gets the amount of members in a group.
   *
   * @param groupId The group id.
   * @param workYearId The workyear id.
   * @returns The amount of members in the group.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMembersCount(groupId: number, workYearId: number): Promise<number>;
}
