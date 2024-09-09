// "use server";

// import { revalidatePath } from "next/cache";
// import { createDepartment } from "~/server/queries/department-queries";
// import { type CreateDepartmentData } from "~/server/schemas/department-schemas";

// /**
//  * Add a department to the database and revalidate the departments page.
//  *
//  * @param data The data of the department to add.
//  *
//  * @throws An AuthenticationError if the user is not authenticated.
//  * @throws An AuthorizationError if the user is not leiding.
//  * @throws A ZodError if the department data is invalid.
//  * @throws If the department could not be added.
//  */
// export async function createDepartmentAndRevalidate(
//   data: CreateDepartmentData,
// ) {
//   await createDepartment(data);

//   revalidatePath("/leiding/afdelingen");
// }
