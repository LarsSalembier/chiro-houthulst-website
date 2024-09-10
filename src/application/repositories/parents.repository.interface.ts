import { type Parent, type ParentInsert } from "../models/entities/parent";

export interface IParentsRepository {
  createParent(parent: ParentInsert): Promise<Parent>;
  getParent(emailAddress: string): Promise<Parent | null>;
  getParentsForMember(memberId: number): Promise<Parent[]>;
  updateParent(parent: Parent): Promise<Parent>;
}
