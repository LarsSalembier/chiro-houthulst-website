import { connection, db } from "drizzle";
import { migrate } from "drizzle-orm/postgres-js/migrator";

await migrate(db, { migrationsFolder: "./drizzle/migrations/" });

await connection.end();
