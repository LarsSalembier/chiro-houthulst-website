"use server";

import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import {
  type FullNewMemberData,
  MEMBER_MUTATIONS,
} from "~/server/db/queries/member-queries";
import { GROUP_QUERIES } from "~/server/db/queries/group-queries";
import { type WorkYear, type Group, type Gender } from "~/server/db/schema";

export async function getCurrentWorkYear(): Promise<WorkYear | null> {
  try {
    return await WORK_YEAR_QUERIES.getByDate();
  } catch (error) {
    console.error("Error getting current work year:", error);
    return null;
  }
}

export async function registerNewMember(memberData: FullNewMemberData) {
  try {
    return await MEMBER_MUTATIONS.registerMember(memberData);
  } catch (error) {
    console.error("Error registering member:", error);
    throw error;
  }
}

export async function findGroupForMember(
  dateOfBirth: Date,
  gender: Gender,
): Promise<Group | null> {
  try {
    return await GROUP_QUERIES.findGroupForMember(dateOfBirth, gender);
  } catch (error) {
    console.error("Error finding group for member:", error);
    return null;
  }
}
