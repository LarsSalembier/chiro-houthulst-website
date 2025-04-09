import { and, eq, isNull } from "drizzle-orm";
import { addresses, type NewAddress, type Address } from "~/server/db/schema";
import { db, type TransactionType } from "../db";

export const ADDRESS_QUERIES = {
  findById: async (id: number): Promise<Address | null> => {
    const result = await db.query.addresses.findFirst({
      where: eq(addresses.id, id),
    });
    return result ?? null;
  },

  findByDetails: async (details: NewAddress): Promise<Address | null> => {
    const result = await db.query.addresses.findFirst({
      where: and(
        eq(addresses.street, details.street),
        eq(addresses.houseNumber, details.houseNumber),
        eq(addresses.municipality, details.municipality),
        eq(addresses.postalCode, details.postalCode),
        details.box ? eq(addresses.box, details.box) : isNull(addresses.box),
      ),
    });
    return result ?? null;
  },
};

export const ADDRESS_MUTATIONS = {
  findOrCreate: async (
    data: NewAddress,
    tx: TransactionType,
  ): Promise<Address> => {
    const existing = await tx.query.addresses.findFirst({
      where: and(
        eq(addresses.street, data.street),
        eq(addresses.houseNumber, data.houseNumber),
        eq(addresses.municipality, data.municipality),
        eq(addresses.postalCode, data.postalCode),
        data.box ? eq(addresses.box, data.box) : isNull(addresses.box),
      ),
    });

    if (existing) {
      return existing;
    }

    const [newAddress] = await tx
      .insert(addresses)
      .values(data)
      .returning()
      .execute();

    if (!newAddress) {
      throw new Error("Failed to create address");
    }

    return newAddress;
  },

  remove: async (id: number, tx: TransactionType): Promise<void> => {
    await tx.delete(addresses).where(eq(addresses.id, id)).execute();
  },
};
