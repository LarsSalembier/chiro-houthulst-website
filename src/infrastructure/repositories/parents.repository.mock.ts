import { injectable } from "inversify";
import { type IParentsRepository } from "~/application/repositories/parents.repository.interface";
import {
  type Parent,
  type ParentInsert,
  type ParentUpdate,
} from "~/domain/entities/parent";
import {
  ParentAlreadyExistsError,
  ParentAlreadyLinkedToMemberError,
  ParentNotFoundError,
  ParentNotLinkedToMemberError,
  ParentStillReferencedError,
} from "~/domain/errors/parents";
import { MemberNotFoundError } from "~/domain/errors/members";
import { AddressNotFoundError } from "~/domain/errors/addresses";
import { type IAddressesRepository } from "~/application/repositories/addresses.repository.interface";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";

interface MemberParentLink {
  memberId: number;
  parentId: number;
  isPrimary: boolean;
}

@injectable()
export class MockParentsRepository implements IParentsRepository {
  private _parents = new Map<number, Parent>();
  private _nextParentId = 1;
  private _memberParentLinks: MemberParentLink[] = [];
  private _parentReferences = new Map<number, number>(); // parentId -> reference count

  constructor(
    private readonly addressesRepository: IAddressesRepository,
    private readonly membersRepository: IMembersRepository,
  ) {}

  /**
   * Creates a new parent.
   *
   * @param parent The parent data to insert.
   * @returns The created parent.
   * @throws {ParentAlreadyExistsError} If a parent with the same email already exists.
   * @throws {AddressNotFoundError} If the address does not exist.
   */
  async createParent(parent: ParentInsert): Promise<Parent> {
    // Ensure the address exists
    const addressExists = await this.addressesRepository.getAddressById(
      parent.addressId,
    );

    if (!addressExists) {
      throw new AddressNotFoundError("Address not found");
    }

    // Check for existing parent with the same email
    for (const existingParent of this._parents.values()) {
      if (existingParent.emailAddress === parent.emailAddress) {
        throw new ParentAlreadyExistsError(
          "Parent with the same email already exists",
        );
      }
    }

    const newParent: Parent = {
      ...parent,
      id: this._nextParentId++,
    };

    this._parents.set(newParent.id, newParent);
    this._parentReferences.set(newParent.id, 0); // Initialize reference count

    return newParent;
  }

  /**
   * Gets a parent by their ID.
   *
   * @param id The ID of the parent to get.
   * @returns The parent if found, undefined otherwise.
   */
  async getParent(id: number): Promise<Parent | undefined> {
    return this._parents.get(id);
  }

  /**
   * Gets a parent by their email.
   *
   * @param emailAddress The email of the parent to get.
   * @returns The parent if found, undefined otherwise.
   */
  async getParentByEmail(emailAddress: string): Promise<Parent | undefined> {
    for (const parent of this._parents.values()) {
      if (parent.emailAddress === emailAddress) {
        return parent;
      }
    }
    return undefined;
  }

  /**
   * Updates a parent.
   *
   * @param id The ID of the parent to update.
   * @param parent The parent data to update.
   * @returns The updated parent.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {ParentAlreadyExistsError} If a parent with the new email already exists.
   * @throws {AddressNotFoundError} If the new address does not exist.
   */
  async updateParent(id: number, parent: ParentUpdate): Promise<Parent> {
    const existingParent = this._parents.get(id);
    if (!existingParent) {
      throw new ParentNotFoundError("Parent not found");
    }

    // If email is being updated, check for uniqueness
    if (
      parent.emailAddress &&
      parent.emailAddress !== existingParent.emailAddress
    ) {
      for (const otherParent of this._parents.values()) {
        if (
          otherParent.emailAddress === parent.emailAddress &&
          otherParent.id !== id
        ) {
          throw new ParentAlreadyExistsError(
            "Parent with the new email already exists",
          );
        }
      }
    }

    // If addressId is being updated, ensure the address exists
    if (parent.addressId && parent.addressId !== existingParent.addressId) {
      const addressExists = await this.addressesRepository.getAddressById(
        parent.addressId,
      );
      if (!addressExists) {
        throw new AddressNotFoundError("Address not found");
      }
    }

    const updatedParent: Parent = {
      ...existingParent,
      ...parent,
      name: {
        ...existingParent.name,
        ...parent.name,
      },
    };

    this._parents.set(id, updatedParent);
    return updatedParent;
  }

  /**
   * Deletes a parent.
   *
   * @param id The ID of the parent to delete.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {ParentStillReferencedError} If the parent is still referenced by other entities.
   */
  async deleteParent(id: number): Promise<void> {
    const existingParent = this._parents.get(id);
    if (!existingParent) {
      throw new ParentNotFoundError("Parent not found");
    }

    const referenceCount = this._parentReferences.get(id) ?? 0;
    if (referenceCount > 0) {
      throw new ParentStillReferencedError(
        "Parent is still referenced by other entities",
      );
    }

    // Check if parent is linked to any members
    const isLinked = this._memberParentLinks.some(
      (link) => link.parentId === id,
    );
    if (isLinked) {
      throw new ParentStillReferencedError("Parent is still linked to members");
    }

    this._parents.delete(id);
    this._parentReferences.delete(id);
  }

  /**
   * Adds a member to a parent.
   *
   * @param parentId The ID of the parent.
   * @param memberId The ID of the member.
   * @param isPrimary Whether the parent is the primary parent.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {ParentAlreadyLinkedToMemberError} If the parent is already linked to the member.
   */
  async addMemberToParent(
    parentId: number,
    memberId: number,
    isPrimary: boolean,
  ): Promise<void> {
    const parent = this._parents.get(parentId);
    if (!parent) {
      throw new ParentNotFoundError("Parent not found");
    }

    const memberExists = await this.membersRepository.getMember(memberId);
    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const existingLink = this._memberParentLinks.find(
      (link) => link.parentId === parentId && link.memberId === memberId,
    );
    if (existingLink) {
      throw new ParentAlreadyLinkedToMemberError(
        "Parent is already linked to the member",
      );
    }

    // If isPrimary is true, unset any existing primary parent for the member
    if (isPrimary) {
      this._memberParentLinks = this._memberParentLinks.map((link) => {
        if (link.memberId === memberId && link.isPrimary) {
          return { ...link, isPrimary: false };
        }
        return link;
      });
    }

    this._memberParentLinks.push({ parentId, memberId, isPrimary });

    // Optionally increment reference count if needed
    const count = this._parentReferences.get(parentId) ?? 0;
    this._parentReferences.set(parentId, count + 1);
  }

  /**
   * Removes a member from a parent.
   *
   * @param parentId The ID of the parent.
   * @param memberId The ID of the member.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {ParentNotLinkedToMemberError} If the parent is not linked to the member.
   */
  async removeMemberFromParent(
    parentId: number,
    memberId: number,
  ): Promise<void> {
    const parent = this._parents.get(parentId);
    if (!parent) {
      throw new ParentNotFoundError("Parent not found");
    }

    const memberExists = await this.membersRepository.getMember(memberId);
    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const linkIndex = this._memberParentLinks.findIndex(
      (link) => link.parentId === parentId && link.memberId === memberId,
    );
    if (linkIndex === -1) {
      throw new ParentNotLinkedToMemberError(
        "Parent is not linked to the member",
      );
    }

    this._memberParentLinks.splice(linkIndex, 1);

    // Optionally decrement reference count
    const count = this._parentReferences.get(parentId) ?? 0;
    if (count > 0) {
      this._parentReferences.set(parentId, count - 1);
    }
  }

  /**
   * Gets parents associated with a member.
   *
   * @param memberId The ID of the member.
   * @returns An array of parents associated with the member.
   * @throws {MemberNotFoundError} If the member is not found.
   */
  async getParentsForMember(memberId: number): Promise<Parent[]> {
    const memberExists = await this.membersRepository.getMember(memberId);
    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const parentIds = this._memberParentLinks
      .filter((link) => link.memberId === memberId)
      .map((link) => link.parentId);

    const parents = parentIds
      .map((parentId) => this._parents.get(parentId))
      .filter((parent): parent is Parent => parent !== undefined);

    return parents;
  }

  /**
   * Gets the primary parent associated with a member.
   *
   * @param memberId The ID of the member.
   * @returns The primary parent associated with the member if found, undefined otherwise.
   * @throws {MemberNotFoundError} If the member is not found.
   */
  async getPrimaryParentForMember(
    memberId: number,
  ): Promise<Parent | undefined> {
    const memberExists = await this.membersRepository.getMember(memberId);
    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const primaryLink = this._memberParentLinks.find(
      (link) => link.memberId === memberId && link.isPrimary,
    );

    if (!primaryLink) {
      return undefined;
    }

    const parent = this._parents.get(primaryLink.parentId);
    return parent;
  }

  /**
   * Sets a parent as the primary parent for a member.
   *
   * @param parentId The ID of the parent.
   * @param memberId The ID of the member.
   * @throws {ParentNotFoundError} If the parent is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {ParentNotLinkedToMemberError} If the parent is not linked to the member.
   */
  async setPrimaryParentForMember(
    parentId: number,
    memberId: number,
  ): Promise<void> {
    const parent = this._parents.get(parentId);
    if (!parent) {
      throw new ParentNotFoundError("Parent not found");
    }

    const memberExists = await this.membersRepository.getMember(memberId);
    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const linkIndex = this._memberParentLinks.findIndex(
      (link) => link.parentId === parentId && link.memberId === memberId,
    );
    if (linkIndex === -1) {
      throw new ParentNotLinkedToMemberError(
        "Parent is not linked to the member",
      );
    }

    // Unset existing primary parent
    this._memberParentLinks = this._memberParentLinks.map((link) => {
      if (link.memberId === memberId) {
        return { ...link, isPrimary: false };
      }
      return link;
    });

    // Set the specified parent as primary
    this._memberParentLinks[linkIndex]!.isPrimary = true;
  }

  /**
   * Increments the reference count for a parent.
   *
   * @param parentId The parent id.
   * @throws {ParentNotFoundError} If the parent is not found.
   */
  async incrementReference(parentId: number): Promise<void> {
    const parent = this._parents.get(parentId);
    if (!parent) {
      throw new ParentNotFoundError(`Parent with id ${parentId} not found`);
    }

    const count = this._parentReferences.get(parentId) ?? 0;
    this._parentReferences.set(parentId, count + 1);
  }

  /**
   * Decrements the reference count for a parent.
   *
   * @param parentId The parent id.
   * @throws {ParentNotFoundError} If the parent is not found.
   */
  async decrementReference(parentId: number): Promise<void> {
    const parent = this._parents.get(parentId);
    if (!parent) {
      throw new ParentNotFoundError(`Parent with id ${parentId} not found`);
    }

    const count = this._parentReferences.get(parentId) ?? 0;
    if (count > 0) {
      this._parentReferences.set(parentId, count - 1);
    }
  }
}
