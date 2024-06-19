"use server";

import { db } from "~/server/db";
import { sponsors } from "~/server/db/schema";

interface SponsorData {
  companyName: string;
  companyOwnerName?: string;
  municipality?: string;
  postalCode?: string;
  street?: string;
  number?: string;
  landline?: string;
  mobile?: string;
  email?: string;
  websiteUrl?: string;
  amount: number;
  logoUrl: string;
  paid: boolean;
}

const SPONSORSHIP_START_DATE = new Date(2023, 9, 1);
const SPONSORSHIP_END_DATE = new Date(2024, 8, 31);

export async function saveSponsor(data: SponsorData) {
  await db
    .insert(sponsors)
    .values({
      ...data,
      startDate: SPONSORSHIP_START_DATE,
      endDate: SPONSORSHIP_END_DATE,
    })
    .execute();
}
