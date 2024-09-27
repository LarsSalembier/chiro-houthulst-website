import {
  type Member,
  type MemberInsert,
  type MemberUpdate,
} from "~/domain/entities/member";

/**
 * Repository interface for accessing and managing members.
 */
export interface IMembersRepository {
  /**
   * Creates a new member.
   *
   * @param member - The member data to insert.
   * @returns The created member.
   *
   * @throws {MemberWithThatNameAndBirthDateAlreadyExistsError} If a member with the same name and date of birth already exists.
   * @throws {MemberWithThatEmailAddressAlreadyExistsError} If a member with the same email address already exists.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createMember(member: MemberInsert): Promise<Member>;

  /**
   * Retrieves a member by their unique identifier.
   *
   * @param id - The ID of the member to retrieve.
   * @returns The member matching the given ID, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getMemberById(id: number): Promise<Member | undefined>;

  /**
   * Retrieves a member by their first name, last name, and date of birth.
   *
   * @param firstName - The first name of the member.
   * @param lastName - The last name of the member.
   * @param dateOfBirth - The date of birth of the member.
   * @returns The member matching the given information, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getMemberByNameAndDateOfBirth(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): Promise<Member | undefined>;

  /**
   * Retrieves a member by their unique email address.
   *
   * @param emailAddress - The email address of the member.
   * @returns The member matching the given email address, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getMemberByEmailAddress(emailAddress: string): Promise<Member | undefined>;

  /**
   * Retrieves all members.
   *
   * @returns A list of all members.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllMembers(): Promise<Member[]>;

  /**
   * Retrieves all members linked to a parent.
   *
   * @param parentId - The ID of the parent to retrieve members for.
   * @returns A list of all members linked to the parent.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getMembersForParent(parentId: number): Promise<Member[]>;

  /**
   * Updates an existing member.
   *
   * @param id - The ID of the member to update.
   * @param member - The member data to apply as updates.
   * @returns The updated member.
   *
   * @throws {MemberNotFoundError} If no member with the given ID exists.
   * @throws {MemberWithThatNameAndBirthDateAlreadyExistsError} If a member with the same name and date of birth already exists.
   * @throws {MemberWithThatEmailAddressAlreadyExistsError} If a member with the same email address already exists.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateMember(id: number, member: MemberUpdate): Promise<Member>;

  /**
   * Deletes a member by their unique identifier.
   *
   * @param id - The ID of the member to delete.
   *
   * @throws {MemberNotFoundError} If no member with the given ID exists.
   * @throws {MemberStillReferencedError} If the member is still referenced by other entities and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteMember(id: number): Promise<void>;

  /**
   * Deletes all members.
   *
   * @throws {MemberStillReferencedError} If any member is still referenced by other entities and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  deleteAllMembers(): Promise<void>;

  /**
   * Adds a parent to a member.
   *
   * @param memberId - The ID of the member to add the parent to.
   * @param parentId - The ID of the parent to add to the member.
   * @param isPrimary - Whether the parent is the primary parent of the member.
   *
   * @throws {MemberNotFoundError} If no member with the given ID exists.
   * @throws {ParentNotFoundError} If no parent with the given ID exists.
   * @throws {ParentIsAlreadyLinkedToMemberError} If the parent is already linked to the member.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  addParentToMember(
    memberId: number,
    parentId: number,
    isPrimary: boolean,
  ): Promise<void>;

  /**
   * Removes a parent from a member.
   *
   * @param memberId - The ID of the member to remove the parent from.
   * @param parentId - The ID of the parent to remove from the member.
   *
   * @throws {ParentIsNotLinkedToMemberError} If the parent is not linked to the member.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  removeParentFromMember(memberId: number, parentId: number): Promise<void>;

  /**
   * Removes all parents from a member.
   *
   * @param memberId - The ID of the member to remove all parents from.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  removeAllParentsFromMember(memberId: number): Promise<void>;

  /**
   * Removes all parents from all members.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  removeAllParentsFromAllMembers(): Promise<void>;
}
