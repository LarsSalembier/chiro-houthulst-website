import { clerkClient } from "@clerk/nextjs/server";
import { type Role } from "types/globals";
import { isAdmin, isLoggedIn } from "~/lib/auth";
import { AuthenticationError, AuthorizationError } from "~/lib/errors";

/**
 * Deletes a user.
 *
 * @param userId The id of the user to delete.
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not an admin.
 */
export async function deleteUser(userId: string) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isAdmin()) {
    throw new AuthorizationError();
  }

  await clerkClient.users.deleteUser(userId);
}

/**
 * Sets the role of a user.
 *
 * @param userId The id of the user to set the role for.
 * @param role The role to set.
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not an admin.
 */
export async function setRole(userId: string, role: Role) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isAdmin()) {
    throw new AuthorizationError();
  }

  await clerkClient.users.updateUser(userId, {
    publicMetadata: { role },
  });
}

/**
 * Get users by query. If no query is provided, all users are returned.
 *
 * @param query The query to search for.
 * @returns The users that match the query.
 */
export async function getUsersByQuery(query?: string) {
  return query
    ? (await clerkClient.users.getUserList({ query })).data
    : (await clerkClient.users.getUserList()).data;
}
