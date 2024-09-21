import {
  type ParentUpdate,
  type Parent,
  type ParentInsert,
} from "~/domain/entities/parent";

export interface IParentsRepository {
  /**
   * Creates a new parent.
   *
   * @param parent The parent data to insert.
   * @returns The created parent.
   * @throws {ParentAlreadyExistsError} If a parent with the same email already exists.
   * @throws {AddressNotFoundError} If the address does not exist.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createParent(parent: ParentInsert): Promise<Parent>;

  /**
   * Gets a parent by their ID.
   *
   * @param id The ID of the parent to get.
   * @returns The parent if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getParent(id: number): Promise<Parent | undefined>;

  /**
   * Gets a parent by their email.
   *
   * @param emailAddress The email of the parent to get.
   * @returns The parent if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getParentByEmail(emailAddress: string): Promise<Parent | undefined>;

  /**
   * Updates a parent.
   *
   * @param id The ID of the parent to update.
   * @param parent The parent data to update.
   * @returns The updated parent.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {ParentAlreadyExistsError} If a parent with the new email already exists.
   * @throws {AddressNotFoundError} If the new address does not exist.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  updateParent(id: number, parent: ParentUpdate): Promise<Parent>;

  /**
   * Deletes a parent.
   *
   * @param id The ID of the parent to delete.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {ParentStillReferencedError} If the parent is still referenced by other entities.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteParent(id: number): Promise<void>;

  /**
   * Adds a member to a parent.
   *
   * @param parentId The ID of the parent.
   * @param memberId The ID of the member.
   * @param isPrimary Whether the parent is the primary parent.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {ParentAlreadyLinkedToMemberError} If the parent is already linked to the member.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  addMemberToParent(
    parentId: number,
    memberId: number,
    isPrimary: boolean,
  ): Promise<void>;

  /**
   * Removes a member from a parent.
   *
   * @param parentId The ID of the parent.
   * @param memberId The ID of the member.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  removeMemberFromParent(parentId: number, memberId: number): Promise<void>;

  /**
   * Gets parents associated with a member.
   *
   * @param memberId The ID of the member.
   * @returns An array of parents associated with the member.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getParentsForMember(memberId: number): Promise<Parent[]>;

  /**
   * Gets the primary parent associated with a member.
   *
   * @param memberId The ID of the member.
   * @returns The primary parent associated with the member if found, undefined otherwise.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getPrimaryParentForMember(memberId: number): Promise<Parent | undefined>;
}
