"use server";

import { clerkClient } from "@clerk/nextjs/server";

export interface AdminUser {
  firstName: string | null;
  lastName: string | null;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const client = await clerkClient();

    const users = await client.users.getUserList({
      limit: 100,
    });

    return users.data
      .filter(
        (user) => (user.publicMetadata as { role?: string })?.role === "admin",
      )
      .map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
      }));
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
}
