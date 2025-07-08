ALTER TABLE "chirohouthulst-website_medical_information" ADD COLUMN "is_complete" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_medical_information" ADD COLUMN "is_complete_confirmed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_medical_information" ADD COLUMN "marked_incomplete" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_medical_information" ADD COLUMN "marked_incomplete_by" varchar(100);--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_medical_information" ADD COLUMN "marked_incomplete_reason" text;--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_medical_information" ADD COLUMN "marked_incomplete_at" timestamp with time zone;