import { z } from "zod";

export const auditActionEnumValues = ["CREATE", "UPDATE", "DELETE"] as const;

export const auditActionEnumSchema = z.enum(auditActionEnumValues);
