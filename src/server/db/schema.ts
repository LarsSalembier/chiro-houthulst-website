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
  jsonb,
  date,
  pgEnum,
  smallint,
} from "drizzle-orm/pg-core";
import { auditActionEnumValues } from "~/application/models/enums/audit-action";
import { eventTypeEnumValues } from "~/application/models/enums/event-type";
import { genderEnumValues } from "~/application/models/enums/gender";
import { parentRelationshipEnumValues } from "~/application/models/enums/parent-relationship";
import { paymentMethodEnumValues } from "~/application/models/enums/payment-method";

/**
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `chirohouthulst-website_${name}`,
);

const tableNamesArray = [
  "addresses",
  "work_years",
  "groups",
  "members",
  "emergency_contacts",
  "medical_information",
  "parents",
  "members_parents",
  "yearly_memberships",
  "events",
  "event_groups",
  "event_registrations",
  "sponsors",
  "sponsorship_agreements",
] as const;

const tableNames = {
  addresses: tableNamesArray[0],
  workYears: tableNamesArray[1],
  groups: tableNamesArray[2],
  members: tableNamesArray[3],
  emergencyContacts: tableNamesArray[4],
  medicalInformation: tableNamesArray[5],
  parents: tableNamesArray[6],
  membersParents: tableNamesArray[7],
  yearlyMemberships: tableNamesArray[8],
  events: tableNamesArray[9],
  eventGroups: tableNamesArray[10],
  eventRegistrations: tableNamesArray[11],
  sponsors: tableNamesArray[12],
  sponsorshipAgreements: tableNamesArray[13],
  auditLogs: "audit_logs",
};

/**
 * Beschikbare genders voor leden.
 */
export const genderEnum = pgEnum("gender", genderEnumValues);

/**
 * Beschikbare betalingsmethoden.
 */
export const paymentMethodEnum = pgEnum(
  "payment_method",
  paymentMethodEnumValues,
);

/**
 * Soorten evenementen die georganiseerd worden.
 */
export const eventTypeEnum = pgEnum("event_type", eventTypeEnumValues);

/**
 * Familierelaties voor ouders/voogden.
 */
export const parentRelationshipEnum = pgEnum(
  "relationship",
  parentRelationshipEnumValues,
);

/**
 * Acties die worden bijgehouden in de audit logs.
 */
export const auditActionEnum = pgEnum("audit_action", auditActionEnumValues);

/**
 * Namen van de tabellen in de database. Gebruikt voor de audit logs.
 */
export const tableNameEnum = pgEnum("table_name", tableNamesArray);

/**
 * Adressen van leden, ouders en sponsors.
 */
export const addresses = createTable(
  tableNames.addresses,
  {
    id: serial("id").primaryKey(),
    street: varchar("street", { length: 100 }).notNull(),
    houseNumber: varchar("house_number", { length: 10 }).notNull(),
    box: varchar("box", { length: 10 }),
    municipality: varchar("municipality", { length: 50 }).notNull(),
    postalCode: smallint("postal_code").notNull(),
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

export const addressesRelations = relations(addresses, ({ many }) => ({
  members: many(members),
  parents: many(parents),
  sponsors: many(sponsors),
}));

/**
 * Werkjaren waarvoor leden kunnen inschrijven.
 */
export const workYears = createTable(
  tableNames.workYears,
  {
    id: serial("id").primaryKey(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    membershipFee: numeric("membership_fee", {
      precision: 5,
      scale: 2,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    unique: [{ columns: [t.startDate, t.endDate] }],
  }),
);

export const workYearsRelations = relations(workYears, ({ many }) => ({
  yearlyMemberships: many(yearlyMemberships),
  sponsorshipAgreements: many(sponsorshipAgreements),
}));

/**
 * Chirogroepen, bijvoorbeeld "Ribbels", "Speelclub", etc.
 */
export const groups = createTable(tableNames.groups, {
  name: varchar("name", { length: 50 }).primaryKey(),
  color: varchar("color", { length: 20 }),
  description: text("description"),
  minBirthDate: date("min_birth_date").notNull(),
  maxBirthDate: date("max_birth_date").notNull(),
  gender: genderEnum("gender"),
  mascotImageUrl: varchar("mascot_image_url", { length: 255 }),
  coverImageUrl: varchar("cover_image_url", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  yearlyMemberships: many(yearlyMemberships),
  eventGroups: many(eventGroups),
}));

/**
 * Leden van de Chiro.
 */
export const members = createTable(
  tableNames.members,
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    gender: genderEnum("gender").notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    emailAddress: varchar("email_address", { length: 255 }).unique(),
    phoneNumber: varchar("phone_number", { length: 20 }),
    addressId: integer("address_id")
      .notNull()
      .references(() => addresses.id),
    // GDPR: toestemming om foto's te publiceren van het lid
    gdprPermissionToPublishPhotos: boolean("gdpr_permission_to_publish_photos")
      .default(false)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    indexes: [{ columns: [t.lastName] }, { columns: [t.dateOfBirth] }],
    unique: [{ columns: [t.firstName, t.lastName, t.dateOfBirth] }],
  }),
);

export const membersRelations = relations(members, ({ many, one }) => ({
  yearlyMemberships: many(yearlyMemberships),
  membersParents: many(membersParents),
  emergencyContacts: many(emergencyContacts),
  medicalInformation: one(medicalInformation),
  address: one(addresses, {
    fields: [members.addressId],
    references: [addresses.id],
  }),
  eventRegistrations: many(eventRegistrations),
}));

/**
 * Noodcontacten van leden. Bijvoorbeeld grootouders, vrienden etc.
 */
export const emergencyContacts = createTable(tableNames.emergencyContacts, {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  relationship: varchar("relationship", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const emergencyContactsRelations = relations(
  emergencyContacts,
  ({ one }) => ({
    member: one(members, {
      fields: [emergencyContacts.memberId],
      references: [members.id],
    }),
  }),
);

/**
 * Medische informatie van leden.
 */
export const medicalInformation = createTable(tableNames.medicalInformation, {
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id)
    .primaryKey(),
  pastMedicalHistory: text("past_medical_history"),
  tetanusVaccination: boolean("tetanus_vaccination").default(false).notNull(),
  tetanusVaccinationYear: smallint("tetanus_vaccination_year"),
  asthma: boolean("asthma").default(false).notNull(),
  asthmaInformation: text("asthma_information"),
  bedwetting: boolean("bedwetting").default(false).notNull(),
  bedwettingInformation: text("bedwetting_information"),
  epilepsy: boolean("epilepsy").default(false).notNull(),
  epilepsyInformation: text("epilepsy_information"),
  heartCondition: boolean("heart_condition").default(false).notNull(),
  heartConditionInformation: text("heart_condition_information"),
  hayFever: boolean("hay_fever").default(false).notNull(),
  hayFeverInformation: text("hay_fever_information"),
  skinCondition: boolean("skin_condition").default(false).notNull(),
  skinConditionInformation: text("skin_condition_information"),
  rheumatism: boolean("rheumatism").default(false).notNull(),
  rheumatismInformation: text("rheumatism_information"),
  sleepwalking: boolean("sleepwalking").default(false).notNull(),
  sleepwalkingInformation: text("sleepwalking_information"),
  diabetes: boolean("diabetes").default(false).notNull(),
  diabetesInformation: text("diabetes_information"),
  foodAllergies: text("food_allergies"),
  substanceAllergies: text("substance_allergies"),
  medicationAllergies: text("medication_allergies"),
  medication: text("medication"),
  otherMedicalConditions: text("other_medical_conditions"),
  getsTiredQuickly: boolean("gets_tired_quickly").default(false).notNull(),
  canParticipateSports: boolean("can_participate_sports")
    .default(false)
    .notNull(),
  canSwim: boolean("can_swim").default(false).notNull(),
  otherRemarks: text("other_remarks"),
  permissionMedication: boolean("permission_medication")
    .default(false)
    .notNull(),
  doctorFirstName: varchar("doctor_first_name", { length: 100 }).notNull(),
  doctorLastName: varchar("doctor_last_name", { length: 100 }).notNull(),
  doctorPhoneNumber: varchar("doctor_phone_number", { length: 20 }).notNull(),
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

/**
 * Ouders/verzorgers van leden.
 */
export const parents = createTable(
  tableNames.parents,
  {
    emailAddress: varchar("email_address", { length: 255 })
      .notNull()
      .primaryKey(),
    relationship: parentRelationshipEnum("relationship").notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    addressId: integer("address_id")
      .notNull()
      .references(() => addresses.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    indexes: [{ columns: [t.lastName] }, { columns: [t.emailAddress] }],
  }),
);

export const parentsRelations = relations(parents, ({ many, one }) => ({
  membersParents: many(membersParents),
  address: one(addresses, {
    fields: [parents.addressId],
    references: [addresses.id],
  }),
}));

/**
 * Koppelt leden aan ouders/verzorgers.
 */
export const membersParents = createTable(
  tableNames.membersParents,
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id),
    parentEmailAddress: varchar("parent_email_address", { length: 255 })
      .notNull()
      .references(() => parents.emailAddress),
    isPrimary: boolean("is_primary").default(false).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.parentEmailAddress] }),
  }),
);

export const membersParentsRelations = relations(membersParents, ({ one }) => ({
  member: one(members, {
    fields: [membersParents.memberId],
    references: [members.id],
  }),
  parent: one(parents, {
    fields: [membersParents.parentEmailAddress],
    references: [parents.emailAddress],
  }),
}));

/**
 * Houdt de jaarlijkse lidgelden bij.
 */
export const yearlyMemberships = createTable(
  tableNames.yearlyMemberships,
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id),
    groupName: varchar("group_name", { length: 255 })
      .notNull()
      .references(() => groups.name),
    workYearId: integer("work_year_id")
      .notNull()
      .references(() => workYears.id),
    paymentReceived: boolean("payment_received").default(false).notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentDate: timestamp("payment_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.groupName, t.workYearId] }),
    indexes: [{ columns: [t.memberId] }],
  }),
);

export const yearlyMembershipsRelations = relations(
  yearlyMemberships,
  ({ one }) => ({
    member: one(members, {
      fields: [yearlyMemberships.memberId],
      references: [members.id],
    }),
    group: one(groups, {
      fields: [yearlyMemberships.groupName],
      references: [groups.name],
    }),
    workYear: one(workYears, {
      fields: [yearlyMemberships.workYearId],
      references: [workYears.id],
    }),
  }),
);

/**
 * Evenementen die door de Chiro georganiseerd worden.
 */
export const events = createTable(
  tableNames.events,
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: text("description"),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    location: varchar("location", { length: 255 }),
    facebookEventUrl: varchar("facebook_event_url", { length: 255 }).unique(),
    eventType: eventTypeEnum("event_type").notNull(),
    price: numeric("price", { precision: 5, scale: 2 }),
    canSignUp: boolean("can_sign_up").default(false).notNull(),
    signUpDeadline: timestamp("sign_up_deadline", { withTimezone: true }),
    flyerUrl: varchar("flyer_url", { length: 255 }),
    coverImageUrl: varchar("cover_image_url", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    indexes: [{ columns: [t.startDate] }, { columns: [t.title] }],
  }),
);

export const eventsRelations = relations(events, ({ many }) => ({
  eventGroups: many(eventGroups),
  eventRegistrations: many(eventRegistrations),
}));

/**
 * Koppelt evenementen aan Chirogroepen die deelnemen.
 */
export const eventGroups = createTable(
  tableNames.eventGroups,
  {
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id),
    groupName: varchar("group_name", { length: 255 })
      .notNull()
      .references(() => groups.name),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.groupName] }),
    indexes: [{ columns: [t.eventId] }],
  }),
);

export const eventGroupsRelations = relations(eventGroups, ({ one }) => ({
  event: one(events, {
    fields: [eventGroups.eventId],
    references: [events.id],
  }),
  group: one(groups, {
    fields: [eventGroups.groupName],
    references: [groups.name],
  }),
}));

/**
 * Houdt de inschrijvingen voor evenementen bij.
 */
export const eventRegistrations = createTable(
  tableNames.eventRegistrations,
  {
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id),
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id),
    paymentReceived: boolean("payment_received").default(false).notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentDate: timestamp("payment_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.memberId] }),
    indexes: [{ columns: [t.eventId] }],
  }),
);

export const eventRegistrationsRelations = relations(
  eventRegistrations,
  ({ one }) => ({
    event: one(events, {
      fields: [eventRegistrations.eventId],
      references: [events.id],
    }),
    member: one(members, {
      fields: [eventRegistrations.memberId],
      references: [members.id],
    }),
  }),
);

/**
 * Sponsors van de Chiro.
 */
export const sponsors = createTable(
  tableNames.sponsors,
  {
    companyName: varchar("company_name", { length: 256 }).primaryKey(),
    companyOwnerFirstName: varchar("company_owner_first_name", {
      length: 100,
    }),
    companyOwnerLastName: varchar("company_owner_last_name", { length: 100 }),
    addressId: integer("address_id").references(() => addresses.id),
    phoneNumber: varchar("phone_number", { length: 20 }),
    emailAddress: varchar("email_address", { length: 255 }),
    websiteUrl: varchar("website_url", { length: 255 }),
    logoUrl: varchar("logo_url", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    indexes: [{ columns: [t.companyName] }],
  }),
);

export const sponsorsRelations = relations(sponsors, ({ many, one }) => ({
  address: one(addresses, {
    fields: [sponsors.addressId],
    references: [addresses.id],
  }),
  sponsorshipAgreements: many(sponsorshipAgreements),
}));

/**
 * Houdt de sponsorcontracten per jaar bij.
 */
export const sponsorshipAgreements = createTable(
  tableNames.sponsorshipAgreements,
  {
    id: serial("id").primaryKey(),
    sponsorCompanyName: varchar("sponsor_company_name", { length: 255 })
      .notNull()
      .references(() => sponsors.companyName),
    workYearId: integer("work_year_id")
      .notNull()
      .references(() => workYears.id),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    paymentReceived: boolean("payment_received").default(false).notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentDate: timestamp("payment_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    indexes: [{ columns: [t.sponsorCompanyName] }, { columns: [t.workYearId] }],
  }),
);

export const sponsorshipAgreementsRelations = relations(
  sponsorshipAgreements,
  ({ one }) => ({
    sponsor: one(sponsors, {
      fields: [sponsorshipAgreements.sponsorCompanyName],
      references: [sponsors.companyName],
    }),
    workYear: one(workYears, {
      fields: [sponsorshipAgreements.workYearId],
      references: [workYears.id],
    }),
  }),
);

export const auditLogs = createTable("audit_logs", {
  id: serial("id").primaryKey(),
  tableName: tableNameEnum("table_name").notNull(),
  recordId: integer("record_id").notNull(),
  action: auditActionEnum("action").notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  userId: varchar("user_id", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
