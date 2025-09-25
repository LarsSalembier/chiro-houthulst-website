"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "~/lib/auth";
import {
  WORK_YEAR_QUERIES,
  WORK_YEAR_MUTATIONS,
} from "~/server/db/queries/work-year-queries";
import {
  GROUP_QUERIES,
  GROUP_MUTATIONS,
} from "~/server/db/queries/group-queries";
import type { NewWorkYear, WorkYear, Group } from "~/server/db/schema";

export interface UserWithRole {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: Array<{
    emailAddress: string;
  }>;
  publicMetadata: {
    role?: string;
  };
  createdAt: Date;
}

export async function getAllUsers(): Promise<UserWithRole[]> {
  // Ensure the current user is an admin
  await requireAdminAuth();

  try {
    const client = await clerkClient();

    const users = await client.users.getUserList({
      limit: 100,
      orderBy: "-created_at",
    });

    return users.data.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses.map((email) => ({
        emailAddress: email.emailAddress,
      })),
      publicMetadata: {
        role: (user.publicMetadata as { role?: string })?.role,
      },
      createdAt: new Date(user.createdAt),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function updateUserRole(
  userId: string,
  role: "leiding" | "admin" | null,
) {
  // Ensure the current user is an admin
  await requireAdminAuth();

  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        role: role,
      },
    });

    revalidatePath("/leidingsportaal/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
}

export async function canRemoveSelfAsAdmin(): Promise<boolean> {
  // Ensure the current user is an admin
  await requireAdminAuth();

  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({
      limit: 100,
    });

    const adminUsers = users.data.filter(
      (u) => (u.publicMetadata as { role?: string })?.role === "admin",
    );

    // Can only remove self if there are other admin users
    return adminUsers.length > 1;
  } catch (error) {
    console.error("Error checking admin count:", error);
    return false;
  }
}

export async function removeSelfAsAdmin() {
  // Ensure the current user is an admin
  const { user } = await requireAdminAuth();

  // Check if this is the last admin
  const canRemove = await canRemoveSelfAsAdmin();
  if (!canRemove) {
    throw new Error(
      "Cannot remove yourself as admin - you are the last admin user",
    );
  }

  try {
    const client = await clerkClient();
    await client.users.updateUser(user.id, {
      publicMetadata: {
        role: null,
      },
    });

    revalidatePath("/leidingsportaal/admin");
    return { success: true };
  } catch (error) {
    console.error("Error removing self as admin:", error);
    throw new Error("Failed to remove yourself as admin");
  }
}

export async function removeSelfAsAdminAction() {
  "use server";

  try {
    await removeSelfAsAdmin();
    redirect("/leidingsportaal");
  } catch (error) {
    console.error("Error in removeSelfAsAdminAction:", error);
    throw error;
  }
}

export async function getAllWorkYears(): Promise<WorkYear[]> {
  await requireAdminAuth();

  try {
    return await WORK_YEAR_QUERIES.getAll("desc");
  } catch (error) {
    console.error("Error fetching work years:", error);
    throw new Error("Failed to fetch work years");
  }
}

export async function getCurrentWorkYear(): Promise<WorkYear | null> {
  await requireAdminAuth();

  try {
    return await WORK_YEAR_QUERIES.getCurrent();
  } catch (error) {
    console.error("Error fetching current work year:", error);
    throw new Error("Failed to fetch current work year");
  }
}

export async function createWorkYear(
  data: NewWorkYear & { groupStatuses?: Record<number, boolean> },
): Promise<WorkYear> {
  await requireAdminAuth();

  try {
    const newWorkYear = await WORK_YEAR_MUTATIONS.create(data);

    // Update group statuses if provided
    if (data.groupStatuses) {
      for (const [groupId, isActive] of Object.entries(data.groupStatuses)) {
        await GROUP_MUTATIONS.setActiveStatus(parseInt(groupId), isActive);
      }
    }

    revalidatePath("/leidingsportaal/admin");
    return newWorkYear;
  } catch (error) {
    console.error("Error creating work year:", error);
    throw error;
  }
}

export async function updateWorkYear(
  id: number,
  data: Partial<NewWorkYear>,
): Promise<WorkYear | null> {
  await requireAdminAuth();

  try {
    const updatedWorkYear = await WORK_YEAR_MUTATIONS.update(id, data);
    revalidatePath("/leidingsportaal/admin");
    return updatedWorkYear;
  } catch (error) {
    console.error("Error updating work year:", error);
    throw error;
  }
}

export async function endWorkYear(
  id: number,
  endDate: Date,
): Promise<WorkYear | null> {
  await requireAdminAuth();

  try {
    const endedWorkYear = await WORK_YEAR_MUTATIONS.endWorkYear(id, endDate);
    revalidatePath("/leidingsportaal/admin");
    return endedWorkYear;
  } catch (error) {
    console.error("Error ending work year:", error);
    throw error;
  }
}

export async function removeWorkYear(id: number): Promise<void> {
  await requireAdminAuth();

  try {
    await WORK_YEAR_MUTATIONS.remove(id);
    revalidatePath("/leidingsportaal/admin");
  } catch (error) {
    console.error("Error removing work year:", error);
    throw error;
  }
}

export async function getAllGroups(): Promise<Group[]> {
  await requireAdminAuth();

  try {
    return await GROUP_QUERIES.getAll();
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw new Error("Failed to fetch groups");
  }
}
