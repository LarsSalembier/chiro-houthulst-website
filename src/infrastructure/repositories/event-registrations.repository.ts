import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq } from "drizzle-orm";
import { injectable } from "inversify";
import { IEventRegistrationsRepository } from "~/application/repositories/event-registrations.repository.interface";
import {
  EventRegistration,
  EventRegistrationInsert,
  EventRegistrationUpdate,
} from "~/domain/entities/event-registration";
import { DatabaseOperationError } from "~/domain/errors/common";
import { db } from "drizzle";
import { eventRegistrations as eventRegistrationsTable } from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  EventRegistrationNotFoundError,
  MemberAlreadyRegisteredForEventError,
} from "~/domain/errors/event-registrations";
import { EventNotFoundError } from "~/domain/errors/events";
import { MemberNotFoundError } from "~/domain/errors/members";

@injectable()
export class EventRegistrationsRepository
  implements IEventRegistrationsRepository
{
  async createEventRegistration(
    eventRegistration: EventRegistrationInsert,
  ): Promise<EventRegistration> {
    return await startSpan(
      { name: "EventRegistrationsRepository > createEventRegistration" },
      async () => {
        try {
          const query = db
            .insert(eventRegistrationsTable)
            .values(eventRegistration)
            .returning();

          const [createdEventRegistration] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdEventRegistration) {
            throw new DatabaseOperationError(
              "Failed to create event registration",
            );
          }

          return createdEventRegistration;
        } catch (error) {
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (isDatabaseError(error)) {
            if (error.code === PostgresErrorCode.UniqueViolation) {
              throw new MemberAlreadyRegisteredForEventError(
                "Member is already registered for this event",
                { cause: error },
              );
            }

            if (error.code === PostgresErrorCode.ForeignKeyViolation) {
              if (error.column_name === "event_id") {
                throw new EventNotFoundError("Event not found", {
                  cause: error,
                });
              }
              if (error.column_name === "member_id") {
                throw new MemberNotFoundError("Member not found", {
                  cause: error,
                });
              }
            }
          }

          captureException(error, { data: eventRegistration });
          throw new DatabaseOperationError(
            "Failed to create event registration",
            { cause: error },
          );
        }
      },
    );
  }

  async getEventRegistrationByIds(
    eventId: number,
    memberId: number,
  ): Promise<EventRegistration | undefined> {
    return await startSpan(
      { name: "EventRegistrationsRepository > getEventRegistrationByIds" },
      async () => {
        try {
          const query = db.query.eventRegistrations.findFirst({
            where: and(
              eq(eventRegistrationsTable.eventId, eventId),
              eq(eventRegistrationsTable.memberId, memberId),
            ),
          });

          const eventRegistration = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return eventRegistration;
        } catch (error) {
          captureException(error, { data: { eventId, memberId } });
          throw new DatabaseOperationError("Failed to get event registration", {
            cause: error,
          });
        }
      },
    );
  }

  async getAllEventRegistrations(): Promise<EventRegistration[]> {
    return await startSpan(
      { name: "EventRegistrationsRepository > getAllEventRegistrations" },
      async () => {
        try {
          const query = db.query.eventRegistrations.findMany();

          const allEventRegistrations = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allEventRegistrations;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError(
            "Failed to get all event registrations",
            { cause: error },
          );
        }
      },
    );
  }

  async updateEventRegistration(
    eventId: number,
    memberId: number,
    eventRegistration: EventRegistrationUpdate,
  ): Promise<EventRegistration> {
    return await startSpan(
      { name: "EventRegistrationsRepository > updateEventRegistration" },
      async () => {
        try {
          const query = db
            .update(eventRegistrationsTable)
            .set(eventRegistration)
            .where(
              and(
                eq(eventRegistrationsTable.eventId, eventId),
                eq(eventRegistrationsTable.memberId, memberId),
              ),
            )
            .returning();

          const [updatedEventRegistration] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedEventRegistration) {
            throw new EventRegistrationNotFoundError(
              "Event registration not found",
            );
          }

          return updatedEventRegistration;
        } catch (error) {
          if (error instanceof EventRegistrationNotFoundError) {
            throw error;
          }

          captureException(error, {
            data: { eventId, memberId, eventRegistration },
          });
          throw new DatabaseOperationError(
            "Failed to update event registration",
            { cause: error },
          );
        }
      },
    );
  }

  async deleteEventRegistration(
    eventId: number,
    memberId: number,
  ): Promise<void> {
    return await startSpan(
      { name: "EventRegistrationsRepository > deleteEventRegistration" },
      async () => {
        try {
          const query = db
            .delete(eventRegistrationsTable)
            .where(
              and(
                eq(eventRegistrationsTable.eventId, eventId),
                eq(eventRegistrationsTable.memberId, memberId),
              ),
            )
            .returning();

          const [deletedEventRegistration] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedEventRegistration) {
            throw new EventRegistrationNotFoundError(
              "Event registration not found",
            );
          }
        } catch (error) {
          if (error instanceof EventRegistrationNotFoundError) {
            throw error;
          }

          captureException(error, { data: { eventId, memberId } });
          throw new DatabaseOperationError(
            "Failed to delete event registration",
            { cause: error },
          );
        }
      },
    );
  }

  async deleteAllEventRegistrations(): Promise<void> {
    return await startSpan(
      {
        name: "EventRegistrationsRepository > deleteAllEventRegistrations",
      },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(eventRegistrationsTable).returning();

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError(
            "Failed to delete all event registrations",
            { cause: error },
          );
        }
      },
    );
  }
}
