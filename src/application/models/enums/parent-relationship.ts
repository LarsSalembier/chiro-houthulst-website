import { z } from "zod";

export const parentRelationshipEnumValues = [
  "MOTHER",
  "FATHER",
  "PLUSMOTHER",
  "PLUSFATHER",
  "GUARDIAN",
] as const;

export const parentRelationshipEnumSchema = z.enum(
  parentRelationshipEnumValues,
);
