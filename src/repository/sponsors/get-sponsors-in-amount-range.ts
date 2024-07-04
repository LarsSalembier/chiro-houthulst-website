import "server-only";

import { and, between, eq, gt, isNotNull, lt } from "drizzle-orm";
import { db } from "~/server/db";
import { type Sponsor, sponsors } from "~/server/db/schema";

/**
 * Maps a sponsor to a sponsor DTO.
 *
 * @param sponsor The sponsor to map.
 *
 * @returns The sponsor DTO.
 * @throws If the sponsor does not have a logo URL.
 */
function toDtoMapper(sponsor: Sponsor) {
  if (!sponsor.logoUrl) {
    throw new Error("Sponsor should have a logo URL");
  }

  return {
    id: sponsor.id,
    companyName: sponsor.companyName,
    websiteUrl: sponsor.websiteUrl,
    logoUrl: sponsor.logoUrl,
  };
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
export async function getSponsorsInAmountRange(
  minAmount: number,
  maxAmount: number,
) {
  const foundSponsors = await db.query.sponsors.findMany({
    where: and(
      isNotNull(sponsors.logoUrl),
      eq(sponsors.paid, true),
      lt(sponsors.startDate, new Date()),
      gt(sponsors.endDate, new Date()),
      between(sponsors.amount, minAmount, maxAmount),
    ),
  });

  return foundSponsors.map(toDtoMapper);
}
