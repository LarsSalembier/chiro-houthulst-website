"use server";

import { checkRole } from "~/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

type UserRole = "user" | "admin";

interface SetRoleResponse {
  success: boolean;
  role?: UserRole;
  message?: string;
}

export default async function setRole(
  userId: string,
  role: UserRole,
): Promise<SetRoleResponse> {
  if (!checkRole("admin")) {
    return { success: false, message: "Not Authorized" };
  }
  try {
    const res = await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
    });

    return { success: true, role: res.publicMetadata.role as UserRole };
  } catch (error) {
    console.error("Error setting user role:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het instellen van de rol.",
    };
  }
}
