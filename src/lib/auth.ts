import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { User } from "@clerk/nextjs/server";

/**
 * Check if the current user has the "leiding" role
 */
export function hasLeidingRole(user: User | null): boolean {
  return user?.publicMetadata?.role === "leiding";
}

/**
 * Check if the current user has the "admin" role
 */
export function hasAdminRole(user: User | null): boolean {
  return user?.publicMetadata?.role === "admin";
}

/**
 * Check if the current user has either "leiding" or "admin" role
 */
export function hasLeidingOrAdminRole(user: User | null): boolean {
  return hasLeidingRole(user) || hasAdminRole(user);
}

/**
 * Get the current user and check if they have the "leiding" role
 * Redirects to sign-in if not authenticated
 */
export async function requireLeidingAuth() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  if (!user || !hasLeidingOrAdminRole(user)) {
    redirect("/unauthorized");
  }

  return { userId, user };
}

/**
 * Get the current user and check if they have the "admin" role
 * Redirects to sign-in if not authenticated
 */
export async function requireAdminAuth() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  if (!user || !hasAdminRole(user)) {
    redirect("/unauthorized");
  }

  return { userId, user };
}

/**
 * Check if the current user has the "leiding" or "admin" role without redirecting
 * Returns null if not authenticated or doesn't have the role
 */
export async function getLeidingUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (!user || !hasLeidingOrAdminRole(user)) {
    return null;
  }

  return { userId, user };
}

/**
 * Check if the current user has the "admin" role without redirecting
 * Returns null if not authenticated or doesn't have the role
 */
export async function getAdminUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (!user || !hasAdminRole(user)) {
    return null;
  }

  return { userId, user };
}
