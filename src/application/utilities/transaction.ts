import { type db } from "~/server/db";

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
