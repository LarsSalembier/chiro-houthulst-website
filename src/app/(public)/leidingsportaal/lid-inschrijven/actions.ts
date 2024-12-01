"use server";

import { type Gender } from "~/types/enums/gender";
import { getGroupsForDateOfBirthAndGender } from "~/services/groups";

export async function getGroups(birthDate: Date, gender: Gender) {
  return await getGroupsForDateOfBirthAndGender(birthDate, gender);
}
