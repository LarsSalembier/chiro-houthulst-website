ALTER TYPE "public"."table_name" ADD VALUE 'tent_rental_terms';--> statement-breakpoint
CREATE TABLE "chirohouthulst-website_tent_rental_terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
