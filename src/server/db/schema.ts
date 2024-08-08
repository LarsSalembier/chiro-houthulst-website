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
  text,
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
  paid: boolean("paid").default(false).notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export type Sponsor = typeof sponsors.$inferSelect;

export const events = createTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  location: varchar("location", { length: 255 }),
  facebookEventUrl: varchar("facebook_event_url", { length: 255 }),
  eventType: varchar("event_type", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  updatedBy: varchar("updated_by", { length: 255 }),
});

export type Event = typeof events.$inferSelect;

export const departments = createTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 255 }),
  mascotImageUrl: varchar("mascot_image_url", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  updatedBy: varchar("updated_by", { length: 255 }),
});

export const members = createTable("members", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departments.id),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 1 }).notNull(), // Use M/F/X
  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }).notNull(),
  permissionPhotos: boolean("permission_photos").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
});

export const membersRelations = relations(members, ({ one }) => ({
  department: one(departments, {
    fields: [members.departmentId],
    references: [departments.id],
  }),
}));

export const parents = createTable("parents", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phone1: varchar("phone", { length: 20 }),
  email1: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
});

export const membersParents = createTable(
  "members_parents",
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id),
    parentId: integer("parent_id")
      .notNull()
      .references(() => parents.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.parentId] }),
  }),
);

export const membersParentsRelations = relations(membersParents, ({ one }) => ({
  member: one(members, {
    fields: [membersParents.memberId],
    references: [members.id],
  }),
  parent: one(parents, {
    fields: [membersParents.parentId],
    references: [parents.id],
  }),
}));

export const addresses = createTable("addresses", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id")
    .notNull()
    .references(() => parents.id),
  street: varchar("street", { length: 255 }).notNull(),
  houseNumber: varchar("house_number", { length: 10 }).notNull(),
  box: varchar("box", { length: 10 }),
  municipality: varchar("municipality", { length: 255 }).notNull(),
  postalCode: varchar("postal_code", { length: 10 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  parent: one(parents, {
    fields: [addresses.parentId],
    references: [parents.id],
  }),
}));

export const generalPractitioners = createTable("general_practitioners", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
});

export const medicalInformation = createTable("medical_information", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id),
  generalPractitionerId: integer("general_practitioner_id").references(
    () => generalPractitioners.id,
  ),
  pastMedicalHistory: text("past_medical_history"),
  tetanusVaccination: boolean("tetanus_vaccination").default(false),
  tetanusVaccinationYear: integer("tetanus_vaccination_year"),
  asthma: boolean("asthma").default(false),
  asthmaInfo: varchar("asthma_info", { length: 255 }),
  bedwetting: boolean("bedwetting").default(false),
  bedwettingInfo: varchar("bedwetting_info", { length: 255 }),
  epilepsy: boolean("epilepsy").default(false),
  epilepsyInfo: varchar("epilepsy_info", { length: 255 }),
  heartCondition: boolean("heart_condition").default(false),
  heartConditionInfo: varchar("heart_condition_info", { length: 255 }),
  hayFever: boolean("hay_fever").default(false),
  hayFeverInfo: varchar("hay_fever_info", { length: 255 }),
  skinCondition: boolean("skin_condition").default(false),
  skinConditionInfo: varchar("skin_condition_info", { length: 255 }),
  rheumatism: boolean("rheumatism").default(false),
  rheumatismInfo: varchar("rheumatism_info", { length: 255 }),
  sleepwalking: boolean("sleepwalking").default(false),
  sleepwalkingInfo: varchar("sleepwalking_info", { length: 255 }),
  diabetes: boolean("diabetes").default(false),
  diabetesInfo: varchar("diabetes_info", { length: 255 }),
  foodAllergies: text("food_allergies"),
  substanceAllergies: text("substance_allergies"),
  medicationAllergies: text("medication_allergies"),
  medicationDuringStay: text("medication_during_stay"),
  getsTiredQuickly: boolean("gets_tired_quickly").default(false),
  getsTiredQuicklyInfo: varchar("gets_tired_quickly_info", { length: 255 }),
  canParticipateSports: boolean("can_participate_sports").default(false),
  canParticipateSportsInfo: varchar("can_participate_sports_info", {
    length: 255,
  }),
  canSwim: boolean("can_swim").default(false),
  canSwimInfo: varchar("can_swim_info", { length: 255 }),
  otherRemarks: text("other_remarks"),
  permissionMedication: boolean("permission_medication").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
});

export const medicalInformationRelations = relations(
  medicalInformation,
  ({ one }) => ({
    member: one(members, {
      fields: [medicalInformation.memberId],
      references: [members.id],
    }),
    generalPractitioner: one(generalPractitioners, {
      fields: [medicalInformation.generalPractitionerId],
      references: [generalPractitioners.id],
    }),
  }),
);
