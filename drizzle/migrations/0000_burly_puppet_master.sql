DO $$ BEGIN
 CREATE TYPE "public"."audit_action" AS ENUM('CREATE', 'UPDATE', 'DELETE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."event_type" AS ENUM('CHIRO', 'SPECIAL_CHIRO', 'MEMBER_EVENT', 'PUBLIC_EVENT', 'CAMP');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('M', 'F', 'X');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."relationship" AS ENUM('MOTHER', 'FATHER', 'PLUSMOTHER', 'PLUSFATHER', 'GUARDIAN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_method" AS ENUM('CASH', 'BANK_TRANSFER', 'PAYCONIQ', 'OTHER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."table_name" AS ENUM('addresses', 'work_years', 'groups', 'members', 'emergency_contacts', 'medical_information', 'parents', 'members_parents', 'yearly_memberships', 'events', 'event_groups', 'event_registrations', 'sponsors', 'sponsorship_agreements');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"street" varchar(100) NOT NULL,
	"house_number" varchar(10) NOT NULL,
	"box" varchar(10),
	"municipality" varchar(50) NOT NULL,
	"postal_code" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "unique_address" UNIQUE("street","house_number","box","municipality","postal_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" "table_name" NOT NULL,
	"record_id" integer NOT NULL,
	"action" "audit_action" NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"user_id" varchar(255) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_emergency_contacts" (
	"member_id" integer PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"relationship" varchar(50),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_event_groups" (
	"event_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	CONSTRAINT "pk_event_groups" PRIMARY KEY("event_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_event_registrations" (
	"event_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"payment_received" boolean DEFAULT false NOT NULL,
	"payment_method" "payment_method",
	"payment_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "pk_event_registrations" PRIMARY KEY("event_id","member_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"location" varchar(255),
	"facebook_event_url" varchar(255),
	"event_type" "event_type" NOT NULL,
	"price" double precision,
	"can_sign_up" boolean DEFAULT false NOT NULL,
	"sign_up_deadline" timestamp with time zone,
	"flyer_url" varchar(255),
	"cover_image_url" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chirohouthulst-website_events_facebook_event_url_unique" UNIQUE("facebook_event_url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"color" varchar(20),
	"description" text,
	"minimum_age_in_days" integer NOT NULL,
	"maximum_age_in_days" integer,
	"gender" "gender",
	"mascot_image_url" varchar(255),
	"cover_image_url" varchar(255),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chirohouthulst-website_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_medical_information" (
	"member_id" integer PRIMARY KEY NOT NULL,
	"past_medical_history" text,
	"tetanus_vaccination" boolean DEFAULT false NOT NULL,
	"tetanus_vaccination_year" smallint,
	"asthma" boolean DEFAULT false NOT NULL,
	"asthma_information" text,
	"bedwetting" boolean DEFAULT false NOT NULL,
	"bedwetting_information" text,
	"epilepsy" boolean DEFAULT false NOT NULL,
	"epilepsy_information" text,
	"heart_condition" boolean DEFAULT false NOT NULL,
	"heart_condition_information" text,
	"hay_fever" boolean DEFAULT false NOT NULL,
	"hay_fever_information" text,
	"skin_condition" boolean DEFAULT false NOT NULL,
	"skin_condition_information" text,
	"rheumatism" boolean DEFAULT false NOT NULL,
	"rheumatism_information" text,
	"sleepwalking" boolean DEFAULT false NOT NULL,
	"sleepwalking_information" text,
	"diabetes" boolean DEFAULT false NOT NULL,
	"diabetes_information" text,
	"food_allergies" text,
	"substance_allergies" text,
	"medication_allergies" text,
	"medication" text,
	"other_medical_conditions" text,
	"gets_tired_quickly" boolean DEFAULT false NOT NULL,
	"can_participate_sports" boolean DEFAULT false NOT NULL,
	"can_swim" boolean DEFAULT false NOT NULL,
	"other_remarks" text,
	"permission_medication" boolean DEFAULT false NOT NULL,
	"doctor_first_name" varchar(100) NOT NULL,
	"doctor_last_name" varchar(100) NOT NULL,
	"doctor_phone_number" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"gender" "gender" NOT NULL,
	"date_of_birth" date NOT NULL,
	"email_address" varchar(255),
	"phone_number" varchar(20),
	"gdpr_permission_to_publish_photos" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chirohouthulst-website_members_email_address_unique" UNIQUE("email_address"),
	CONSTRAINT "unique_member" UNIQUE("first_name","last_name","date_of_birth")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_members_parents" (
	"member_id" integer NOT NULL,
	"parent_id" integer NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "pk_members_parents" PRIMARY KEY("member_id","parent_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_parents" (
	"id" serial PRIMARY KEY NOT NULL,
	"email_address" varchar(255) NOT NULL,
	"relationship" "relationship" NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"address_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chirohouthulst-website_parents_email_address_unique" UNIQUE("email_address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_sponsors" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(100) NOT NULL,
	"company_owner_first_name" varchar(100),
	"company_owner_last_name" varchar(100),
	"address_id" integer,
	"phone_number" varchar(20),
	"email_address" varchar(255),
	"website_url" varchar(255),
	"logo_url" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chirohouthulst-website_sponsors_company_name_unique" UNIQUE("company_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_sponsorship_agreements" (
	"sponsor_id" integer NOT NULL,
	"work_year_id" integer NOT NULL,
	"amount" double precision NOT NULL,
	"payment_received" boolean DEFAULT false NOT NULL,
	"payment_method" "payment_method",
	"payment_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "pk_sponsorship_agreements" PRIMARY KEY("sponsor_id","work_year_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_work_years" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"membership_fee" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "unique_work_year" UNIQUE("start_date","end_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chirohouthulst-website_yearly_memberships" (
	"member_id" integer NOT NULL,
	"work_year_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"payment_received" boolean DEFAULT false NOT NULL,
	"payment_method" "payment_method",
	"payment_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "pk_yearly_memberships" PRIMARY KEY("member_id","work_year_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_emergency_contacts" ADD CONSTRAINT "chirohouthulst-website_emergency_contacts_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_event_groups" ADD CONSTRAINT "chirohouthulst-website_event_groups_event_id_chirohouthulst-website_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chirohouthulst-website_events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_event_groups" ADD CONSTRAINT "chirohouthulst-website_event_groups_group_id_chirohouthulst-website_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."chirohouthulst-website_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_event_registrations" ADD CONSTRAINT "chirohouthulst-website_event_registrations_event_id_chirohouthulst-website_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chirohouthulst-website_events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_event_registrations" ADD CONSTRAINT "chirohouthulst-website_event_registrations_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_medical_information" ADD CONSTRAINT "chirohouthulst-website_medical_information_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_members_parents" ADD CONSTRAINT "chirohouthulst-website_members_parents_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_members_parents" ADD CONSTRAINT "chirohouthulst-website_members_parents_parent_id_chirohouthulst-website_parents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chirohouthulst-website_parents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_parents" ADD CONSTRAINT "chirohouthulst-website_parents_address_id_chirohouthulst-website_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."chirohouthulst-website_addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_sponsors" ADD CONSTRAINT "chirohouthulst-website_sponsors_address_id_chirohouthulst-website_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."chirohouthulst-website_addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_sponsorship_agreements" ADD CONSTRAINT "chirohouthulst-website_sponsorship_agreements_sponsor_id_chirohouthulst-website_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."chirohouthulst-website_sponsors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_sponsorship_agreements" ADD CONSTRAINT "chirohouthulst-website_sponsorship_agreements_work_year_id_chirohouthulst-website_work_years_id_fk" FOREIGN KEY ("work_year_id") REFERENCES "public"."chirohouthulst-website_work_years"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_yearly_memberships" ADD CONSTRAINT "chirohouthulst-website_yearly_memberships_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_yearly_memberships" ADD CONSTRAINT "chirohouthulst-website_yearly_memberships_work_year_id_chirohouthulst-website_work_years_id_fk" FOREIGN KEY ("work_year_id") REFERENCES "public"."chirohouthulst-website_work_years"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_yearly_memberships" ADD CONSTRAINT "chirohouthulst-website_yearly_memberships_group_id_chirohouthulst-website_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."chirohouthulst-website_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
