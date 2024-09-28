import { injectable } from "inversify";
import { type Role } from "types/globals";
import { type IAuthenticationService } from "~/application/services/authentication.service.interface";
import { type CreateUser, type User } from "~/domain/entities/user";

@injectable()
export class MockAuthenticationService implements IAuthenticationService {
  mockUsers: User[] = [];

  async createUser(user: CreateUser): Promise<void> {
    this.mockUsers.push({
      id: Math.random().toString(),
      ...user,
    });
  }

  async deleteUser(userId: string): Promise<void> {
    this.mockUsers = this.mockUsers.filter((user) => user.id !== userId);
  }

  async setRole(userId: string, role: Role): Promise<void> {
    const user = this.mockUsers.find((user) => user.id === userId);

    if (user) {
      user.role = role;
    }
  }

  async getUsersByQuery(query?: string): Promise<User[]> {
    return query
      ? this.mockUsers.filter((user) =>
          [user.firstName, user.lastName, user.email].some((field) =>
            field?.toLowerCase().includes(query.toLowerCase()),
          ),
        )
      : this.mockUsers;
  }

  isLoggedIn(): boolean {
    return true;
  }

  isLeiding(): boolean {
    return this.hasRole("leiding") || this.isAdmin();
  }

  isAdmin(): boolean {
    return this.hasRole("admin");
  }

  private hasRole(_role: Role): boolean {
    return true;
  }
}
