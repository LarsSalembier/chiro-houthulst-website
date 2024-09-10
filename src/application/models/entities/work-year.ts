import { z } from "zod";

export const workYearSchema = z.object({
  id: z.number().int().positive(),
  startDate: z.date(),
  endDate: z.date(),
  membershipFee: z.number(),
});

export type WorkYear = z.infer<typeof workYearSchema>;

export const workYearInsertSchema = workYearSchema.omit({
  id: true,
});

export type WorkYearInsert = z.infer<typeof workYearInsertSchema>;
