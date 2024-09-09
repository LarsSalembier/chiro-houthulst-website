"use server";

import { getMembersForLoggedInUser } from "~/server/queries/registration-queries";

export async function getMembersForLoggedInUserServer() {
  await getMembersForLoggedInUser();
}
