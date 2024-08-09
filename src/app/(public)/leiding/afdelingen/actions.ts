"use server";

import { revalidatePath } from "next/cache";
import { toast } from "sonner";
import { createDepartment } from "~/server/queries/department-queries";
import { type CreateDepartmentData } from "~/server/schemas/create-department-schema";
import { AuthenticationError, AuthorizationError } from "~/utils/errors";

/**
 * Add a department to the database and revalidate the departments page. Also
 * shows a toast message on success or error.
 *
 * @param data The data of the department to add.
 */
export async function addDepartmentAndRevalidate(data: CreateDepartmentData) {
  try {
    await createDepartment(data);
    toast.success(`Afdeling ${data.name} succesvol toegevoegd!`);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      toast.error("Je bent niet ingelogd.");
    } else if (error instanceof AuthorizationError) {
      toast.error("Je hebt geen toestemming om een afdeling toe te voegen.");
    } else {
      toast.error(
        `Er is een fout opgetreden bij het toevoegen van afdeling ${data.name}.`,
      );
    }

    console.error(`Error adding department ${data.name}:`, error);
  }

  revalidatePath("/leiding/afdelingen");
}
