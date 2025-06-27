"use server";

import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import { GROUP_QUERIES } from "~/server/db/queries/group-queries";
import { type WorkYear } from "~/server/db/schema";

export async function getGroupsWithMemberCount() {
  try {
    const workYear = await WORK_YEAR_QUERIES.getByDate();

    if (!workYear) {
      return { groups: [], workYear: null };
    }

    const groupsWithCounts = await GROUP_QUERIES.getGroupsWithMemberCount(
      workYear.id,
    );

    return {
      groups: groupsWithCounts,
      workYear,
    };
  } catch (error) {
    console.error("Error getting groups with member count:", error);
    return { groups: [], workYear: null };
  }
}
