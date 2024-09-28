// "use server";

// import {
//   captureException,
//   withServerActionInstrumentation,
// } from "@sentry/nextjs";
// import {
//   UnauthenticatedError,
//   UnauthorizedError,
// } from "~/domain/errors/authentication";
// import { WorkYearWithThatStartAndEndDateAlreadyExistsError } from "~/domain/errors/work-years";
// import {
//   createWorkYearController,
//   type CreateWorkYearInput,
// } from "~/interface-adapters/controllers/work-years/create-work-year.controller";

// export async function createWorkYear(input: CreateWorkYearInput) {
//   return await withServerActionInstrumentation(
//     "createWorkYear",
//     { recordResponse: true },
//     async () => {
//       try {
//         const result = await createWorkYearController(input);
//         return { success: result };
//       } catch (error) {
//         if (error instanceof UnauthenticatedError) {
//           return {
//             error: "Je bent niet ingelogd.",
//           };
//         }

//         if (error instanceof UnauthorizedError) {
//           return {
//             error: "Je moet administrator zijn om een werkjaar toe te voegen.",
//           };
//         }

//         if (
//           error instanceof WorkYearWithThatStartAndEndDateAlreadyExistsError
//         ) {
//           return {
//             error: "Er bestaat al een werkjaar met deze start- en einddatum.",
//           };
//         }

//         captureException(error);
//         return {
//           error:
//             "Er is een fout opgetreden bij het ophalen van de groepen. De administrator is op de hoogte gebracht en zal dit zo snel mogelijk oplossen.",
//         };
//       }
//     },
//   );
// }
