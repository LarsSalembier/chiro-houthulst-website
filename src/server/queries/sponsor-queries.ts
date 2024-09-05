import { isLeiding, isLoggedIn } from "~/lib/auth";
import {
  type CreateSponsorData,
  createSponsorSchema,
  type UpdateSponsorData,
} from "../schemas/sponsor-schemas";
import { AuthenticationError, AuthorizationError } from "~/lib/errors";
import { db } from "../db";
import { auditLogs, sponsors } from "../db/schema";
import { and, eq, gt, isNotNull, lt } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

const SPONSORSHIP_START_DATE = new Date(2023, 9, 1);
const SPONSORSHIP_END_DATE = new Date(2024, 8, 31);

/**
 * Create a new sponsor.
 *
 * @param data The sponsor data.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not an admin.
 * @throws A ZodError if the sponsor data is invalid.
 * @throws If the sponsor could not be added.
 *
 * @returns The newly created sponsor.
 */
export async function createSponsor(data: CreateSponsorData) {
  if (!isLoggedIn()) throw new AuthenticationError();
  if (!isLeiding()) throw new AuthorizationError();

  createSponsorSchema.parse(data);

  const newSponsor = await db.transaction(async (tx) => {
    const [sponsor] = await tx
      .insert(sponsors)
      .values({
        ...data,
        amount: data.amount.toFixed(2),
        startDate: SPONSORSHIP_START_DATE,
        endDate: SPONSORSHIP_END_DATE,
      })
      .returning();

    if (!sponsor) return;

    await tx.insert(auditLogs).values({
      tableName: "sponsors",
      recordId: sponsor.id,
      action: "INSERT",
      newValues: JSON.stringify(sponsor),
      userId: auth().userId!,
      timestamp: new Date(),
    });

    return sponsor;
  });

  return newSponsor;
}

/**
 * Update a sponsor.
 *
 * @param id The id of the sponsor to update.
 * @param data The new sponsor data.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not an admin.
 * @throws A ZodError if the sponsor data is invalid.
 * @throws If the sponsor could not be updated.
 *
 * @returns The updated sponsor.
 */
export async function updateSponsor(id: number, data: UpdateSponsorData) {
  if (!isLoggedIn()) throw new AuthenticationError();
  if (!isLeiding()) throw new AuthorizationError();

  const updatedSponsor = await db.transaction(async (tx) => {
    const [oldSponsor] = await tx
      .select()
      .from(sponsors)
      .where(eq(sponsors.id, id));
    const [sponsor] = await tx
      .update(sponsors)
      .set({
        ...data,
        amount: data.amount.toFixed(2),
      })
      .where(eq(sponsors.id, id))
      .returning();

    await tx.insert(auditLogs).values({
      tableName: "sponsors",
      recordId: id,
      action: "UPDATE",
      oldValues: JSON.stringify(oldSponsor),
      newValues: JSON.stringify(sponsor),
      userId: auth().userId!,
      timestamp: new Date(),
    });

    return sponsor;
  });

  return updatedSponsor;
}

/**
 * Delete a sponsor.
 *
 * @param id The id of the sponsor to delete.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not an admin.
 * @throws If the sponsor could not be deleted.
 */
export async function deleteSponsor(id: number) {
  if (!isLoggedIn()) throw new AuthenticationError();
  if (!isLeiding()) throw new AuthorizationError();

  await db.transaction(async (tx) => {
    const [oldSponsor] = await tx
      .select()
      .from(sponsors)
      .where(eq(sponsors.id, id));
    await tx.delete(sponsors).where(eq(sponsors.id, id));

    await tx.insert(auditLogs).values({
      tableName: "sponsors",
      recordId: id,
      action: "DELETE",
      oldValues: JSON.stringify(oldSponsor),
      userId: auth().userId!,
      timestamp: new Date(),
    });
  });
}

/**
 * Get sponsors in a certain amount range.
 *
 * @param minAmount The minimum amount.
 * @param maxAmount The maximum amount.
 *
 * @returns The sponsors that adhere to the following additional conditions:
 * - The sponsor has a logo URL.
 * - The sponsor has paid.
 * - The sponsor's start date is in the past.
 * - The sponsor's end date is in the future.
 * - The sponsor's amount is between the min and max amount.
 */
export async function getSponsors(minAmount: number, maxAmount: number) {
  const foundSponsors = await db.query.sponsors.findMany({
    where: and(
      isNotNull(sponsors.logoUrl),
      eq(sponsors.paid, true),
      lt(sponsors.startDate, new Date()),
      gt(sponsors.endDate, new Date()),
    ),
  });

  return foundSponsors
    .filter(
      (sponsor) =>
        Number(sponsor.amount) >= minAmount &&
        Number(sponsor.amount) <= maxAmount,
    )
    .map((sponsor) => ({
      ...sponsor,
      logoUrl: sponsor.logoUrl!,
    }));
}
