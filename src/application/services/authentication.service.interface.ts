import { type Role } from "types/globals";
import { type CreateUser, type User } from "~/domain/entities/user";

export interface IAuthenticationService {
  /**
   * Creates a user.
   *
   * @param user The user to create.
   */
  createUser(user: CreateUser): Promise<void>;

  /**
   * Deletes a user.
   *
   * @param userId The id of the user to delete.
   */
  deleteUser(userId: string): Promise<void>;

  /**
   * Sets the role of a user.
   *
   * @param userId The id of the user to set the role for.
   * @param role The role to set.
   */
  setRole(userId: string, role: Role): Promise<void>;

  /**
   * Get users by query. If no query is provided, all users are returned.
   *
   * @param query The query to search for.
   * @returns The users that match the query.
   */
  getUsersByQuery(query?: string): Promise<User[]>;

  /**
   * Checks if the user is logged in.
   *
   * @returns True if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean;

  /**
   * Checks if the user is leiding. Any admin is also considered leiding.
   *
   * @returns True if the user is leiding, false otherwise.
   */
  isLeiding(): boolean;

  /**
   * Checks if the user is an admin.
   *
   * @returns True if the user is an admin, false otherwise.
   */
  isAdmin(): boolean;
}
