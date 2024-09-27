import {
  type Parent,
  type ParentInsert,
  type ParentUpdate,
} from "~/domain/entities/parent";

/**
 * Repository interface for accessing and managing parents.
 */
export interface IParentsRepository {
  /**
   * Creates a new parent.
   *
   * @param parent - The parent data to insert.
   * @returns The created parent.
   *
   * @throws {ParentWithThatEmailAddressAlreadyExistsError} If a parent with the same email address already exists.
   * @throws {AddressNotFoundError} If the address associated with the parent is not found.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createParent(parent: ParentInsert): Promise<Parent>;

  /**
   * Retrieves a parent by their unique identifier.
   *
   * @param id - The ID of the parent to retrieve.
   * @returns The parent matching the given ID, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getParentById(id: number): Promise<Parent | undefined>;

  /**
   * Retrieves a parent by their unique email address.
   *
   * @param emailAddress - The email address of the parent.
   * @returns The parent matching the given email address, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getParentByEmailAddress(emailAddress: string): Promise<Parent | undefined>;

  /**
   * Retrieves all parents.
   *
   * @returns A list of all parents.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllParents(): Promise<Parent[]>;

  /**
   * Retrieves all parents for a specific member.
   *
   * @param memberId - The ID of the member to retrieve parents for.
   * @returns A list of all parents for the given member, along with a flag indicating if they are the primary parent.
   *
   * @throws {ParentNotFoundError} If a certain parent that should exist is not found.
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getParentsForMember(memberId: number): Promise<
    {
      parent: Parent;
      isPrimary: boolean;
    }[]
  >;

  /**
   * Updates an existing parent.
   *
   * @param id - The ID of the parent to update.
   * @param parent - The parent data to apply as updates.
   * @returns The updated parent.
   *
   * @throws {ParentNotFoundError} If no parent with the given ID exists.
   * @throws {AddressNotFoundError} If the updated address associated with the parent is not found.
   * @throws {ParentWithThatEmailAddressAlreadyExistsError} If a parent with the same email address already exists.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateParent(id: number, parent: ParentUpdate): Promise<Parent>;

  /**
   * Deletes a parent by their unique identifier.
   *
   * @param id - The ID of the parent to delete.
   *
   * @throws {ParentNotFoundError} If no parent with the given ID exists.
   * @throws {ParentStillReferencedError} If the parent is still referenced by other entities (e.g., members_parents table) and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteParent(id: number): Promise<void>;

  /**
   * Deletes all parents.
   *
   * @throws {ParentStillReferencedError} If any parent is still referenced by other entities (e.g., members_parents table) and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteAllParents(): Promise<void>;
}
