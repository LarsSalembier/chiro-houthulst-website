"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { departments } from "~/server/db/schema";

interface DepartmentData {
  name: string;
  color?: string;
  mascotImageUrl?: string;
  description?: string;
}

export async function addDepartment(data: DepartmentData) {
  const loggedInUser = await currentUser();

  if (!loggedInUser) {
    throw new Error(
      "Je moet ingelogd zijn als leiding om een afdeling toe te voegen.",
    );
  }

  await db
    .insert(departments)
    .values({
      ...data,
      createdBy: loggedInUser.id,
    })
    .execute();
}
