import { startSpan } from "@sentry/nextjs";
import { getActiveGroupsForBirthDateAndGenderUseCase } from "~/application/use-cases/groups/get-active-groups-for-bithdate-and-gender.use-case";
import { type Group } from "~/domain/entities/group";
import { type Gender } from "~/domain/enums/gender";

/**
 * Controller for getting the groups for a birth date and
 *
 * @param birthDate - The birth date
 * @param gender - The gender
 * @returns The groups for the birth date
 *
 * @throws {DatabaseOperationError} - If an error occurs in the database
 */
export async function getGroupsForBirthDateAndGenderController(
  birthDate: Date,
  gender: Gender,
): Promise<Group[]> {
  return await startSpan(
    {
      name: "getGroupsForBirthDateAndGender Controller",
    },
    async () => {
      return await getActiveGroupsForBirthDateAndGenderUseCase(
        birthDate,
        gender,
      );
    },
  );
}
