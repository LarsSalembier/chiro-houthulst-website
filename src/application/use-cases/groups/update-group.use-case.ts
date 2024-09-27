import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type GroupUpdate, type Group } from "~/domain/entities/group";

/**
 * Update a group.
 *
 * @param groupId The ID of the group to update
 * @param groupData The data of the group to update
 * @returns The updated group
 *
 * @throws {GroupNotFoundError} If the group was not found
 * @throws {GroupWithThatNameAlreadyExistsError} If the updated group name would create a duplicate
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function updateGroupUseCase(
  groupId: number,
  groupData: GroupUpdate,
): Promise<Group> {
  return startSpan(
    { name: "updateGroup Use Case", op: "function" },
    async () => {
      const groupsRepository = getInjection("IGroupsRepository");

      return await groupsRepository.updateGroup(groupId, groupData);
    },
  );
}
