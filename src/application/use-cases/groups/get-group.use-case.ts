import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Group } from "~/domain/entities/group";
import { GroupNotFoundError } from "~/domain/errors/groups";

/**
 * Get a group by its ID.
 *
 * @param groupId The ID of the group to get
 * @returns The group
 *
 * @throws {GroupNotFoundError} If the group was not found
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function getGroupUseCase(groupId: number): Promise<Group> {
  return startSpan({ name: "getGroup Use Case", op: "function" }, async () => {
    const groupsRepository = getInjection("IGroupsRepository");

    const group = await groupsRepository.getGroupById(groupId);

    if (!group) {
      throw new GroupNotFoundError("Group not found");
    }

    return group;
  });
}
