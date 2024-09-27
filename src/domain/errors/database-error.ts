import { isRecord } from "~/application/utilities/is-record";
import { type PostgresErrorCode } from "../enums/postgres-error-code";

export interface DatabaseError {
  code: PostgresErrorCode;
  detail: string;
  table: string;
  column?: string;
  constraint: string;
}

export function isDatabaseError(error: unknown): error is DatabaseError {
  if (!isRecord(error)) {
    return false;
  }
  const { code, detail, table } = error;
  return Boolean(code && detail && table);
}
