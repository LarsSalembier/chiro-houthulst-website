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
  boolean,
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

export const sponsors = createTable("sponsors", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 256 }).notNull(),
  companyOwnerName: varchar("company_owner_name", { length: 256 }),
  municipality: varchar("municipality", { length: 256 }),
  postalCode: varchar("postal_code", { length: 256 }),
  street: varchar("street", { length: 256 }),
  number: varchar("number", { length: 256 }),
  landline: varchar("landline", { length: 256 }),
  mobile: varchar("mobile", { length: 256 }),
  email: varchar("email", { length: 256 }),
  websiteUrl: varchar("website_url", { length: 256 }),
  amount: integer("amount").notNull(),
  logoUrl: varchar("logo_url", { length: 256 }),
  paid: boolean("paid").default(false),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

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
