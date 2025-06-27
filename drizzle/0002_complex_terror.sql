ALTER TABLE "chirohouthulst-website_work_years" ADD COLUMN "camp_price" double precision;--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_yearly_memberships" ADD COLUMN "camp_subscription" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_yearly_memberships" ADD COLUMN "camp_payment_method" "payment_method";--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_yearly_memberships" ADD COLUMN "camp_payment_received" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_yearly_memberships" ADD COLUMN "camp_payment_date" timestamp with time zone;