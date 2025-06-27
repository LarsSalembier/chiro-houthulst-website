"use server";

import { MEMBER_QUERIES } from "~/server/db/queries/member-queries";

export async function getFullMemberDetails(memberId: number) {
  try {
    const member = await MEMBER_QUERIES.getFullMemberDetails(memberId);
    return member;
  } catch (error) {
    console.error("Error fetching member details:", error);
    throw new Error("Failed to fetch member details");
  }
}
