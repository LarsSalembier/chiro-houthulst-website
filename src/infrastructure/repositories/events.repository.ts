import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq, inArray } from "drizzle-orm";
import { injectable } from "inversify";
import { IEventsRepository } from "~/application/repositories/events.repository.interface";
import { Event_, EventInsert, EventUpdate } from "~/domain/entities/event";
import { DatabaseOperationError } from "~/domain/errors/common";
import { db } from "drizzle";
import {
  eventGroups as eventGroupsTable,
  events as eventsTable,
} from "drizzle/schema";
import { isDatabaseError } from "~/domain/errors/database-error";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  EventNotFoundError,
  EventStillReferencedError,
  EventWithSameFacebookEventUrlAlreadyExistsError,
  GroupAlreadyLinkedToEventError,
  GroupNotLinkedToEventError,
} from "~/domain/errors/events";
import { GroupNotFoundError } from "~/domain/errors/groups";

@injectable()
export class EventsRepository implements IEventsRepository {
  async createEvent(event: EventInsert): Promise<Event_> {
    return await startSpan(
      { name: "EventsRepository > createEvent" },
      async () => {
        try {
          const query = db.insert(eventsTable).values(event).returning();

          const [createdEvent] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!createdEvent) {
            throw new DatabaseOperationError("Failed to create event");
          }

          return createdEvent;
        } catch (error) {
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new EventWithSameFacebookEventUrlAlreadyExistsError(
              "Event with the same Facebook event URL already exists",
              { cause: error },
            );
          }

          captureException(error, { data: event });
          throw new DatabaseOperationError("Failed to create event", {
            cause: error,
          });
        }
      },
    );
  }

  async getEventById(id: number): Promise<Event_ | undefined> {
    return await startSpan(
      { name: "EventsRepository > getEventById" },
      async () => {
        try {
          const query = db.query.events.findFirst({
            where: eq(eventsTable.id, id),
          });

          const event = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return event;
        } catch (error) {
          captureException(error, { data: { eventId: id } });
          throw new DatabaseOperationError("Failed to get event", {
            cause: error,
          });
        }
      },
    );
  }

  async getAllEvents(): Promise<Event_[]> {
    return await startSpan(
      { name: "EventsRepository > getAllEvents" },
      async () => {
        try {
          const query = db.query.events.findMany();

          const allEvents = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return allEvents;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get all events", {
            cause: error,
          });
        }
      },
    );
  }

  async getEventsByGroupId(groupId: number): Promise<Event_[]> {
    return await startSpan(
      { name: "EventsRepository > getEventsByGroupId" },
      async () => {
        try {
          const query = db.query.events.findMany({
            where: inArray(
              eventsTable.id,
              db
                .select()
                .from(eventGroupsTable)
                .where(eq(eventGroupsTable.groupId, groupId)),
            ),
          });

          const events = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return events;
        } catch (error) {
          captureException(error, { data: { groupId } });
          throw new DatabaseOperationError("Failed to get events by group ID", {
            cause: error,
          });
        }
      },
    );
  }

  async updateEvent(id: number, event: EventUpdate): Promise<Event_> {
    return await startSpan(
      { name: "EventsRepository > updateEvent" },
      async () => {
        try {
          const query = db
            .update(eventsTable)
            .set(event)
            .where(eq(eventsTable.id, id))
            .returning();

          const [updatedEvent] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!updatedEvent) {
            throw new EventNotFoundError("Event not found");
          }

          return updatedEvent;
        } catch (error) {
          if (error instanceof EventNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new EventWithSameFacebookEventUrlAlreadyExistsError(
              "Event with the same Facebook event URL already exists",
              { cause: error },
            );
          }

          captureException(error, { data: { eventId: id, event } });
          throw new DatabaseOperationError("Failed to update event", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteEvent(id: number): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > deleteEvent" },
      async () => {
        try {
          const query = db
            .delete(eventsTable)
            .where(eq(eventsTable.id, id))
            .returning();

          const [deletedEvent] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!deletedEvent) {
            throw new EventNotFoundError("Event not found");
          }
        } catch (error) {
          if (error instanceof EventNotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new EventStillReferencedError("Event still referenced", {
              cause: error,
            });
          }

          captureException(error, { data: { eventId: id } });
          throw new DatabaseOperationError("Failed to delete event", {
            cause: error,
          });
        }
      },
    );
  }

  async deleteAllEvents(): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > deleteAllEvents" },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(eventsTable).returning();

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            throw new EventStillReferencedError("Event still referenced", {
              cause: error,
            });
          }

          captureException(error);
          throw new DatabaseOperationError("Failed to delete all events", {
            cause: error,
          });
        }
      },
    );
  }

  async addGroupToEvent(eventId: number, groupId: number): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > addGroupToEvent" },
      async () => {
        try {
          const query = db
            .insert(eventGroupsTable)
            .values({ eventId, groupId })
            .returning();

          const [result] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!result) {
            throw new DatabaseOperationError("Failed to add group to event");
          }
        } catch (error) {
          if (error instanceof DatabaseOperationError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.ForeignKeyViolation
          ) {
            if (error.column_name === "event_id") {
              throw new EventNotFoundError("Event not found", {
                cause: error,
              });
            }

            if (error.column_name === "group_id") {
              throw new GroupNotFoundError("Group not found", {
                cause: error,
              });
            }
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new GroupAlreadyLinkedToEventError(
              "Group is already linked to event",
              { cause: error },
            );
          }

          captureException(error, { data: { eventId, groupId } });
          throw new DatabaseOperationError("Failed to add group to event", {
            cause: error,
          });
        }
      },
    );
  }

  async removeGroupFromEvent(eventId: number, groupId: number): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > removeGroupFromEvent" },
      async () => {
        try {
          const query = db
            .delete(eventGroupsTable)
            .where(
              and(
                eq(eventGroupsTable.eventId, eventId),
                eq(eventGroupsTable.groupId, groupId),
              ),
            )
            .returning();

          const [result] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!result) {
            throw new GroupNotLinkedToEventError(
              "Group is not linked to event",
            );
          }
        } catch (error) {
          if (error instanceof GroupNotLinkedToEventError) {
            throw error;
          }

          captureException(error, { data: { eventId, groupId } });
          throw new DatabaseOperationError(
            "Failed to remove group from event",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  async removeAllGroupsFromEvent(eventId: number): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > removeAllGroupsFromEvent" },
      async () => {
        try {
          const query = db
            .delete(eventGroupsTable)
            .where(eq(eventGroupsTable.eventId, eventId))
            .returning();

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          captureException(error, { data: { eventId } });
          throw new DatabaseOperationError(
            "Failed to remove all groups from event",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  async removeAllGroupsFromAllEvents(): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > removeAllGroupsFromAllEvents" },
      async () => {
        try {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          const query = db.delete(eventGroupsTable).returning();

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
            "Failed to remove all groups from all events",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
