import {
  type MemberUpdate,
  type Member,
  type MemberInsert,
} from "~/domain/entities/member";

export interface IMembersRepository {
  /**
   * Creates a new member.
   *
   * @param member The member data to insert.
   * @returns The created member.
   * @throws {MemberAlreadyExistsError} If a member with the same details already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createMember(member: MemberInsert): Promise<Member>;

  /**
   * Gets a member by their ID.
   *
   * @param id The ID of the member to retrieve.
   * @returns The member if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMember(id: number): Promise<Member | undefined>;

  /**
   * Gets a member by their email address.
   *
   * @param emailAddress The email address of the member to retrieve.
   * @returns The member if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMemberByEmail(emailAddress: string): Promise<Member | undefined>;

  /**
   * Gets a member by their first name, last name and date of birth.
   *
   * @param firstName The first name of the member to retrieve.
   * @param lastName The last name of the member to retrieve.
   * @param dateOfBirth The date of birth of the member to retrieve.
   * @returns The member if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMemberByNameAndDateOfBirth(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): Promise<Member | undefined>;

  /**
   * Gets all members.
   *
   * @returns An array of all members.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMembers(): Promise<Member[]>;

  /**
   * Gets members associated with a parent.
   *
   * @param parentId The ID of the parent.
   * @returns An array of members associated with the parent.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMembersForParent(parentId: number): Promise<Member[]>;

  /**
   * Gets members by group and work year.
   *
   * @param groupId The ID of the group.
   * @param workYearId The ID of the work year.
   * @returns An array of members in the specified group and work year.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMembersByGroup(groupId: number, workYearId: number): Promise<Member[]>;

  /**
   * Gets members for a specific work year.
   *
   * @param workYearId The ID of the work year.
   * @returns An array of members for the specified work year.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getMembersForWorkYear(workYearId: number): Promise<Member[]>;

  /**
   * Updates a member.
   *
   * @param id The ID of the member to update.
   * @param member The member data to update.
   * @returns The updated member.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberAlreadyExistsError} If a member with the same email already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  updateMember(id: number, member: MemberUpdate): Promise<Member>;

  /**
   * Deletes a member.
   *
   * @param id The ID of the member to delete.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberStillReferencedError} If the member is still referenced by other entities.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteMember(id: number): Promise<void>;

  /**
   * Adds a parent to a member.
   *
   * @param memberId The ID of the member.
   * @param parentId The ID of the parent.
   * @param isPrimary Whether the parent is the primary parent.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {ParentAlreadyLinkedToMemberError} If the parent is already linked to the member.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  addParentToMember(
    memberId: number,
    parentId: number,
    isPrimary: boolean,
  ): Promise<void>;

  /**
   * Removes a parent from a member.
   *
   * @param memberId The ID of the member.
   * @param parentId The ID of the parent.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  removeParentFromMember(memberId: number, parentId: number): Promise<void>;
}
