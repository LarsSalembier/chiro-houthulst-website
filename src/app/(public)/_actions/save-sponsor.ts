"use server";

import { db } from "~/server/db";
import { sponsors } from "~/server/db/schema";

type InputData = {
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
};

export async function saveSponsor(data: InputData) {
  await db
    .insert(sponsors)
    .values({
      companyName: data.companyName,
      companyOwnerName: data.companyOwnerName,
      municipality: data.municipality,
      postalCode: data.postalCode,
      street: data.street,
      number: data.number,
      landline: data.landline,
      mobile: data.mobile,
      email: data.email,
      websiteUrl: data.websiteUrl,
      amount: data.amount,
      logoUrl: data.logoUrl,
      paid: data.paid,
      startDate: new Date(2023, 9, 1),
      endDate: new Date(2024, 8, 31),
    })
    .execute();
}
