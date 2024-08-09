"use server";

import { revalidatePath } from "next/cache";
import { toast } from "sonner";
import { type Role } from "types/globals";
import { deleteUser, setRole } from "~/server/queries/user-queries";
import { AuthenticationError, AuthorizationError } from "~/utils/errors";

/**
 * Deletes a user, and revalidates the admin accounts page. Also shows a toast
 * message on success or error.
 *
 * @param userId The id of the user to delete.
 */
export async function deleteUserAndRevalidate(userId: string) {
  try {
    await deleteUser(userId);
    toast.success("Gebruiker succesvol verwijderd.");
  } catch (error) {
    if (error instanceof AuthorizationError) {
      toast.error("Je hebt geen toestemming om deze gebruiker te verwijderen.");
    } else if (error instanceof AuthenticationError) {
      toast.error("Je bent niet ingelogd.");
    } else {
      toast.error(
        "Er is een fout opgetreden bij het verwijderen van de gebruiker.",
      );
    }

    console.error(`Error deleting user ${userId}:`, error);
  }

  revalidatePath("/admin/accounts");
}

/**
 * Sets the role of a user, and revalidates the admin accounts page. Also shows
 * a toast message on success or error.
 *
 * @param userId The id of the user to set the role for.
 * @param role The role to set.
 */
export async function setRoleAndRevalidate(userId: string, role: Role) {
  try {
    await setRole(userId, role);
    toast.success(`Rol succesvol gewijzigd naar ${role}`);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      toast.error(
        `Je hebt geen toestemming om de rol van deze gebruiker te wijzigen naar ${role}.`,
      );
    } else if (error instanceof AuthenticationError) {
      toast.error("Je bent niet ingelogd.");
    } else {
      toast.error(
        `Er is een fout opgetreden bij het wijzigen van de rol naar ${role}.`,
      );
    }

    console.error(`Error setting role for user ${userId}:`, error);
  }

  revalidatePath("/admin/accounts");
}
