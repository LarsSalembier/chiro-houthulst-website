import { type Member, type MemberInsert } from "../models/entities/member";

export interface IMembersRepository {
  createMember(member: MemberInsert): Promise<Member>;
  getMember(memberId: number): Promise<Member>;
  getMemberByEmail(email: string): Promise<Member>;
  getMembersByParentEmail(email: string): Promise<Member[]>;
  getMembersByGroup(groupName: string, workYearId: number): Promise<Member[]>;
  getMembers(workYearId: number): Promise<Member[]>;
  updateMember(member: Member): Promise<Member>;
}
