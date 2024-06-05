import { and, gte, isNotNull, lte } from "drizzle-orm";
import { db } from "~/server/db";
import { sponsors } from "~/server/db/schema";

export default async function getSponsorsWithLogo(
  startAmount: number,
  endAmount: number,
) {
  return await db.query.sponsors.findMany({
    where: and(
      gte(sponsors.amount, startAmount),
      lte(sponsors.amount, endAmount),
      isNotNull(sponsors.logoUrl),
    ),
  });
}
