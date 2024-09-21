import { captureException, startSpan } from "@sentry/nextjs";
import { and, eq, count } from "drizzle-orm";
import { injectable } from "inversify";
import { type IEventsRepository } from "~/application/repositories/events.repository.interface";
import {
  type EventUpdate,
  type Event_,
  type EventInsert,
} from "~/domain/entities/event";
import { type EventRegistration } from "~/domain/value-objects/event-registration";
import { PostgresErrorCode } from "~/domain/enums/postgres-error-code";
import {
  EventNotFoundError,
  EventWithSameFacebookEventUrlAlreadyExistsError,
  GroupNotLinkedToEventError,
} from "~/domain/errors/events";
import { isDatabaseError } from "~/domain/errors/database-error";
import { db } from "drizzle";
import {
  eventGroups,
  eventRegistrations,
  events,
  members,
} from "drizzle/schema";
import { type Group } from "~/domain/entities/group";
import { type PaymentMethod } from "~/domain/enums/payment-method";
import {
  MemberAlreadyPaidError,
  MemberAlreadyRegisteredError,
  MemberNotEnrolledThisYearError,
  MemberNotFoundError,
  MemberNotInGroupError,
  MemberNotRegisteredError,
} from "~/domain/errors/members";
import { GroupAlreadyLinkedToEventError } from "~/domain/errors/events";
import { DatabaseOperationError, NotFoundError } from "~/domain/errors/common";
import { GroupNotFoundError } from "~/domain/errors/groups";
import { WorkyearNotFoundError } from "~/domain/errors/workyears";
import { getInjection } from "di/container";

@injectable()
export class EventsRepository implements IEventsRepository {
  constructor(
    private readonly groupsRepository = getInjection("IGroupsRepository"),
    private readonly membersRepository = getInjection("IMembersRepository"),
    private readonly workyearsRepository = getInjection("IWorkyearsRepository"),
    private readonly yearlyMembershipsRepository = getInjection(
      "IYearlyMembershipsRepository",
    ),
  ) {}

  /**
   * Creates an event.
   *
   * @param event The event insert input.
   * @returns The created event.
   * @throws {EventWithSameFacebookEventUrlAlreadyExistsError} If an event with the same Facebook Event URL already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async createEvent(event: EventInsert): Promise<Event_> {
    return await startSpan(
      { name: "EventsRepository > createEvent" },
      async () => {
        try {
          const createdEvent = await db.transaction(async (tx) => {
            const query = tx.insert(events).values(event).returning();

            const [createdEvent_] = await startSpan(
              {
                name: query.toSQL().sql,
                op: "db.query",
                attributes: { "db.system": "postgresql" },
              },
              () => query.execute(),
            );

            if (!createdEvent_) {
              throw new DatabaseOperationError("Failed to create event");
            }

            return createdEvent_;
          });

          return createdEvent;
        } catch (error) {
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new EventWithSameFacebookEventUrlAlreadyExistsError(
              "Event with the same Facebook Event URL already exists",
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

  /**
   * Returns an event by id, or undefined if not found.
   *
   * @param id The event id.
   * @returns The event, or undefined if not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getEvent(id: number): Promise<Event_ | undefined> {
    return await startSpan(
      { name: "EventsRepository > getEvent" },
      async () => {
        try {
          const query = db.query.events.findFirst({
            where: eq(events.id, id),
          });

          const event = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!event) {
            return undefined;
          }

          return event;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get event", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Returns all events.
   *
   * @returns All events.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getEvents(): Promise<Event_[]> {
    return await startSpan(
      { name: "EventsRepository > getEvents" },
      async () => {
        try {
          const query = db.query.events.findMany();

          const events_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return events_;
        } catch (error) {
          captureException(error);
          throw new DatabaseOperationError("Failed to get events", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Updates an event by id.
   *
   * @param id The event id.
   * @param input The event update input.
   * @returns The updated event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {EventWithSameFacebookEventUrlAlreadyExistsError} If an event with the same Facebook Event URL already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async updateEvent(id: number, input: EventUpdate): Promise<Event_> {
    return await startSpan(
      { name: "EventsRepository > updateEvent" },
      async () => {
        try {
          const updatedEvent = await db.transaction(async (tx) => {
            const query = tx
              .update(events)
              .set(input)
              .where(eq(events.id, id))
              .returning();

            const [updatedEvent_] = await startSpan(
              {
                name: query.toSQL().sql,
                op: "db.query",
                attributes: { "db.system": "postgresql" },
              },
              () => query.execute(),
            );

            if (!updatedEvent_) {
              throw new EventNotFoundError("Event not found");
            }

            return updatedEvent_;
          });

          return updatedEvent;
        } catch (error) {
          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new EventWithSameFacebookEventUrlAlreadyExistsError(
              "Event with the same Facebook Event URL already exists",
              { cause: error },
            );
          }

          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { eventId: id, input } });
          throw new DatabaseOperationError("Failed to update event", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Deletes an event by id. This will also delete all registrations for the event.
   *
   * @param id The event id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async deleteEvent(id: number): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > deleteEvent" },
      async () => {
        try {
          await db.transaction(async (tx) => {
            const removeEventRegistrationsQuery = tx
              .delete(eventRegistrations)
              .where(eq(eventRegistrations.eventId, id));

            await startSpan(
              {
                name: removeEventRegistrationsQuery.toSQL().sql,
                op: "db.query",
                attributes: { "db.system": "postgresql" },
              },
              () => removeEventRegistrationsQuery.execute(),
            );

            const removeEventGroupsQuery = tx
              .delete(eventGroups)
              .where(eq(eventGroups.eventId, id));

            await startSpan(
              {
                name: removeEventGroupsQuery.toSQL().sql,
                op: "db.query",
                attributes: { "db.system": "postgresql" },
              },
              () => removeEventGroupsQuery.execute(),
            );

            const removeEventQuery = tx
              .delete(events)
              .where(eq(events.id, id))
              .returning();

            const [deleted] = await startSpan(
              {
                name: removeEventQuery.toSQL().sql,
                op: "db.query",
                attributes: { "db.system": "postgresql" },
              },
              () => removeEventQuery.execute(),
            );

            if (!deleted) {
              throw new EventNotFoundError("Event not found");
            }
          });
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { eventId: id } });
          throw new DatabaseOperationError("Failed to delete event", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets the groups associated with an event.
   *
   * @param eventId The event id.
   * @returns The groups associated with the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getEventGroups(eventId: number): Promise<Group[]> {
    return await startSpan(
      { name: "EventsRepository > getEventGroups" },
      async () => {
        try {
          const event = await this.getEvent(eventId);

          if (!event) {
            throw new EventNotFoundError("Event not found");
          }

          const query = db.query.eventGroups.findMany({
            where: eq(eventGroups.eventId, eventId),
            with: {
              group: true,
            },
          });

          const eventGroups_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return eventGroups_.map((eg) => eg.group);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { eventId } });
          throw new DatabaseOperationError("Failed to get event groups", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Adds a group to an event.
   *
   * @param eventId The event id.
   * @param groupId The group id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupAlreadyLinkedToEventError} If the group is already linked to the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async addGroupToEvent(eventId: number, groupId: number): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > addGroupToEvent" },
      async () => {
        try {
          const groupExists = await this.groupsRepository.getGroup(groupId);

          if (!groupExists) {
            throw new GroupNotFoundError(`Group with id ${groupId} not found`);
          }

          const eventExists = await this.getEvent(eventId);

          if (!eventExists) {
            throw new EventNotFoundError(`Event with id ${eventId} not found`);
          }

          const query = db.insert(eventGroups).values({ eventId, groupId });

          await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          if (
            isDatabaseError(error) &&
            error.code === PostgresErrorCode.UniqueViolation
          ) {
            throw new GroupAlreadyLinkedToEventError(
              `Group with id ${groupId} is already linked to event with id ${eventId}`,
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

  /**
   * Removes a group from an event.
   *
   * @param eventId The event id.
   * @param groupId The group id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {GroupNotLinkedToEventError} If the group is not linked to the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async removeGroupFromEvent(eventId: number, groupId: number): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > removeGroupFromEvent" },
      async () => {
        try {
          const eventExists = await this.getEvent(eventId);

          if (!eventExists) {
            throw new EventNotFoundError(`Event with id ${eventId} not found`);
          }

          const groupExists = await this.groupsRepository.getGroup(groupId);

          if (!groupExists) {
            throw new GroupNotFoundError(`Group with id ${groupId} not found`);
          }

          const eventGroupQuery = db.query.eventGroups.findFirst({
            where: and(
              eq(eventGroups.eventId, eventId),
              eq(eventGroups.groupId, groupId),
            ),
          });

          const eventGroup = await startSpan(
            {
              name: eventGroupQuery.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => eventGroupQuery.execute(),
          );

          if (!eventGroup) {
            throw new GroupNotLinkedToEventError(
              `Group with id ${groupId} is not linked to event with id ${eventId}`,
            );
          }

          const query = db
            .delete(eventGroups)
            .where(
              and(
                eq(eventGroups.eventId, eventId),
                eq(eventGroups.groupId, groupId),
              ),
            );

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
            error instanceof NotFoundError ||
            error instanceof GroupNotLinkedToEventError
          ) {
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

  /**
   * Gets the registrations for an event.
   *
   * @param eventId The event id.
   * @returns The registrations for the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getRegistrations(eventId: number): Promise<EventRegistration[]> {
    return await startSpan(
      { name: "EventsRepository > getRegistrations" },
      async () => {
        try {
          const eventExists = await this.getEvent(eventId);

          if (!eventExists) {
            throw new EventNotFoundError("Event not found");
          }

          const query = db.query.eventRegistrations.findMany({
            where: eq(eventRegistrations.eventId, eventId),
            with: {
              member: true,
            },
          });

          const registrations = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return registrations.map((registration) => ({
            memberId: registration.memberId,
            paymentReceived: registration.paymentReceived,
            paymentMethod: registration.paymentMethod,
            paymentDate: registration.paymentDate,
          }));
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { eventId } });
          throw new DatabaseOperationError(
            "Failed to get registrations for event",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets a registration for an event.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @returns The registration for the event, or undefined if not found.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getRegistration(
    eventId: number,
    memberId: number,
  ): Promise<EventRegistration | undefined> {
    return await startSpan(
      { name: "EventsRepository > getRegistration" },
      async () => {
        try {
          const eventExists = await this.getEvent(eventId);

          if (!eventExists) {
            throw new EventNotFoundError("Event not found");
          }

          const memberExists = await db.query.members.findFirst({
            where: eq(members.id, memberId),
          });

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const query = db.query.eventRegistrations.findFirst({
            where: and(
              eq(eventRegistrations.eventId, eventId),
              eq(eventRegistrations.memberId, memberId),
            ),
            with: {
              member: true,
            },
          });

          const registration = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!registration) {
            return undefined;
          }

          return {
            memberId: registration.memberId,
            paymentReceived: registration.paymentReceived,
            paymentMethod: registration.paymentMethod,
            paymentDate: registration.paymentDate,
          };
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { eventId, memberId } });
          throw new DatabaseOperationError("Failed to get registration", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets the paid registrations for an event.
   * @param eventId The event id.
   * @returns The paid registrations for the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getPaidRegistrations(eventId: number): Promise<EventRegistration[]> {
    return await startSpan(
      { name: "EventsRepository > getPaidRegistrations" },
      async () => {
        try {
          const eventExists = await this.getEvent(eventId);

          if (!eventExists) {
            throw new EventNotFoundError("Event not found");
          }

          const query = db.query.eventRegistrations.findMany({
            where: and(
              eq(eventRegistrations.eventId, eventId),
              eq(eventRegistrations.paymentReceived, true),
            ),
            with: {
              member: true,
            },
          });

          const registrations = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return registrations.map((registration) => ({
            memberId: registration.memberId,
            paymentReceived: registration.paymentReceived,
            paymentMethod: registration.paymentMethod,
            paymentDate: registration.paymentDate,
          }));
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { eventId } });
          throw new DatabaseOperationError(
            "Failed to get paid registrations for event",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets the unpaid registrations for an event.
   *
   * @param eventId The event id.
   * @returns The unpaid registrations for the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getUnpaidRegistrations(eventId: number): Promise<EventRegistration[]> {
    return await startSpan(
      { name: "EventsRepository > getUnpaidRegistrations" },
      async () => {
        try {
          const eventExists = await this.getEvent(eventId);

          if (!eventExists) {
            throw new EventNotFoundError("Event not found");
          }

          const query = db.query.eventRegistrations.findMany({
            where: and(
              eq(eventRegistrations.eventId, eventId),
              eq(eventRegistrations.paymentReceived, false),
            ),
            with: {
              member: true,
            },
          });

          const registrations = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return registrations.map((registration) => ({
            memberId: registration.memberId,
            paymentReceived: registration.paymentReceived,
            paymentMethod: registration.paymentMethod,
            paymentDate: registration.paymentDate,
          }));
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { eventId } });
          throw new DatabaseOperationError(
            "Failed to get unpaid registrations for event",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Registers a member to an event.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @param workYearId The id of the work year the member is enrolled in.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {WorkyearNotFoundError} If no workyear is found for the given date.
   * @throws {MemberAlreadyRegisteredError} If the member is already registered to the event.
   * @throws {MemberNotEnrolledThisYearError} If the member is not enrolled in the given work year.
   * @throws {MemberNotInGroupError} If the member is not in a group associated with the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async registerToEvent(
    eventId: number,
    memberId: number,
    date: Date,
  ): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > registerToEvent" },
      async () => {
        try {
          const registration = await this.getRegistration(eventId, memberId);

          if (registration) {
            throw new MemberAlreadyRegisteredError("Member already registered");
          }

          const workyear =
            await this.workyearsRepository.getWorkyearByDate(date);

          if (!workyear) {
            throw new WorkyearNotFoundError("Work year not found");
          }

          const yearlyMembership =
            await this.yearlyMembershipsRepository.getYearlyMembership(
              memberId,
              workyear.id,
            );

          if (!yearlyMembership) {
            throw new MemberNotEnrolledThisYearError("Member not enrolled");
          }

          // Check if member is in a group associated with the event, but ONLY if the event has groups (if it doesn't, any member can register)
          const groupsForEvent = await this.getEventGroups(eventId);

          if (groupsForEvent.length !== 0) {
            const memberGroup = groupsForEvent.find((group) => {
              return group.id === yearlyMembership.groupId;
            });

            if (!memberGroup) {
              throw new MemberNotInGroupError(
                "Member not in group associated with event",
              );
            }
          }

          const query = db.insert(eventRegistrations).values({
            eventId,
            memberId,
            paymentReceived: false,
          });

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
            error instanceof NotFoundError ||
            error instanceof MemberNotEnrolledThisYearError ||
            error instanceof MemberNotInGroupError ||
            error instanceof MemberAlreadyRegisteredError
          ) {
            throw error;
          }

          captureException(error, { data: { eventId, memberId } });
          throw new DatabaseOperationError("Failed to register to event", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Unregisters a member from an event.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberNotRegisteredError} If the member is not registered to the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async unregisterFromEvent(eventId: number, memberId: number): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > unregisterFromEvent" },
      async () => {
        try {
          const registration = await this.getRegistration(eventId, memberId);

          if (!registration) {
            throw new MemberNotRegisteredError("Member not registered");
          }

          const query = db
            .delete(eventRegistrations)
            .where(
              and(
                eq(eventRegistrations.eventId, eventId),
                eq(eventRegistrations.memberId, memberId),
              ),
            );

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
            error instanceof NotFoundError ||
            error instanceof MemberNotRegisteredError
          ) {
            throw error;
          }

          captureException(error, { data: { eventId, memberId } });
          throw new DatabaseOperationError("Failed to unregister from event", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Marks a registration as paid.
   *
   * @param eventId The event id.
   * @param memberId The member id.
   * @param paymentMethod The payment method.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {MemberNotRegisteredError} If the member is not registered to the event.
   * @throws {MemberAlreadyPaidError} If the member has already paid for the event.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async markRegistrationAsPaid(
    eventId: number,
    memberId: number,
    paymentMethod: PaymentMethod,
  ): Promise<void> {
    return await startSpan(
      { name: "EventsRepository > markRegistrationAsPaid" },
      async () => {
        try {
          const registration = await this.getRegistration(eventId, memberId);

          if (!registration) {
            throw new MemberNotRegisteredError("Member not registered");
          }

          if (registration.paymentReceived) {
            throw new MemberAlreadyPaidError("Member already paid");
          }

          const query = db
            .update(eventRegistrations)
            .set({
              paymentReceived: true,
              paymentMethod: paymentMethod,
              paymentDate: new Date(),
            })
            .where(
              and(
                eq(eventRegistrations.eventId, eventId),
                eq(eventRegistrations.memberId, memberId),
              ),
            );

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
            error instanceof NotFoundError ||
            error instanceof MemberNotRegisteredError ||
            error instanceof MemberAlreadyPaidError
          ) {
            throw error;
          }

          captureException(error, { data: { eventId, memberId } });
          throw new DatabaseOperationError(
            "Failed to mark registration as paid",
            {
              cause: error,
            },
          );
        }
      },
    );
  }

  /**
   * Gets the events for a member.
   *
   * @param memberId The member id.
   * @returns The events for the member.
   * @throws {MemberNotFoundError} If the member is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getEventsForMember(memberId: number): Promise<Event_[]> {
    return await startSpan(
      { name: "EventsRepository > getEventsForMember" },
      async () => {
        try {
          const memberExists = await this.membersRepository.getMember(memberId);

          if (!memberExists) {
            throw new MemberNotFoundError("Member not found");
          }

          const query = db.query.eventRegistrations.findMany({
            where: eq(eventRegistrations.memberId, memberId),
            with: {
              event: true,
            },
          });

          const registrations = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return registrations.map((registration) => registration.event);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { memberId } });
          throw new DatabaseOperationError("Failed to get events for member", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets the events for a group.
   *
   * @param groupId The group id.
   * @returns The events for the group.
   * @throws {GroupNotFoundError} If the group is not found.
   * @throws {DatabaseOperationError} If the operation fails
   */
  async getEventsForGroup(groupId: number): Promise<Event_[]> {
    return await startSpan(
      { name: "EventsRepository > getEventsForGroup" },
      async () => {
        try {
          const groupExists = await this.groupsRepository.getGroup(groupId);

          if (!groupExists) {
            throw new GroupNotFoundError(`Group with id ${groupId} not found`);
          }

          const query = db.query.eventGroups.findMany({
            where: eq(eventGroups.groupId, groupId),
            with: {
              event: true,
            },
          });

          const eventGroups_ = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          return eventGroups_.map((eventGroup) => eventGroup.event);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { groupId } });
          throw new DatabaseOperationError("Failed to get events for group", {
            cause: error,
          });
        }
      },
    );
  }

  /**
   * Gets the registration count for an event.
   *
   * @param eventId The event id.
   * @returns The registration count for the event.
   * @throws {EventNotFoundError} If the event is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  async getRegistrationCount(eventId: number): Promise<number> {
    return await startSpan(
      { name: "EventsRepository > getRegistrationCount" },
      async () => {
        try {
          const eventExists = await this.getEvent(eventId);

          if (!eventExists) {
            throw new EventNotFoundError("Event not found");
          }

          const query = db
            .select({ count: count() })
            .from(eventRegistrations)
            .where(eq(eventRegistrations.eventId, eventId));

          const result = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "postgresql" },
            },
            () => query.execute(),
          );

          if (!result[0]) {
            return 0;
          }

          return result[0].count;
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }

          captureException(error, { data: { eventId } });
          throw new DatabaseOperationError(
            "Failed to get registration count for event",
            {
              cause: error,
            },
          );
        }
      },
    );
  }
}
