"use server";

import { checkRole } from "~/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

interface DeleteUserResponse {
  success: boolean;
  message?: string;
}

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
  if (!checkRole("admin")) {
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
