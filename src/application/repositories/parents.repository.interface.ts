import {
  type ParentUpdate,
  type Parent,
  type ParentInsert,
} from "~/domain/entities/parent";

export interface IParentsRepository {
  createParent(parent: ParentInsert): Promise<Parent>;
  getParent(id: number): Promise<Parent | undefined>;
  getParentByEmail(emailAddress: string): Promise<Parent | undefined>;
  updateParent(id: number, parent: ParentUpdate): Promise<Parent>;
  deleteParent(id: number): Promise<void>;
  addMemberToParent(
    parentId: number,
    memberId: number,
    isPrimary: boolean,
  ): Promise<void>;
  removeMemberFromParent(parentId: number, memberId: number): Promise<void>;
  getParentsForMember(memberId: number): Promise<Parent[]>;
  getPrimaryParentForMember(memberId: number): Promise<Parent | undefined>;
}
