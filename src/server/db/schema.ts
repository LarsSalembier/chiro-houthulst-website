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
  numeric,
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
  amount: numeric("amount").notNull(),
  logoUrl: varchar("logo_url", { length: 256 }),
  paid: boolean("paid").default(false).notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
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
});

export type Event = typeof events.$inferSelect;

export const workYears = createTable("work_years", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const workYearsRelations = relations(workYears, ({ many }) => ({
  activities: many(activities),
  memberDepartments: many(memberDepartments),
}));

export const departments = createTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 255 }),
  description: text("description"),
  minSchoolGrade: varchar("min_school_grade", { length: 255 }),
  maxSchoolGrade: varchar("max_school_grade", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const departmentsRelations = relations(departments, ({ many }) => ({
  memberDepartments: many(memberDepartments),
}));

export const members = createTable("members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 1 }).notNull(), // "M", "F", "X"
  dateOfBirth: timestamp("date_of_birth").notNull(),
  emailAddress: varchar("email_address", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  permissionPhotos: boolean("permission_photos").default(false),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const membersRelations = relations(members, ({ many, one }) => ({
  memberDepartments: many(memberDepartments),
  membersParents: many(membersParents),
  subscriptions: many(subscriptions),
  medicalInformation: one(medicalInformation),
  memberExtraContactPersons: many(memberExtraContactPersons),
}));

export const memberDepartments = createTable(
  "member_departments",
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id),
    departmentId: integer("department_id")
      .notNull()
      .references(() => departments.id),
    workYearId: integer("work_year_id")
      .notNull()
      .references(() => workYears.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.workYearId] }),
  }),
);

export const memberDepartmentsRelations = relations(
  memberDepartments,
  ({ one }) => ({
    member: one(members, {
      fields: [memberDepartments.memberId],
      references: [members.id],
    }),
    department: one(departments, {
      fields: [memberDepartments.departmentId],
      references: [departments.id],
    }),
    workYear: one(workYears, {
      fields: [memberDepartments.workYearId],
      references: [workYears.id],
    }),
  }),
);

export const parents = createTable("parents", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // "MOTHER", "FATHER", "GUARDIAN", "PLUSFATHER", "PLUSMOTHER"
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone", { length: 20 }).notNull(),
  emailAddress: varchar("email", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const parentsRelations = relations(parents, ({ many }) => ({
  membersParents: many(membersParents),
  parentAddresses: many(parentAddresses),
}));

export const membersParents = createTable(
  "members_parents",
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id),
    parentId: integer("parent_id")
      .notNull()
      .references(() => parents.id),
    isPrimary: boolean("is_primary").default(false).notNull(),
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
  street: varchar("street", { length: 255 }).notNull(),
  houseNumber: varchar("house_number", { length: 10 }).notNull(),
  box: varchar("box", { length: 10 }),
  municipality: varchar("municipality", { length: 255 }).notNull(),
  postalCode: varchar("postal_code", { length: 10 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const addressesRelations = relations(addresses, ({ many }) => ({
  parentAddresses: many(parentAddresses),
  auditLogs: many(auditLogs),
}));

export const parentAddresses = createTable(
  "parent_addresses",
  {
    parentId: integer("parent_id")
      .notNull()
      .references(() => parents.id),
    addressId: integer("address_id")
      .notNull()
      .references(() => addresses.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.parentId, t.addressId] }),
  }),
);

export const parentAddressesRelations = relations(
  parentAddresses,
  ({ one }) => ({
    parent: one(parents, {
      fields: [parentAddresses.parentId],
      references: [parents.id],
    }),
    address: one(addresses, {
      fields: [parentAddresses.addressId],
      references: [addresses.id],
    }),
  }),
);

export const extraContactPersons = createTable("extra_contact_persons", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const extraContactPersonsRelations = relations(
  extraContactPersons,
  ({ many }) => ({
    memberExtraContactPersons: many(memberExtraContactPersons),
  }),
);

export const memberExtraContactPersons = createTable(
  "member_extra_contact_persons",
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id),
    extraContactPersonId: integer("extra_contact_person_id")
      .notNull()
      .references(() => extraContactPersons.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.extraContactPersonId] }),
  }),
);

export const memberExtraContactPersonsRelations = relations(
  memberExtraContactPersons,
  ({ one }) => ({
    member: one(members, {
      fields: [memberExtraContactPersons.memberId],
      references: [members.id],
    }),
    extraContactPerson: one(extraContactPersons, {
      fields: [memberExtraContactPersons.extraContactPersonId],
      references: [extraContactPersons.id],
    }),
  }),
);

export const activities = createTable("activities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // e.g., "WORK_YEAR", "CAMP", "GROUP_EXERCISE"
  price: numeric("price").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  maxParticipants: integer("max_participants"),
  workYearId: integer("work_year_id")
    .notNull()
    .references(() => workYears.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  workYear: one(workYears, {
    fields: [activities.workYearId],
    references: [workYears.id],
  }),
  subscriptions: many(subscriptions),
}));

export const subscriptions = createTable("subscriptions", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id),
  activityId: integer("activity_id")
    .notNull()
    .references(() => activities.id),
  status: varchar("status", { length: 50 }).notNull(), // e.g., "PENDING", "APPROVED", "CANCELLED"
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  member: one(members, {
    fields: [subscriptions.memberId],
    references: [members.id],
  }),
  activity: one(activities, {
    fields: [subscriptions.activityId],
    references: [activities.id],
  }),
}));

export const medicalInformation = createTable("medical_information", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id),
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
  medication: text("medication"),
  otherMedicalConditions: text("other_medical_conditions"),
  getsTiredQuickly: boolean("gets_tired_quickly").default(false),
  canParticipateSports: boolean("can_participate_sports").default(false),
  canSwim: boolean("can_swim").default(false),
  otherRemarks: text("other_remarks"),
  permissionMedication: boolean("permission_medication").default(false),
  doctorFirstName: varchar("first_name", { length: 255 }).notNull(),
  doctorLastName: varchar("last_name", { length: 255 }).notNull(),
  doctorPhoneNumber: varchar("phone_number", { length: 20 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const medicalInformationRelations = relations(
  medicalInformation,
  ({ one }) => ({
    member: one(members, {
      fields: [medicalInformation.memberId],
      references: [members.id],
    }),
  }),
);

export const auditLogs = createTable("audit_logs", {
  id: serial("id").primaryKey(),
  tableName: varchar("table_name", { length: 255 }).notNull(),
  recordId: integer("record_id").notNull(),
  action: varchar("action", { length: 50 }).notNull(), // INSERT, UPDATE, DELETE
  oldValues: text("old_values"), // JSONB
  newValues: text("new_values"), // JSONB
  userId: varchar("user_id", { length: 255 }),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
