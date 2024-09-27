import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type Group } from "~/domain/entities/group";

/**
 * Get all groups.
 *
 * @returns All groups
 *
 * @throws {DatabaseOperationError} If there was an error with the database operation
 */
export async function getGroupsUseCase(): Promise<Group[]> {
  return startSpan({ name: "getGroups Use Case", op: "function" }, async () => {
    const groupsRepository = getInjection("IGroupsRepository");

    return await groupsRepository.getAllGroups();
  });
}
