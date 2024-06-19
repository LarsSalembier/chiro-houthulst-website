import { and, between, gte, isNotNull, lte } from "drizzle-orm";
import { db } from "~/server/db";
import { sponsors } from "~/server/db/schema";

export default async function getSponsorsWithLogo(
  minAmount: number,
  maxAmount: number,
) {
  return await db.query.sponsors.findMany({
    where: and(
      between(sponsors.amount, minAmount, maxAmount),
      isNotNull(sponsors.logoUrl),
    ),
  });
}
