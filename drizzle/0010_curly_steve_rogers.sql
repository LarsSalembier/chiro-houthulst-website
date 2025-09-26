CREATE TABLE "chirohouthulst-website_tent_rentals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" double precision NOT NULL,
	"image_url" varchar(2000),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DROP TABLE "chirohouthulst-website_settings" CASCADE;--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_audit_logs" ALTER COLUMN "table_name" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."table_name";--> statement-breakpoint
CREATE TYPE "public"."table_name" AS ENUM('addresses', 'work_years', 'groups', 'members', 'emergency_contacts', 'medical_information', 'parents', 'members_parents', 'yearly_memberships', 'events', 'event_groups', 'event_registrations', 'sponsors', 'sponsorship_agreements', 'main_leaders', 'vbs', 'tent_rentals');--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_audit_logs" ALTER COLUMN "table_name" SET DATA TYPE "public"."table_name" USING "table_name"::"public"."table_name";