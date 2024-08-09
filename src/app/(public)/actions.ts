"use server";

import { type CreateSponsorData } from "../../server/schemas/create-sponsor-schema";
import { toast } from "sonner";
import { AuthenticationError, AuthorizationError } from "~/utils/errors";
import { revalidatePath } from "next/cache";
import { createSponsor } from "~/server/queries/sponsor-queries";

/**
 * Add a sponsor to the database and revalidate the homepage. Also
 * shows a toast message on success or error.
 *
 * @param data The data of the sponsor to add.
 */
export async function addSponsorAndRevalidate(data: CreateSponsorData) {
  try {
    await createSponsor(data);
    toast.success(`Sponsor ${data.companyName} succesvol toegevoegd!`);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      toast.error("Je bent niet ingelogd.");
    } else if (error instanceof AuthorizationError) {
      toast.error("Je hebt geen toestemming om een sponsor toe te voegen.");
    } else {
      toast.error(
        `Er is een fout opgetreden bij het toevoegen van sponsor ${data.companyName}.`,
      );
    }

    console.error(`Error adding sponsor ${data.companyName}:`, error);
  }

  revalidatePath("/");
}
