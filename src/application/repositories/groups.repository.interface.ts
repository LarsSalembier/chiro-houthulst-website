import { type Group, type GroupInsert } from "../models/entities/group";

export interface IGroupsRepository {
  createGroup(group: GroupInsert): Promise<Group>;
  getGroup(groupName: string, workYearId: number): Promise<Group | null>;
  getGroups(workYearId: number): Promise<Group[]>;
  updateGroup(group: Group): Promise<Group>;
}
