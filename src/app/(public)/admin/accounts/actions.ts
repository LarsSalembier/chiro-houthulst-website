"use server";

import { revalidatePath } from "next/cache";
import { type Role } from "types/globals";
import { deleteUser, setRole } from "~/server/queries/user-queries";

/**
 * Deletes a user, and revalidates the admin accounts page.
 *
 * @param userId The id of the user to delete.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not an admin.
 * @throws If the user could not be deleted.
 */
export async function deleteUserAndRevalidate(userId: string) {
  await deleteUser(userId);

  revalidatePath("/admin/accounts");
}

/**
 * Sets the role of a user, and revalidates the admin accounts page.
 *
 * @param userId The id of the user to set the role for.
 * @param role The role to set.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not an admin.
 * @throws If the role could not be set.
 */
export async function setRoleAndRevalidate(userId: string, role: Role) {
  await setRole(userId, role);

  revalidatePath("/admin/accounts");
}
