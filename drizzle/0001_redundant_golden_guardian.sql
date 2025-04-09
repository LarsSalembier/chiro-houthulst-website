ALTER TABLE "chirohouthulst-website_emergency_contacts" DROP CONSTRAINT "chirohouthulst-website_emergency_contacts_member_id_chirohouthulst-website_members_id_fk";
--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_event_groups" DROP CONSTRAINT "chirohouthulst-website_event_groups_event_id_chirohouthulst-website_events_id_fk";
--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_event_groups" DROP CONSTRAINT "chirohouthulst-website_event_groups_group_id_chirohouthulst-website_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_event_registrations" DROP CONSTRAINT "chirohouthulst-website_event_registrations_member_id_chirohouthulst-website_members_id_fk";
--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_medical_information" DROP CONSTRAINT "chirohouthulst-website_medical_information_member_id_chirohouthulst-website_members_id_fk";
--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_members_parents" DROP CONSTRAINT "chirohouthulst-website_members_parents_member_id_chirohouthulst-website_members_id_fk";
--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_members_parents" DROP CONSTRAINT "chirohouthulst-website_members_parents_parent_id_chirohouthulst-website_parents_id_fk";
--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_yearly_memberships" DROP CONSTRAINT "chirohouthulst-website_yearly_memberships_member_id_chirohouthulst-website_members_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_emergency_contacts" ADD CONSTRAINT "chirohouthulst-website_emergency_contacts_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_event_groups" ADD CONSTRAINT "chirohouthulst-website_event_groups_event_id_chirohouthulst-website_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chirohouthulst-website_events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_event_groups" ADD CONSTRAINT "chirohouthulst-website_event_groups_group_id_chirohouthulst-website_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."chirohouthulst-website_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_event_registrations" ADD CONSTRAINT "chirohouthulst-website_event_registrations_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_medical_information" ADD CONSTRAINT "chirohouthulst-website_medical_information_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_members_parents" ADD CONSTRAINT "chirohouthulst-website_members_parents_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_members_parents" ADD CONSTRAINT "chirohouthulst-website_members_parents_parent_id_chirohouthulst-website_parents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chirohouthulst-website_parents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chirohouthulst-website_yearly_memberships" ADD CONSTRAINT "chirohouthulst-website_yearly_memberships_member_id_chirohouthulst-website_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chirohouthulst-website_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
