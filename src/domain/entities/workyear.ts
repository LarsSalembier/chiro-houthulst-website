import { z } from "zod";

export const workyearSchema = z.object({
  id: z.number().int().positive(),
  startDate: z.date(),
  endDate: z.date(),
  membershipFee: z.number().positive(),
});

export type Workyear = z.infer<typeof workyearSchema>;

export const workyearInsertSchema = workyearSchema.omit({
  id: true,
});

export type WorkyearInsert = z.infer<typeof workyearInsertSchema>;

export type WorkyearUpdate = Partial<WorkyearInsert>;
