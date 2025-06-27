import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  postgresConnection: postgres.Sql | undefined;
};

const postgresConnection =
  globalForDb.postgresConnection ?? postgres(env.POSTGRES_URL);
if (env.NODE_ENV !== "production")
  globalForDb.postgresConnection = postgresConnection;

export const db = drizzle(postgresConnection, { schema });

export type DatabaseType = typeof db;
export type TransactionType = Parameters<
  Parameters<DatabaseType["transaction"]>[0]
>[0];
