import pg from "postgres";

export function isForeignKeyViolationError(error: unknown): boolean {
  return error instanceof pg.PostgresError && error.code === "23503";
}

export function isUniqueViolationError(error: unknown): boolean {
  return error instanceof pg.PostgresError && error.code === "23505";
}
