import {
  type MemberUpdate,
  type Member,
  type MemberInsert,
} from "~/domain/entities/member";

export interface IMembersRepository {
  createMember(member: MemberInsert): Promise<Member>;
  getMember(id: number): Promise<Member | undefined>;
  getMemberByEmail(emailAddress: string): Promise<Member | undefined>;
  getMembersForParent(parentId: number): Promise<Member[]>;
  getMembersByGroup(groupId: number, workYearId: number): Promise<Member[]>;
  getMembers(): Promise<Member[]>;
  getMembersForWorkYear(workYearId: number): Promise<Member[]>;
  updateMember(id: number, member: MemberUpdate): Promise<Member>;
  deleteMember(id: number): Promise<void>;
  addParentToMember(
    memberId: number,
    parentId: number,
    isPrimary: boolean,
  ): Promise<void>;
  removeParentFromMember(memberId: number, parentId: number): Promise<void>;
}
