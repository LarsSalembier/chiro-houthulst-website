import { isLeiding, isLoggedIn } from "~/lib/auth";
import {
  type CreateSponsorData,
  createSponsorSchema,
} from "../schemas/sponsor-schemas";
import { AuthenticationError, AuthorizationError } from "~/lib/errors";
import { db } from "../db";
import { sponsors } from "../db/schema";
import { and, between, eq, gt, isNotNull, lt } from "drizzle-orm";

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
 */
export async function createSponsor(data: CreateSponsorData) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isLeiding()) {
    throw new AuthorizationError();
  }

  createSponsorSchema.parse(data);

  await db
    .insert(sponsors)
    .values({
      ...data,
      startDate: SPONSORSHIP_START_DATE,
      endDate: SPONSORSHIP_END_DATE,
    })
    .execute();
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
      between(sponsors.amount, minAmount, maxAmount),
    ),
  });

  return foundSponsors.map((sponsor) => ({
    ...sponsor,
    logoUrl: sponsor.logoUrl!,
  }));
}
