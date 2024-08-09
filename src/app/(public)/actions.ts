"use server";

import { type CreateSponsorData } from "../../server/schemas/sponsor-schemas";
import { revalidatePath } from "next/cache";
import { createSponsor } from "~/server/queries/sponsor-queries";

/**
 * Add a sponsor to the database and revalidate the homepage.
 *
 * @param data The data of the sponsor to add.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws A ZodError if the sponsor data is invalid.
 * @throws If the sponsor could not be added.
 */
export async function addSponsorAndRevalidate(data: CreateSponsorData) {
  await createSponsor(data);

  revalidatePath("/");
}
