import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";

/**
 * Delete a group.
 *
 * @param groupId The ID of the group to delete
 *
 * @throws {GroupNotFoundError} If the group was not found
 * @throws {GroupStillReferencedError} If the group is still referenced by other entities
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function deleteGroupUseCase(groupId: number): Promise<void> {
  return startSpan(
    { name: "deleteGroup Use Case", op: "function" },
    async () => {
      const groupsRepository = getInjection("IGroupsRepository");

      return await groupsRepository.deleteGroup(groupId);
    },
  );
}
