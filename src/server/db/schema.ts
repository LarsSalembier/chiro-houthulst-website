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
  jsonb,
  date,
  pgEnum,
  smallint,
  doublePrecision,
  unique,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// --- Constants ---
export const MAX_STRING_LENGTH = 255;
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_ADDRESS_LENGTH = MAX_STRING_LENGTH;
export const MAX_URL_LENGTH = MAX_STRING_LENGTH;
export const MAX_PHONE_NUMBER_LENGTH = 20;

export const MAX_STREET_LENGTH = 100;
export const MAX_HOUSE_NUMBER_LENGTH = 10;
export const MAX_ADDRESS_BOX_LENGTH = 10;
export const MAX_MUNICIPALITY_LENGTH = 50;

export const MAX_GROUP_NAME_LENGTH = 50;
export const MAX_GROUP_COLOR_LENGTH = 20;

export const MAX_EMERGENCY_CONTACT_RELATIONSHIP_LENGTH = 50;

export const MAX_EVENT_TITLE_LENGTH = 100;
export const MAX_EVENT_LOCATION_LENGTH = MAX_STRING_LENGTH;

export const MAX_COMPANY_NAME_LENGTH = 100;

// --- Table Creator ---
export const createTable = pgTableCreator(
  (name) => `chirohouthulst-website_${name}`,
);

// --- Enums and Zod Schemas ---
export const genderEnumValues = ["M", "F", "X"] as const;
export const genderEnumSchema = z.enum(genderEnumValues);
export type Gender = z.infer<typeof genderEnumSchema>;
export const genderEnum = pgEnum("gender", genderEnumValues);

export const paymentMethodEnumValues = [
  "CASH",
  "BANK_TRANSFER",
  "PAYCONIQ",
  "OTHER",
] as const;
export const paymentMethodEnumSchema = z.enum(paymentMethodEnumValues);
export type PaymentMethod = z.infer<typeof paymentMethodEnumSchema>;
export const paymentMethodEnum = pgEnum(
  "payment_method",
  paymentMethodEnumValues,
);

export const eventTypeEnumValues = [
  "CHIRO",
  "SPECIAL_CHIRO",
  "MEMBER_EVENT",
  "PUBLIC_EVENT",
  "CAMP",
] as const;
export const eventTypeEnumSchema = z.enum(eventTypeEnumValues);
export type EventType = z.infer<typeof eventTypeEnumSchema>;
export const eventTypeEnum = pgEnum("event_type", eventTypeEnumValues);

export const parentRelationshipEnumValues = [
  "MOTHER",
  "FATHER",
  "PLUSMOTHER",
  "PLUSFATHER",
  "GUARDIAN",
] as const;
export const parentRelationshipEnumSchema = z.enum(
  parentRelationshipEnumValues,
);
export type ParentRelationship = z.infer<typeof parentRelationshipEnumSchema>;
export const parentRelationshipEnum = pgEnum(
  "relationship",
  parentRelationshipEnumValues,
);

export const auditActionEnumValues = ["CREATE", "UPDATE", "DELETE"] as const;
export const auditActionEnumSchema = z.enum(auditActionEnumValues);
export type AuditAction = z.infer<typeof auditActionEnumSchema>;
export const auditActionEnum = pgEnum("audit_action", auditActionEnumValues);

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
export const tableNameEnumSchema = z.enum(tableNamesArray);
export type TableName = z.infer<typeof auditActionEnumSchema>;
export const tableNameEnum = pgEnum("table_name", tableNamesArray);

/**
 * Adressen van leden, ouders en sponsors.
 */
export const addresses = createTable(
  tableNames.addresses,
  {
    id: serial("id").primaryKey(),
    street: varchar("street", { length: MAX_STREET_LENGTH }).notNull(),
    houseNumber: varchar("house_number", {
      length: MAX_HOUSE_NUMBER_LENGTH,
    }).notNull(),
    box: varchar("box", { length: MAX_ADDRESS_BOX_LENGTH }),
    municipality: varchar("municipality", {
      length: MAX_MUNICIPALITY_LENGTH,
    }).notNull(),
    postalCode: smallint("postal_code").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    uniqueAddress: unique().on(
      t.street,
      t.houseNumber,
      t.box,
      t.municipality,
      t.postalCode,
    ),
  }),
);

export const addressesRelations = relations(addresses, ({ many }) => ({
  parents: many(parents),
  sponsors: many(sponsors),
}));

export const SelectAddressSchema = createSelectSchema(addresses);
export const InsertAddressSchema = createInsertSchema(addresses, {
  street: z.string().trim().min(1).max(MAX_STREET_LENGTH),
  houseNumber: z.string().trim().min(1).max(MAX_HOUSE_NUMBER_LENGTH),
  box: z
    .string()
    .trim()
    .max(MAX_ADDRESS_BOX_LENGTH)
    .optional()
    .or(z.literal("")),
  municipality: z.string().trim().min(1).max(MAX_MUNICIPALITY_LENGTH),
  postalCode: z.coerce.number().int().min(1000).max(9999),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type Address = z.infer<typeof SelectAddressSchema>;
export type NewAddress = z.infer<typeof InsertAddressSchema>;

/**
 * Werkjaren waarvoor leden kunnen inschrijven.
 */
export const workYears = createTable(
  tableNames.workYears,
  {
    id: serial("id").primaryKey(),
    startDate: date("start_date", { mode: "date" }).notNull(),
    endDate: date("end_date", { mode: "date" }),
    membershipFee: doublePrecision("membership_fee").notNull(),
    campPrice: doublePrecision("camp_price"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    uniqueWorkYear: unique().on(t.startDate, t.endDate),
  }),
);

export const workYearsRelations = relations(workYears, ({ many }) => ({
  yearlyMemberships: many(yearlyMemberships),
  sponsorshipAgreements: many(sponsorshipAgreements),
}));

export const SelectWorkYearSchema = createSelectSchema(workYears);
export const InsertWorkYearSchema = createInsertSchema(workYears, {
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  membershipFee: z.coerce.number().nonnegative(),
  campPrice: z.coerce.number().nonnegative().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type WorkYear = z.infer<typeof SelectWorkYearSchema>;
export type NewWorkYear = z.infer<typeof InsertWorkYearSchema>;

/**
 * Chirogroepen, bijvoorbeeld "Ribbels", "Speelclub", etc.
 */
export const groups = createTable(tableNames.groups, {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: MAX_GROUP_NAME_LENGTH }).unique().notNull(),
  color: varchar("color", { length: MAX_GROUP_COLOR_LENGTH }),
  description: text("description"),
  minimumAgeInDays: integer("minimum_age_in_days").notNull(),
  maximumAgeInDays: integer("maximum_age_in_days"),
  gender: genderEnum("gender"),
  mascotImageUrl: varchar("mascot_image_url", { length: MAX_URL_LENGTH }),
  coverImageUrl: varchar("cover_image_url", { length: MAX_URL_LENGTH }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  yearlyMemberships: many(yearlyMemberships),
  eventGroups: many(eventGroups),
}));

export const SelectGroupSchema = createSelectSchema(groups);
export const InsertGroupSchema = createInsertSchema(groups, {
  name: z.string().trim().min(1).max(MAX_GROUP_NAME_LENGTH),
  color: z
    .string()
    .trim()
    .max(MAX_GROUP_COLOR_LENGTH)
    .optional()
    .or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  minimumAgeInDays: z.coerce.number().int().nonnegative(),
  maximumAgeInDays: z.coerce.number().int().nonnegative().optional(),
  gender: genderEnumSchema.optional(),
  mascotImageUrl: z
    .string()
    .trim()
    .max(MAX_URL_LENGTH)
    .url()
    .optional()
    .or(z.literal("")),
  coverImageUrl: z
    .string()
    .trim()
    .max(MAX_URL_LENGTH)
    .url()
    .optional()
    .or(z.literal("")),
  active: z.coerce.boolean().default(true),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type Group = z.infer<typeof SelectGroupSchema>;
export type NewGroup = z.infer<typeof InsertGroupSchema>;

/**
 * Leden van de Chiro.
 */
export const members = createTable(
  tableNames.members,
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: MAX_NAME_LENGTH }).notNull(),
    lastName: varchar("last_name", { length: MAX_NAME_LENGTH }).notNull(),
    gender: genderEnum("gender").notNull(),
    dateOfBirth: date("date_of_birth", { mode: "date" }).notNull(),
    emailAddress: varchar("email_address", {
      length: MAX_EMAIL_ADDRESS_LENGTH,
    }),
    phoneNumber: varchar("phone_number", { length: MAX_PHONE_NUMBER_LENGTH }),
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
    uniqueMember: unique().on(t.firstName, t.lastName, t.dateOfBirth),
  }),
);

export const membersRelations = relations(members, ({ many, one }) => ({
  yearlyMemberships: many(yearlyMemberships),
  membersParents: many(membersParents),
  medicalInformation: one(medicalInformation),
  emergencyContact: one(emergencyContacts),
  eventRegistrations: many(eventRegistrations),
}));

export const SelectMemberSchema = createSelectSchema(members);
export const InsertMemberSchema = createInsertSchema(members, {
  firstName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  lastName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  gender: genderEnumSchema,
  dateOfBirth: z.coerce.date(),
  emailAddress: z.string().email().optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .trim()
    .max(MAX_PHONE_NUMBER_LENGTH)
    .optional()
    .or(z.literal("")),
  gdprPermissionToPublishPhotos: z.coerce.boolean().default(false),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type Member = z.infer<typeof SelectMemberSchema>;
export type NewMember = z.infer<typeof InsertMemberSchema>;

/**
 * Noodcontact van leden. Bijvoorbeeld grootouders, vrienden etc.
 */
export const emergencyContacts = createTable(tableNames.emergencyContacts, {
  memberId: integer("member_id")
    .references(() => members.id, { onDelete: "cascade" })
    .primaryKey(),
  firstName: varchar("first_name", { length: MAX_NAME_LENGTH }).notNull(),
  lastName: varchar("last_name", { length: MAX_NAME_LENGTH }).notNull(),
  phoneNumber: varchar("phone_number", {
    length: MAX_PHONE_NUMBER_LENGTH,
  }).notNull(),
  relationship: varchar("relationship", {
    length: MAX_EMERGENCY_CONTACT_RELATIONSHIP_LENGTH,
  }),
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

export const SelectEmergencyContactSchema =
  createSelectSchema(emergencyContacts);
export const InsertEmergencyContactSchema = createInsertSchema(
  emergencyContacts,
  {
    memberId: z.coerce.number().int().positive(),
    firstName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
    lastName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
    phoneNumber: z.string().trim().min(1).max(MAX_PHONE_NUMBER_LENGTH),
    relationship: z
      .string()
      .trim()
      .max(MAX_EMERGENCY_CONTACT_RELATIONSHIP_LENGTH)
      .optional()
      .or(z.literal("")),
  },
).omit({ createdAt: true, updatedAt: true });

export type EmergencyContact = z.infer<typeof SelectEmergencyContactSchema>;
export type NewEmergencyContact = z.infer<typeof InsertEmergencyContactSchema>;

/**
 * Medische informatie van leden.
 */
export const medicalInformation = createTable(tableNames.medicalInformation, {
  memberId: integer("member_id")
    .references(() => members.id, { onDelete: "cascade" })
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
    .default(false) // TODO: this should probably be true
    .notNull(),
  canSwim: boolean("can_swim").default(false).notNull(),
  otherRemarks: text("other_remarks"),
  permissionMedication: boolean("permission_medication")
    .default(false)
    .notNull(),
  doctorFirstName: varchar("doctor_first_name", {
    length: MAX_NAME_LENGTH,
  }).notNull(),
  doctorLastName: varchar("doctor_last_name", {
    length: MAX_NAME_LENGTH,
  }).notNull(),
  doctorPhoneNumber: varchar("doctor_phone_number", {
    length: MAX_PHONE_NUMBER_LENGTH,
  }).notNull(),
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

export const SelectMedicalInformationSchema =
  createSelectSchema(medicalInformation);

export const InsertMedicalInformationSchema = createInsertSchema(
  medicalInformation,
  {
    memberId: z.coerce.number().int().positive(),
    pastMedicalHistory: z.string().optional().or(z.literal("")),
    tetanusVaccination: z.coerce.boolean().default(false),
    tetanusVaccinationYear: z.coerce.number().int().positive().optional(),
    asthma: z.coerce.boolean().default(false),
    asthmaInformation: z.string().optional().or(z.literal("")),
    bedwetting: z.coerce.boolean().default(false),
    bedwettingInformation: z.string().optional().or(z.literal("")),
    epilepsy: z.coerce.boolean().default(false),
    epilepsyInformation: z.string().optional().or(z.literal("")),
    heartCondition: z.boolean().default(false),
    heartConditionInformation: z.string().optional().or(z.literal("")),
    hayFever: z.coerce.boolean().default(false),
    hayFeverInformation: z.string().optional().or(z.literal("")),
    skinCondition: z.boolean().default(false),
    skinConditionInformation: z.string().optional().or(z.literal("")),
    rheumatism: z.coerce.boolean().default(false),
    rheumatismInformation: z.string().optional().or(z.literal("")),
    sleepwalking: z.coerce.boolean().default(false),
    sleepwalkingInformation: z.string().optional().or(z.literal("")),
    diabetes: z.coerce.boolean().default(false),
    diabetesInformation: z.string().optional().or(z.literal("")),
    foodAllergies: z.string().optional().or(z.literal("")),
    substanceAllergies: z.string().optional().or(z.literal("")),
    medicationAllergies: z.string().optional().or(z.literal("")),
    medication: z.string().optional().or(z.literal("")),
    otherMedicalConditions: z.string().optional().or(z.literal("")),
    getsTiredQuickly: z.coerce.boolean().default(false),
    canParticipateSports: z.coerce.boolean().default(false),
    canSwim: z.coerce.boolean().default(false),
    otherRemarks: z.string().optional().or(z.literal("")),
    permissionMedication: z.coerce.boolean().default(false),
    doctorFirstName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
    doctorLastName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
    doctorPhoneNumber: z.string().trim().min(1).max(MAX_PHONE_NUMBER_LENGTH),
  },
).omit({ createdAt: true, updatedAt: true });

export type MedicalInformation = z.infer<typeof SelectMedicalInformationSchema>;
export type NewMedicalInformation = z.infer<
  typeof InsertMedicalInformationSchema
>;

/**
 * Ouders/verzorgers van leden.
 */
export const parents = createTable(
  tableNames.parents,
  {
    id: serial("id").primaryKey(),
    emailAddress: varchar("email_address", {
      length: MAX_EMAIL_ADDRESS_LENGTH,
    }).notNull(),
    relationship: parentRelationshipEnum("relationship").notNull(),
    firstName: varchar("first_name", { length: MAX_NAME_LENGTH }).notNull(),
    lastName: varchar("last_name", { length: MAX_NAME_LENGTH }).notNull(),
    phoneNumber: varchar("phone_number", {
      length: MAX_PHONE_NUMBER_LENGTH,
    }).notNull(),
    addressId: integer("address_id")
      .notNull()
      .references(() => addresses.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    uniqueParent: unique().on(t.firstName, t.lastName, t.addressId),
  }),
);

export const parentsRelations = relations(parents, ({ many, one }) => ({
  membersParents: many(membersParents),
  address: one(addresses, {
    fields: [parents.addressId],
    references: [addresses.id],
  }),
}));

export const SelectParentSchema = createSelectSchema(parents);
export const InsertParentSchema = createInsertSchema(parents, {
  emailAddress: z.string().trim().email().min(1).max(MAX_EMAIL_ADDRESS_LENGTH),
  relationship: parentRelationshipEnumSchema,
  firstName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  lastName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  phoneNumber: z.string().trim().min(1).max(MAX_PHONE_NUMBER_LENGTH),
  addressId: z.coerce.number().int().positive(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type Parent = z.infer<typeof SelectParentSchema>;
export type NewParent = z.infer<typeof InsertParentSchema>;

/**
 * Koppelt leden aan ouders/verzorgers.
 */
export const membersParents = createTable(
  tableNames.membersParents,
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    parentId: integer("parent_id")
      .notNull()
      .references(() => parents.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").default(false).notNull(),
  },
  (t) => ({
    pk: primaryKey({
      name: "pk_members_parents",
      columns: [t.memberId, t.parentId],
    }),
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

export const SelectMemberParentSchema = createSelectSchema(membersParents);
export const InsertMemberParentSchema = createInsertSchema(membersParents, {
  memberId: z.coerce.number().int().positive(),
  parentId: z.coerce.number().int().positive(),
  isPrimary: z.coerce.boolean().default(false),
});

export type MemberParent = z.infer<typeof SelectMemberParentSchema>;
export type NewMemberParent = z.infer<typeof InsertMemberParentSchema>;

/**
 * Houdt de jaarlijkse lidgelden bij.
 */
export const yearlyMemberships = createTable(
  tableNames.yearlyMemberships,
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    workYearId: integer("work_year_id")
      .notNull()
      .references(() => workYears.id),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id),
    paymentReceived: boolean("payment_received").default(false).notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentDate: timestamp("payment_date", { withTimezone: true }),
    campSubscription: boolean("camp_subscription").default(false).notNull(),
    campPaymentMethod: paymentMethodEnum("camp_payment_method"),
    campPaymentReceived: boolean("camp_payment_received")
      .default(false)
      .notNull(),
    campPaymentDate: timestamp("camp_payment_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({
      name: "pk_yearly_memberships",
      columns: [t.memberId, t.workYearId],
    }),
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
      fields: [yearlyMemberships.groupId],
      references: [groups.id],
    }),
    workYear: one(workYears, {
      fields: [yearlyMemberships.workYearId],
      references: [workYears.id],
    }),
  }),
);

export const SelectYearlyMembershipSchema =
  createSelectSchema(yearlyMemberships);
export const InsertYearlyMembershipSchema = createInsertSchema(
  yearlyMemberships,
  {
    memberId: z.coerce.number().int().positive(),
    workYearId: z.coerce.number().int().positive(),
    groupId: z.coerce.number().int().positive(),
    paymentReceived: z.coerce.boolean().default(false),
    paymentMethod: paymentMethodEnumSchema.optional().or(z.literal("")),
    paymentDate: z.coerce.date().optional(),
    campSubscription: z.coerce.boolean().default(false),
    campPaymentMethod: paymentMethodEnumSchema.optional().or(z.literal("")),
    campPaymentReceived: z.coerce.boolean().default(false),
    campPaymentDate: z.coerce.date().optional(),
  },
).omit({ createdAt: true, updatedAt: true });

export type YearlyMembership = z.infer<typeof SelectYearlyMembershipSchema>;
export type NewYearlyMembership = z.infer<typeof InsertYearlyMembershipSchema>;

/**
 * Evenementen die door de Chiro georganiseerd worden.
 */
export const events = createTable(tableNames.events, {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: MAX_EVENT_TITLE_LENGTH }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  location: varchar("location", { length: MAX_EVENT_LOCATION_LENGTH }),
  facebookEventUrl: varchar("facebook_event_url", {
    length: MAX_URL_LENGTH,
  }).unique(),
  eventType: eventTypeEnum("event_type").notNull(),
  price: doublePrecision("price"),
  canSignUp: boolean("can_sign_up").default(false).notNull(),
  signUpDeadline: timestamp("sign_up_deadline", { withTimezone: true }),
  flyerUrl: varchar("flyer_url", { length: MAX_URL_LENGTH }),
  coverImageUrl: varchar("cover_image_url", { length: MAX_URL_LENGTH }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const eventsRelations = relations(events, ({ many }) => ({
  eventGroups: many(eventGroups),
  eventRegistrations: many(eventRegistrations),
}));

export const SelectEventSchema = createSelectSchema(events);
export const InsertEventSchema = createInsertSchema(events, {
  title: z.string().trim().min(1).max(MAX_EVENT_TITLE_LENGTH),
  description: z.string().optional().or(z.literal("")),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().trim().optional().or(z.literal("")),
  facebookEventUrl: z
    .string()
    .trim()
    .max(MAX_URL_LENGTH)
    .url()
    .optional()
    .or(z.literal("")),
  eventType: eventTypeEnumSchema,
  price: z.coerce.number().nonnegative().optional(),
  canSignUp: z.coerce.boolean().default(false),
  signUpDeadline: z.coerce.date().optional(),
  flyerUrl: z.string().trim().max(MAX_URL_LENGTH).optional().or(z.literal("")),
  coverImageUrl: z
    .string()
    .trim()
    .max(MAX_URL_LENGTH)
    .url()
    .optional()
    .or(z.literal("")),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type Event = z.infer<typeof SelectEventSchema>;
export type NewEvent = z.infer<typeof InsertEventSchema>;

/**
 * Koppelt evenementen aan Chirogroepen die deelnemen.
 */
export const eventGroups = createTable(
  tableNames.eventGroups,
  {
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({
      name: "pk_event_groups",
      columns: [t.eventId, t.groupId],
    }),
  }),
);

export const eventGroupsRelations = relations(eventGroups, ({ one }) => ({
  event: one(events, {
    fields: [eventGroups.eventId],
    references: [events.id],
  }),
  group: one(groups, {
    fields: [eventGroups.groupId],
    references: [groups.id],
  }),
}));

export const SelectEventGroupSchema = createSelectSchema(eventGroups);
export const InsertEventGroupSchema = createInsertSchema(eventGroups, {
  eventId: z.coerce.number().int().positive(),
  groupId: z.coerce.number().int().positive(),
});

export type EventGroup = z.infer<typeof SelectEventGroupSchema>;
export type NewEventGroup = z.infer<typeof InsertEventGroupSchema>;

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
      .references(() => members.id, { onDelete: "cascade" }),
    paymentReceived: boolean("payment_received").default(false).notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentDate: timestamp("payment_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({
      name: "pk_event_registrations",
      columns: [t.eventId, t.memberId],
    }),
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

export const SelectEventRegistrationSchema =
  createSelectSchema(eventRegistrations);
export const InsertEventRegistrationSchema = createInsertSchema(
  eventRegistrations,
  {
    eventId: z.coerce.number().int().positive(),
    memberId: z.coerce.number().int().positive(),
    paymentReceived: z.coerce.boolean().default(false),
    paymentMethod: paymentMethodEnumSchema.optional().or(z.literal("")),
    paymentDate: z.coerce.date().optional(),
  },
).omit({ createdAt: true, updatedAt: true });

export type EventRegistration = z.infer<typeof SelectEventRegistrationSchema>;
export type NewEventRegistration = z.infer<
  typeof InsertEventRegistrationSchema
>;

/**
 * Sponsors van de Chiro.
 */
export const sponsors = createTable(tableNames.sponsors, {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: MAX_COMPANY_NAME_LENGTH })
    .unique()
    .notNull(),
  companyOwnerFirstName: varchar("company_owner_first_name", {
    length: MAX_NAME_LENGTH,
  }),
  companyOwnerLastName: varchar("company_owner_last_name", {
    length: MAX_NAME_LENGTH,
  }),
  addressId: integer("address_id").references(() => addresses.id),
  phoneNumber: varchar("phone_number", { length: MAX_PHONE_NUMBER_LENGTH }),
  emailAddress: varchar("email_address", { length: MAX_EMAIL_ADDRESS_LENGTH }),
  websiteUrl: varchar("website_url", { length: MAX_URL_LENGTH }),
  logoUrl: varchar("logo_url", { length: MAX_URL_LENGTH }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const sponsorsRelations = relations(sponsors, ({ many, one }) => ({
  address: one(addresses, {
    fields: [sponsors.addressId],
    references: [addresses.id],
  }),
  sponsorshipAgreements: many(sponsorshipAgreements),
}));

export const SelectSponsorSchema = createSelectSchema(sponsors);
export const InsertSponsorSchema = createInsertSchema(sponsors, {
  companyName: z.string().trim().min(1).max(MAX_COMPANY_NAME_LENGTH),
  companyOwnerFirstName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  companyOwnerLastName: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  addressId: z.coerce.number().int().positive().optional(),
  phoneNumber: z
    .string()
    .trim()
    .max(MAX_PHONE_NUMBER_LENGTH)
    .optional()
    .or(z.literal("")),
  emailAddress: z
    .string()
    .trim()
    .email()
    .max(MAX_EMAIL_ADDRESS_LENGTH)
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .trim()
    .max(MAX_URL_LENGTH)
    .url()
    .optional()
    .or(z.literal("")),
  logoUrl: z
    .string()
    .trim()
    .max(MAX_URL_LENGTH)
    .url()
    .optional()
    .or(z.literal("")),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type Sponsor = z.infer<typeof SelectSponsorSchema>;
export type NewSponsor = z.infer<typeof InsertSponsorSchema>;

/**
 * Houdt de sponsorcontracten per jaar bij.
 */
export const sponsorshipAgreements = createTable(
  tableNames.sponsorshipAgreements,
  {
    sponsorId: integer("sponsor_id")
      .notNull()
      .references(() => sponsors.id),
    workYearId: integer("work_year_id")
      .notNull()
      .references(() => workYears.id),
    amount: doublePrecision("amount").notNull(),
    paymentReceived: boolean("payment_received").default(false).notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentDate: timestamp("payment_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({
      name: "pk_sponsorship_agreements",
      columns: [t.sponsorId, t.workYearId],
    }),
  }),
);

export const sponsorshipAgreementsRelations = relations(
  sponsorshipAgreements,
  ({ one }) => ({
    sponsor: one(sponsors, {
      fields: [sponsorshipAgreements.sponsorId],
      references: [sponsors.id],
    }),
    workYear: one(workYears, {
      fields: [sponsorshipAgreements.workYearId],
      references: [workYears.id],
    }),
  }),
);

export const SelectSponsorshipAgreementSchema = createSelectSchema(
  sponsorshipAgreements,
);
export const InsertSponsorshipAgreementSchema = createInsertSchema(
  sponsorshipAgreements,
  {
    sponsorId: z.coerce.number().int().positive(),
    workYearId: z.coerce.number().int().positive(),
    amount: z.coerce.number().positive(),
    paymentReceived: z.coerce.boolean().default(false),
    paymentMethod: paymentMethodEnumSchema.optional().or(z.literal("")),
    paymentDate: z.coerce.date().optional(),
  },
).omit({ createdAt: true, updatedAt: true });

export type SponsorshipAgreement = z.infer<
  typeof SelectSponsorshipAgreementSchema
>;
export type NewSponsorshipAgreement = z.infer<
  typeof InsertSponsorshipAgreementSchema
>;

export const auditLogs = createTable("audit_logs", {
  id: serial("id").primaryKey(),
  tableName: tableNameEnum("table_name").notNull(),
  recordId: integer("record_id").notNull(),
  action: auditActionEnum("action").notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  userId: varchar("user_id", { length: MAX_STRING_LENGTH }).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const SelectAuditLogSchema = createSelectSchema(auditLogs);
export const InsertAuditLogSchema = createInsertSchema(auditLogs, {
  tableName: tableNameEnumSchema,
  recordId: z.coerce.number().int().positive(),
  action: auditActionEnumSchema,
  oldValues: z
    .record(
      z.string(),
      z.union([
        z.string(),
        z.number(),
        z.date(),
        z.boolean(),
        z.null(),
        z.undefined(),
      ]),
    )
    .optional(),
  newValues: z
    .record(
      z.string(),
      z.union([
        z.string(),
        z.number(),
        z.date(),
        z.boolean(),
        z.null(),
        z.undefined(),
      ]),
    )
    .optional(),
  userId: z.string().trim().min(1).max(MAX_STRING_LENGTH),
}).omit({ id: true, timestamp: true });

export type AuditLog = z.infer<typeof SelectAuditLogSchema>;
export type NewAuditLog = z.infer<typeof InsertAuditLogSchema>;
