"use server";

import { hasRole } from "~/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { type Role } from "types/globals";

interface DeleteUserResponse {
  success: boolean;
  message?: string;
}

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
  if (!hasRole("admin")) {
    return { success: false, message: "Not Authorized" };
  }

  try {
    await clerkClient.users.deleteUser(userId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message:
        "Er is een fout opgetreden bij het verwijderen van de gebruiker.",
    };
  }
}

interface SetRoleResponse {
  success: boolean;
  role?: Role;
  message?: string;
}

export async function setRole(
  userId: string,
  role: Role,
): Promise<SetRoleResponse> {
  if (!hasRole("admin")) {
    return { success: false, message: "Not Authorized" };
  }
  try {
    const res = await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
    });

    return { success: true, role: res.publicMetadata.role as Role };
  } catch (error) {
    console.error("Error setting user role:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het instellen van de rol.",
    };
  }
}