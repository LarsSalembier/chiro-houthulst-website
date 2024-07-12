export {};

export type Role = "admin" | "leiding" | "none";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Role;
    };
  }
}
