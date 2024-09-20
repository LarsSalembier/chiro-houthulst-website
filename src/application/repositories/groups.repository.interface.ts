import {
  type GroupUpdate,
  type Group,
  type GroupInsert,
} from "~/domain/entities/group";
import { type Gender } from "~/domain/enums/gender";

export interface IGroupsRepository {
  createGroup(group: GroupInsert): Promise<Group>;
  getGroup(id: number): Promise<Group | undefined>;
  getGroupByName(groupName: string): Promise<Group | undefined>;
  getGroups(): Promise<Group[]>;
  getActiveGroups(): Promise<Group[]>;
  getActiveGroupsForBirthDateAndGender(
    birthDate: Date,
    gender: Gender,
  ): Promise<Group[]>;
  updateGroup(id: number, group: GroupUpdate): Promise<Group>;
  deleteGroup(id: number): Promise<void>;
  isGroupActive(id: number): Promise<boolean>;
  getMembersCount(groupId: number, workYearId: number): Promise<number>;
}
