import { startSpan } from "@sentry/nextjs";
import { type Gender } from "~/domain/enums/gender";
import { type Group } from "~/domain/entities/group";
import { getInjection } from "di/container";

/**
 * Get all active groups for a given birth date and gender.
 *
 * @param birthDate The birth date of the member
 * @param gender The gender of the member
 * @returns All active groups for the given birth date and gender
 *
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function getActiveGroupsForBirthDateAndGenderUseCase(
  birthDate: Date,
  gender: Gender,
): Promise<Group[]> {
  return startSpan(
    {
      name: "getActiveGroupsForBirthDateAndGender Use Case",
      op: "function",
    },
    async () => {
      const groupsRepository = getInjection("IGroupsRepository");
      let groups = await groupsRepository.getAllGroups();

      // Calculate the age of the member in days
      const today = new Date();
      const diff = today.getTime() - birthDate.getTime();
      const ageInDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      groups = groups.filter((group) => {
        // Don't show inactive groups
        if (!group.active) {
          return false;
        }

        // Don't show groups that are not in the age range
        if (ageInDays < group.minimumAgeInDays) {
          return false;
        }

        if (group.maximumAgeInDays && ageInDays > group.maximumAgeInDays) {
          return false;
        }

        // Don't show groups that are not for the correct gender. If the group
        // is for both genders, it will be shown. If the group is for a specific
        // gender, it will only be shown if the member is of that gender. If the member has gender X, groups for both M and F will be shown.
        if (
          group.gender !== null &&
          group.gender !== gender &&
          gender !== "X"
        ) {
          return false;
        }

        return true;
      });

      return groups;
    },
  );
}
