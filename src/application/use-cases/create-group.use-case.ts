import { captureException, startSpan } from "@sentry/nextjs";
import { getInjection } from "di/container";
import { type GroupInsert } from "~/domain/entities/group";
import { GroupNameAlreadyExistsError } from "~/domain/errors/groups";
import { isLeiding, isLoggedIn } from "~/lib/auth";

export function createGroupUseCase(input: { groupData: GroupInsert }) {
  return startSpan(
    { name: "createGroup Use Case", op: "function" },
    async () => {
      try {
        const groupsRepository = getInjection("IGroupsRepository");

        if (!isLoggedIn()) {
          return { error: "Je moet ingelogd zijn om een groep aan te maken." };
        }

        if (!isLeiding()) {
          return {
            error:
              "Je moet leiding zijn om een groep aan te maken. Als je denkt dat dit een fout is, neem dan contact op met de beheerder.",
          };
        }

        // Create the group
        let group;
        try {
          group = await groupsRepository.createGroup(input.groupData);
        } catch (error) {
          if (error instanceof GroupNameAlreadyExistsError) {
            return { error: "Er bestaat al een groep met deze naam." };
          }
          throw error;
        }

        return group;
      } catch (error) {
        captureException(error);
        return {
          error:
            "Er is een onbekende fout opgetreden bij het aanmaken van de groep. De beheerder is op de hoogte gebracht. Probeer het later opnieuw.",
        };
      }
    },
  );
}
