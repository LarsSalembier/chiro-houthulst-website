import { startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { z } from "zod";
import { createWorkYearUseCase } from "~/application/use-cases/work-years/create-work-year.use-case";
import { type WorkYear } from "~/domain/entities/work-year";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "~/domain/errors/authentication";

export const createWorkYearSchema = z
  .object({
    startDate: z
      .date({
        required_error: "Geef een startdatum op",
        invalid_type_error: "Geef een geldige startdatum op",
      })
      .min(new Date(1970, 0, 1), {
        message: "De startdatum moet na 01/01/1970 liggen",
      }),
    endDate: z
      .date({
        required_error: "Geef een einddatum op",
        invalid_type_error: "Geef een geldige einddatum op",
      })
      .min(new Date(1970, 0, 1), {
        message: "De einddatum moet na 01/01/1970 liggen",
      }),
    membershipFee: z.coerce
      .number({
        required_error: "Geef het lidgeld op",
        invalid_type_error: "Geef geldig getal op",
      })
      .positive({
        message: "Het lidgeld moet positief zijn",
      }),
  })
  .refine(
    (data) => {
      return data.startDate < data.endDate;
    },
    {
      message: "De startdatum moet voor de einddatum liggen",
      path: ["startDate"],
    },
  );

export type CreateWorkYearInput = z.infer<typeof createWorkYearSchema>;

/**
 * Controller for creating a work year
 *
 * @param input - The input for creating a work year
 * @returns The created work year
 *
 * @throws {UnauthenticatedError} If the user is not logged in
 * @throws {UnauthorizedError} If the user is not an admin
 * @throws {WorkYearWithThatStartAndEndDateAlreadyExistsError} If a work year with that start and end date already exists
 * @throws {DatabaseOperationError} If an error occurs in the database
 */
export async function createWorkYearController(
  input: CreateWorkYearInput,
): Promise<WorkYear> {
  return await startSpan(
    {
      name: "createWorkYear Controller",
    },
    async () => {
      const authenticationService = getInjection("IAuthenticationService");

      if (!authenticationService.isLoggedIn()) {
        throw new UnauthenticatedError(
          "You must be logged in to create a work year",
        );
      }

      if (!authenticationService.isAdmin()) {
        throw new UnauthorizedError(
          "You must be an admin to create a work year",
        );
      }

      return await createWorkYearUseCase(input);
    },
  );
}
