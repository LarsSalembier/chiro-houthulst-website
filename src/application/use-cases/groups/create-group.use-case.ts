import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Group, type GroupInsert } from "~/domain/entities/group";

/**
 * Create a new group.
 *
 * @param groupData The data of the group to create
 * @returns The created group
 *
 * @throws {GroupWithThatNameAlreadyExistsError} If a group with the same name already exists
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function createGroupUseCase(
  groupData: GroupInsert,
): Promise<Group> {
  return startSpan(
    { name: "createGroup Use Case", op: "function" },
    async () => {
      const groupsRepository = getInjection("IGroupsRepository");

      return await groupsRepository.createGroup(groupData);
    },
  );
}
