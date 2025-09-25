ALTER TYPE "public"."table_name" ADD VALUE 'settings';--> statement-breakpoint
ALTER TYPE "public"."table_name" ADD VALUE 'main_leaders';--> statement-breakpoint
ALTER TYPE "public"."table_name" ADD VALUE 'vbs';--> statement-breakpoint
CREATE TABLE "chirohouthulst-website_main_leaders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "chirohouthulst-website_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chirohouthulst-website_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "chirohouthulst-website_vbs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
