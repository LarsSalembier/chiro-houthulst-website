// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  primaryKey,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `chirohouthulst-website_${name}`,
);

export const people = createTable("people", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  phone: varchar("phone", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const peopleRelations = relations(people, ({ many }) => ({
  groups: many(peopleToGroups),
}));

export const groups = createTable("group", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  color: varchar("color", { length: 256 }),
  ageRange: varchar("age_range", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(peopleToGroups),
}));

export const peopleToGroups = createTable(
  "people_to_groups",
  {
    personId: integer("person_id")
      .notNull()
      .references(() => people.id),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.personId, t.groupId] }),
  }),
);

export const peopleToGroupsRelations = relations(peopleToGroups, ({ one }) => ({
  person: one(people, {
    fields: [peopleToGroups.personId],
    references: [people.id],
  }),
  group: one(groups, {
    fields: [peopleToGroups.groupId],
    references: [groups.id],
  }),
}));
