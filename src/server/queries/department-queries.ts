import { isLeiding, isLoggedIn } from "~/utils/auth";
import { AuthenticationError, AuthorizationError } from "~/utils/errors";
import {
  type CreateDepartmentData,
  createDepartmentSchema,
} from "../schemas/create-department-schema";
import { db } from "../db";
import { departments } from "../db/schema";
import { auth } from "@clerk/nextjs/server";

/**
 * Create a new department.
 *
 * @param data The department data.
 *
 * @throws An AuthenticationError if the user is not authenticated.
 * @throws An AuthorizationError if the user is not leiding.
 * @throws A ZodError if the department data is invalid.
 * @throws If the department could not be added.
 */
export async function createDepartment(data: CreateDepartmentData) {
  if (!isLoggedIn()) {
    throw new AuthenticationError();
  }

  if (!isLeiding()) {
    throw new AuthorizationError();
  }

  createDepartmentSchema.parse(data);

  await db
    .insert(departments)
    .values({
      ...data,
      createdBy: auth().userId!,
    })
    .execute();
}

/**
 * Get all departments.
 *
 * @returns All departments.
 */
export async function getAllDepartments() {
  return db.query.departments.findMany();
}