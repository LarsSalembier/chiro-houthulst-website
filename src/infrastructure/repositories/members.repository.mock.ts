import { injectable } from "inversify";
import { type IMembersRepository } from "~/application/repositories/members.repository.interface";
import {
  type MemberUpdate,
  type Member,
  type MemberInsert,
} from "~/domain/entities/member";
import {
  MemberAlreadyExistsError,
  MemberNotFoundError,
  MemberStillReferencedError,
} from "~/domain/errors/members";
import {
  ParentAlreadyLinkedToMemberError,
  ParentNotLinkedToMemberError,
  ParentNotFoundError,
} from "~/domain/errors/parents";

@injectable()
export class MockMembersRepository implements IMembersRepository {
  private _members: Member[] = [];
  private _nextId = 1;
  private _memberParentLinks: {
    memberId: number;
    parentId: number;
    isPrimary: boolean;
  }[] = [];
  private _memberGroupLinks: {
    memberId: number;
    groupId: number;
    workYearId: number;
  }[] = [];

  async createMember(member: MemberInsert): Promise<Member> {
    // Check if member already exists
    const existingMember = this._members.find(
      (m) =>
        m.name.firstName === member.name.firstName &&
        m.name.lastName === member.name.lastName &&
        m.dateOfBirth.getTime() === member.dateOfBirth.getTime(),
    );
    if (existingMember) {
      throw new MemberAlreadyExistsError(
        "Member with the same details already exists",
      );
    }

    // Check if email address is unique
    if (
      member.emailAddress &&
      this._members.some((m) => m.emailAddress === member.emailAddress)
    ) {
      throw new MemberAlreadyExistsError(
        "Member with the same email address already exists",
      );
    }

    const newMember: Member = {
      ...member,
      id: this._nextId++,
    };
    this._members.push(newMember);
    return newMember;
  }

  async getMember(id: number): Promise<Member | undefined> {
    return this._members.find((member) => member.id === id);
  }

  async getMemberByEmail(emailAddress: string): Promise<Member | undefined> {
    return this._members.find((member) => member.emailAddress === emailAddress);
  }

  async getMemberByNameAndDateOfBirth(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): Promise<Member | undefined> {
    return this._members.find(
      (member) =>
        member.name.firstName === firstName &&
        member.name.lastName === lastName &&
        member.dateOfBirth.getTime() === dateOfBirth.getTime(),
    );
  }

  async getMembers(): Promise<Member[]> {
    return this._members;
  }

  async getMembersForParent(parentId: number): Promise<Member[]> {
    const memberIds = this._memberParentLinks
      .filter((link) => link.parentId === parentId)
      .map((link) => link.memberId);
    return this._members.filter((member) => memberIds.includes(member.id));
  }

  async getMembersByGroup(
    groupId: number,
    workYearId: number,
  ): Promise<Member[]> {
    const memberIds = this._memberGroupLinks
      .filter(
        (link) => link.groupId === groupId && link.workYearId === workYearId,
      )
      .map((link) => link.memberId);
    return this._members.filter((member) => memberIds.includes(member.id));
  }

  async getMembersForWorkYear(workYearId: number): Promise<Member[]> {
    const memberIds = this._memberGroupLinks
      .filter((link) => link.workYearId === workYearId)
      .map((link) => link.memberId);
    return this._members.filter((member) => memberIds.includes(member.id));
  }

  async updateMember(id: number, member: MemberUpdate): Promise<Member> {
    const index = this._members.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new MemberNotFoundError("Member not found");
    }

    // Check if member already exists
    const uniqueCombination = {
      firstName: member.name?.firstName ?? this._members[index]!.name.firstName,
      lastName: member.name?.lastName ?? this._members[index]!.name.lastName,
      dateOfBirth:
        member.dateOfBirth ?? this._members[index]!.dateOfBirth.getTime(),
    };

    const existingMember = this._members.find(
      (m) =>
        m.id !== id &&
        m.name.firstName === uniqueCombination.firstName &&
        m.name.lastName === uniqueCombination.lastName &&
        m.dateOfBirth.getTime() === uniqueCombination.dateOfBirth,
    );

    if (existingMember) {
      throw new MemberAlreadyExistsError(
        "Member with the same details already exists",
      );
    }

    if (
      member.emailAddress &&
      this._members.some(
        (m) => m.id !== id && m.emailAddress === member.emailAddress,
      )
    ) {
      throw new MemberAlreadyExistsError(
        "Member with the same email address already exists",
      );
    }

    this._members[index] = {
      ...this._members[index]!,
      ...member,
      name: {
        ...this._members[index]!.name,
        ...member.name,
      },
    };

    return this._members[index];
  }

  async deleteMember(id: number): Promise<void> {
    const index = this._members.findIndex((member) => member.id === id);
    if (index === -1) {
      throw new MemberNotFoundError("Member not found");
    }

    // Check if member is still referenced
    if (
      this._memberParentLinks.some((link) => link.memberId === id) ||
      this._memberGroupLinks.some((link) => link.memberId === id)
    ) {
      throw new MemberStillReferencedError(
        "Failed to delete member due to foreign key constraint",
      );
    }

    this._members.splice(index, 1);
  }

  async addParentToMember(
    memberId: number,
    parentId: number,
    isPrimary: boolean,
  ): Promise<void> {
    const memberExists = this._members.some((m) => m.id === memberId);
    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const parentExists = this._memberParentLinks.some(
      (link) => link.parentId === parentId,
    );
    if (!parentExists) {
      throw new ParentNotFoundError("Parent not found");
    }

    const linkExists = this._memberParentLinks.some(
      (link) => link.memberId === memberId && link.parentId === parentId,
    );
    if (linkExists) {
      throw new ParentAlreadyLinkedToMemberError(
        "Parent is already linked to the member",
      );
    }

    this._memberParentLinks.push({
      memberId,
      parentId,
      isPrimary,
    });
  }

  async removeParentFromMember(
    memberId: number,
    parentId: number,
  ): Promise<void> {
    const memberExists = this._members.some((m) => m.id === memberId);
    if (!memberExists) {
      throw new MemberNotFoundError("Member not found");
    }

    const parentExists = this._memberParentLinks.some(
      (link) => link.parentId === parentId,
    );
    if (!parentExists) {
      throw new ParentNotFoundError("Parent not found");
    }

    const index = this._memberParentLinks.findIndex(
      (link) => link.memberId === memberId && link.parentId === parentId,
    );
    if (index === -1) {
      throw new ParentNotLinkedToMemberError(
        "Parent is not linked to the member",
      );
    }

    this._memberParentLinks.splice(index, 1);
  }
}
