import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IMembersRepository } from "~/application/repositories/members.repository.interface";
import { Member, MemberInsert, MemberUpdate } from "~/domain/entities/member";
import {
  MemberNotFoundError,
  MemberStillReferencedError,
  MemberWithThatEmailAddressAlreadyExistsError,
  MemberWithThatNameAndBirthDateAlreadyExistsError,
  ParentIsAlreadyLinkedToMemberError,
  ParentIsNotLinkedToMemberError,
} from "~/domain/errors/members";
import { ParentNotFoundError } from "~/domain/errors/parents";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockMembersRepository implements IMembersRepository {
  private members: Member[] = mockData.members;
  private membersParents: {
    memberId: number;
    parentId: number;
    isPrimary: boolean;
  }[] = mockData.parentMembers;
  private autoIncrementId: number =
    this.members.reduce((maxId, member) => {
      return member.id > maxId ? member.id : maxId;
    }, 0) + 1;

  private isMemberReferenced(memberId: number): boolean {
    const emergencyContactWithMemberExists = mockData.emergencyContacts.some(
      (ec) => ec.memberId === memberId,
    );

    const eventRegistrationWithMemberExists = mockData.eventRegistrations.some(
      (er) => er.memberId === memberId,
    );

    const medicalInformationWithMemberExists = mockData.medicalInformation.some(
      (mi) => mi.memberId === memberId,
    );

    const yearlyMembershipWithMemberExists = mockData.yearlyMemberships.some(
      (ym) => ym.memberId === memberId,
    );

    const memberParentWithMemberExists = this.membersParents.some(
      (mp) => mp.memberId === memberId,
    );

    return (
      emergencyContactWithMemberExists ||
      eventRegistrationWithMemberExists ||
      medicalInformationWithMemberExists ||
      yearlyMembershipWithMemberExists ||
      memberParentWithMemberExists
    );
  }

  async createMember(member: MemberInsert): Promise<Member> {
    return startSpan({ name: "MockMembersRepository > createMember" }, () => {
      const existingMemberWithBirthDateAndName = this.members.find(
        (m) =>
          m.name.firstName.toLowerCase() ===
            member.name.firstName.toLowerCase() &&
          m.name.lastName.toLowerCase() ===
            member.name.lastName.toLowerCase() &&
          m.dateOfBirth.getTime() === member.dateOfBirth.getTime(),
      );
      if (existingMemberWithBirthDateAndName) {
        throw new MemberWithThatNameAndBirthDateAlreadyExistsError(
          "A member with the same name and date of birth already exists",
        );
      }

      const existingMemberWithEmailAddress = this.members.find(
        (m) =>
          m.emailAddress?.toLowerCase() === member.emailAddress?.toLowerCase(),
      );
      if (existingMemberWithEmailAddress) {
        throw new MemberWithThatEmailAddressAlreadyExistsError(
          "A member with the same email address already exists",
        );
      }

      const newMember: Member = {
        id: this.autoIncrementId++,
        ...member,
      };
      this.members.push(newMember);
      return newMember;
    });
  }

  async getMemberById(id: number): Promise<Member | undefined> {
    return startSpan({ name: "MockMembersRepository > getMemberById" }, () => {
      return this.members.find((m) => m.id === id);
    });
  }

  async getMemberByNameAndDateOfBirth(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
  ): Promise<Member | undefined> {
    return startSpan(
      { name: "MockMembersRepository > getMemberByNameAndDateOfBirth" },
      () => {
        return this.members.find(
          (m) =>
            m.name.firstName.toLowerCase() === firstName.toLowerCase() &&
            m.name.lastName.toLowerCase() === lastName.toLowerCase() &&
            m.dateOfBirth.getTime() === dateOfBirth.getTime(),
        );
      },
    );
  }

  async getMemberByEmailAddress(
    emailAddress: string,
  ): Promise<Member | undefined> {
    return startSpan(
      { name: "MockMembersRepository > getMemberByEmailAddress" },
      () => {
        return this.members.find(
          (m) => m.emailAddress?.toLowerCase() === emailAddress.toLowerCase(),
        );
      },
    );
  }

  async getAllMembers(): Promise<Member[]> {
    return startSpan({ name: "MockMembersRepository > getAllMembers" }, () => {
      return this.members;
    });
  }

  async getMembersForParent(parentId: number): Promise<Member[]> {
    return startSpan(
      { name: "MockMembersRepository > getMembersForParent" },
      () => {
        const memberIds = this.membersParents
          .filter((mp) => mp.parentId === parentId)
          .map((mp) => mp.memberId);

        return this.members.filter((m) => memberIds.includes(m.id));
      },
    );
  }

  async updateMember(id: number, member: MemberUpdate): Promise<Member> {
    return startSpan({ name: "MockMembersRepository > updateMember" }, () => {
      const existingMemberIndex = this.members.findIndex((m) => m.id === id);
      if (existingMemberIndex === -1) {
        throw new MemberNotFoundError("Member not found");
      }

      const existingMemberWithBirthDateAndName = this.members.find(
        (m) =>
          m.name.firstName.toLowerCase() ===
            member.name?.firstName?.toLowerCase() &&
          m.name.lastName.toLowerCase() ===
            member.name?.lastName?.toLowerCase() &&
          m.dateOfBirth.getTime() === member.dateOfBirth?.getTime() &&
          m.id !== id,
      );
      if (existingMemberWithBirthDateAndName) {
        throw new MemberWithThatNameAndBirthDateAlreadyExistsError(
          "A member with the same name and date of birth already exists",
        );
      }

      const existingMemberWithEmailAddress = this.members.find(
        (m) =>
          m.emailAddress?.toLowerCase() ===
            member.emailAddress?.toLowerCase() && m.id !== id,
      );
      if (existingMemberWithEmailAddress) {
        throw new MemberWithThatEmailAddressAlreadyExistsError(
          "A member with the same email address already exists",
        );
      }

      this.members[existingMemberIndex] = {
        ...this.members[existingMemberIndex]!,
        ...member,
        name: {
          firstName:
            member.name?.firstName ??
            this.members[existingMemberIndex]!.name.firstName,
          lastName:
            member.name?.lastName ??
            this.members[existingMemberIndex]!.name.lastName,
        },
      };

      return this.members[existingMemberIndex];
    });
  }

  async deleteMember(id: number): Promise<void> {
    return startSpan({ name: "MockMembersRepository > deleteMember" }, () => {
      if (this.isMemberReferenced(id)) {
        throw new MemberStillReferencedError("Member still referenced");
      }

      const memberIndex = this.members.findIndex((m) => m.id === id);
      if (memberIndex === -1) {
        throw new MemberNotFoundError("Member not found");
      }
      this.members.splice(memberIndex, 1);
    });
  }

  async deleteAllMembers(): Promise<void> {
    return startSpan(
      { name: "MockMembersRepository > deleteAllMembers" },
      () => {
        if (this.members.some((member) => this.isMemberReferenced(member.id))) {
          throw new MemberStillReferencedError("Member still referenced");
        }

        this.members = [];
      },
    );
  }

  async addParentToMember(
    memberId: number,
    parentId: number,
    isPrimary = false,
  ): Promise<void> {
    return startSpan(
      { name: "MockMembersRepository > addParentToMember" },
      () => {
        const existingMember = this.members.find((m) => m.id === memberId);
        if (!existingMember) {
          throw new MemberNotFoundError("Member not found");
        }

        const existingParent = mockData.parents.find((p) => p.id === parentId);
        if (!existingParent) {
          throw new ParentNotFoundError("Parent not found");
        }

        const existingParentLink = this.membersParents.find(
          (mp) => mp.memberId === memberId && mp.parentId === parentId,
        );
        if (existingParentLink) {
          throw new ParentIsAlreadyLinkedToMemberError(
            "Parent is already linked to member",
          );
        }

        this.membersParents.push({ memberId, parentId, isPrimary });
      },
    );
  }

  async removeParentFromMember(
    memberId: number,
    parentId: number,
  ): Promise<void> {
    return startSpan(
      { name: "MockMembersRepository > removeParentFromMember" },
      () => {
        const existingParentLinkIndex = this.membersParents.findIndex(
          (mp) => mp.memberId === memberId && mp.parentId === parentId,
        );
        if (existingParentLinkIndex === -1) {
          throw new ParentIsNotLinkedToMemberError(
            "Parent is not linked to member",
          );
        }

        this.membersParents.splice(existingParentLinkIndex, 1);
      },
    );
  }

  async removeAllParentsFromMember(memberId: number): Promise<void> {
    return startSpan(
      { name: "MockMembersRepository > removeAllParentsFromMember" },
      () => {
        this.membersParents = this.membersParents.filter(
          (mp) => mp.memberId !== memberId,
        );
      },
    );
  }

  async removeAllParentsFromAllMembers(): Promise<void> {
    return startSpan(
      { name: "MockMembersRepository > removeAllParentsFromAllMembers" },
      () => {
        this.membersParents = [];
      },
    );
  }
}
