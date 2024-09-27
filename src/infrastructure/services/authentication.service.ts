import { auth, clerkClient } from "@clerk/nextjs/server";
import { type Role } from "types/globals";
import { type IAuthenticationService } from "~/application/services/authentication.service.interface";
import { type CreateUser, type User } from "~/domain/entities/user";

export class AuthenticationService implements IAuthenticationService {
  async createUser(user: CreateUser): Promise<void> {
    await clerkClient.users.createUser({
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      emailAddress: [user.email],
      publicMetadata: { role: user.role },
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await clerkClient.users.deleteUser(userId);
  }

  async setRole(userId: string, role: Role): Promise<void> {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
    });
  }

  async getUsersByQuery(query?: string): Promise<User[]> {
    return query
      ? (await clerkClient.users.getUserList({ query })).data.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          role: user.publicMetadata.role as Role,
        }))
      : (await clerkClient.users.getUserList()).data.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          role: user.publicMetadata.role as Role,
        }));
  }

  isLoggedIn(): boolean {
    return !!auth().userId;
  }

  isLeiding(): boolean {
    return this.hasRole("leiding") || this.isAdmin();
  }

  isAdmin(): boolean {
    return this.hasRole("admin");
  }

  private hasRole(role: Role): boolean {
    const { sessionClaims } = auth();

    return sessionClaims?.metadata.role === role;
  }
}
