import { type db } from "drizzle";

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
