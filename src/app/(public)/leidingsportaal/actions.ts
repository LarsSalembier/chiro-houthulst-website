"use server";

import { revalidatePath } from "next/cache";
import { type WorkyearInsert } from "~/domain/entities/workyear";
import { createWorkyearUseCase } from "~/application/use-cases/create-workyear.use-case";
import { withServerActionInstrumentation } from "@sentry/nextjs";
import { createGroupUseCase } from "~/application/use-cases/create-group.use-case";
import { type GroupFormValues } from "./nieuwe-groep-toevoegen/add-group-form";

export async function createWorkyear(workYearData: WorkyearInsert) {
  return await withServerActionInstrumentation(
    "createWorkyear",
    { recordResponse: true },
    async () => {
      const result = await createWorkyearUseCase({ workYearData });

      console.log("Test");
      revalidatePath("/leidingsportaal");

      return result;
    },
  );
}

export async function createGroup(groupData: GroupFormValues) {
  return await withServerActionInstrumentation(
    "createGroup",
    { recordResponse: true },
    async () => {
      const result = await createGroupUseCase({
        groupData: {
          ...groupData,
          description: groupData.description ?? null,
          gender: groupData.gender ?? null,
          color: groupData.color ?? null,
          maximumAgeInDays: groupData.maximumAgeInDays ?? null,
          mascotImageUrl: groupData.mascotImageUrl ?? null,
          coverImageUrl: groupData.coverImageUrl ?? null,
        },
      });

      revalidatePath("/leidingsportaal");

      return result;
    },
  );
}

import { getMembersUseCase } from "~/application/use-cases/get-members.use-case";
import { getMembersByGroupUseCase } from "~/application/use-cases/get-members-by-group.use-case";

export async function getMembers() {
  return await withServerActionInstrumentation(
    "getMembers",
    { recordResponse: true },
    async () => {
      const result = await getMembersUseCase();
      return result;
    },
  );
}

import { getGroupsUseCase } from "~/application/use-cases/get-groups.use-case";

export async function getGroups() {
  return await withServerActionInstrumentation(
    "getGroups",
    { recordResponse: true },
    async () => {
      const result = await getGroupsUseCase();
      return result;
    },
  );
}

export async function getMembersForGroup(groupId: number) {
  return await withServerActionInstrumentation(
    "getMembersForGroup",
    { recordResponse: true },
    async () => {
      const result = await getMembersByGroupUseCase({
        groupId,
      });
      return result;
    },
  );
}
