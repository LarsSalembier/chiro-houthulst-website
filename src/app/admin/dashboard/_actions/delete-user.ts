"use server";

import { checkRole } from "~/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

export async function deleteUser(formData: FormData) {
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await clerkClient.users.deleteUser(
      formData.get("id") as string,
    );
    return { message: res };
  } catch (err) {
    return { message: err };
  }
}
