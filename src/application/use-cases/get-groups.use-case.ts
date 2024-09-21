import { captureException, startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { isLoggedIn } from "~/lib/auth";

export function getGroupsUseCase() {
  return startSpan({ name: "getGroups Use Case", op: "function" }, async () => {
    try {
      const groupsRepository = getInjection("IGroupsRepository");

      if (!isLoggedIn()) {
        return { error: "Je moet ingelogd zijn om de groepen te bekijken." };
      }

      const groups = await groupsRepository.getGroups();
      return groups;
    } catch (error) {
      console.log(error);
      captureException(error);
      return {
        error:
          "Er is een onbekende fout opgetreden bij het ophalen van de groepen. De beheerder is op de hoogte gebracht. Probeer het later opnieuw.",
      };
    }
  });
}
