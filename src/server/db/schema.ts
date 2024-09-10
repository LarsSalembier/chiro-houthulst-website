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
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `chirohouthulst-website_${name}`,
);

export const sponsors = createTable("sponsors", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 256 }).notNull().unique(),
  companyOwnerFirstName: varchar("company_owner_first_name", { length: 256 }),
  companyOwnerLastName: varchar("company_owner_last_name", { length: 256 }),
  addressId: integer("address_id")
    .notNull()
    .references(() => addresses.id),
  phoneNumber: varchar("phone_number", { length: 20 }),
  emailAddress: varchar("email_address", { length: 256 }),
  websiteUrl: varchar("website_url", { length: 256 }),
  amount: numeric("amount").notNull(),
  logoUrl: varchar("logo_url", { length: 256 }),
  paid: boolean("paid").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const events = createTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  location: varchar("location", { length: 255 }),
  facebookEventUrl: varchar("facebook_event_url", { length: 255 }),
  eventType: varchar("event_type", { length: 255 }).notNull(), // "CHIRO", "SPECIAL_CHIRO", "MEMBER_EVENT", "PUBLIC_EVENT", "CAMP"
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const departments = createTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 255 }),
  description: text("description"),
  minBirthDate: timestamp("min_birth_date"),
  maxBirthDate: timestamp("max_birth_date"),
  gender: varchar("gender", { length: 1 }), // "M", "F"
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
  emailAddress: varchar("email_address", { length: 255 }).unique(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  addressId: integer("address_id")
    .notNull()
    .references(() => addresses.id),
  permissionPhotos: boolean("permission_photos").notNull(),
  extraContactPersonFirstName: varchar("first_name", { length: 255 }).notNull(),
  extraContactPersonLastName: varchar("last_name", { length: 255 }).notNull(),
  extraContactPersonPhoneNumber: varchar("phone_number", {
    length: 20,
  }).notNull(),
  extraContactPersonRelationship: varchar("relationship", { length: 255 }),
  pastMedicalHistory: text("past_medical_history"),
  tetanusVaccination: boolean("tetanus_vaccination").notNull(),
  tetanusVaccinationYear: integer("tetanus_vaccination_year"),
  asthma: boolean("asthma").notNull(),
  asthmaInfo: varchar("asthma_info", { length: 255 }),
  bedwetting: boolean("bedwetting").notNull(),
  bedwettingInfo: varchar("bedwetting_info", { length: 255 }),
  epilepsy: boolean("epilepsy").notNull(),
  epilepsyInfo: varchar("epilepsy_info", { length: 255 }),
  heartCondition: boolean("heart_condition").notNull(),
  heartConditionInfo: varchar("heart_condition_info", { length: 255 }),
  hayFever: boolean("hay_fever").notNull(),
  hayFeverInfo: varchar("hay_fever_info", { length: 255 }),
  skinCondition: boolean("skin_condition").notNull(),
  skinConditionInfo: varchar("skin_condition_info", { length: 255 }),
  rheumatism: boolean("rheumatism").notNull(),
  rheumatismInfo: varchar("rheumatism_info", { length: 255 }),
  sleepwalking: boolean("sleepwalking").notNull(),
  sleepwalkingInfo: varchar("sleepwalking_info", { length: 255 }),
  diabetes: boolean("diabetes").notNull(),
  diabetesInfo: varchar("diabetes_info", { length: 255 }),
  foodAllergies: text("food_allergies"),
  substanceAllergies: text("substance_allergies"),
  medicationAllergies: text("medication_allergies"),
  medication: text("medication"),
  otherMedicalConditions: text("other_medical_conditions"),
  getsTiredQuickly: boolean("gets_tired_quickly").notNull(),
  canParticipateSports: boolean("can_participate_sports").notNull(),
  canSwim: boolean("can_swim").notNull(),
  otherRemarks: text("other_remarks"),
  permissionMedication: boolean("permission_medication").notNull(),
  doctorFirstName: varchar("first_name", { length: 255 }).notNull(),
  doctorLastName: varchar("last_name", { length: 255 }).notNull(),
  doctorPhoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const membersRelations = relations(members, ({ many, one }) => ({
  memberDepartments: many(memberDepartments),
  membersParents: many(membersParents),
  address: one(addresses, {
    fields: [members.addressId],
    references: [addresses.id],
  }),
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
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId] }),
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
  }),
);

export const parents = createTable("parents", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // "MOTHER", "FATHER", "GUARDIAN", "PLUSFATHER", "PLUSMOTHER"
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  emailAddress: varchar("email_address", { length: 255 }).notNull().unique(),
  addressId: integer("address_id")
    .notNull()
    .references(() => addresses.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const parentsRelations = relations(parents, ({ many, one }) => ({
  membersParents: many(membersParents),
  address: one(addresses, {
    fields: [parents.addressId],
    references: [addresses.id],
  }),
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

export const addresses = createTable(
  "addresses",
  {
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
  },
  (t) => ({
    unique: [
      {
        columns: [t.street, t.houseNumber, t.box, t.municipality, t.postalCode],
      },
    ],
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
