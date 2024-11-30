ALTER TABLE "chirohouthulst-website_addresses" DROP CONSTRAINT "unique_address";--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_members" DROP CONSTRAINT "chirohouthulst-website_members_email_address_unique";--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_members" DROP CONSTRAINT "unique_member";--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_parents" DROP CONSTRAINT "chirohouthulst-website_parents_email_address_unique";--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_work_years" DROP CONSTRAINT "unique_work_year";--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_addresses" ADD CONSTRAINT "chirohouthulst-website_addresses_street_house_number_box_municipality_postal_code_unique" UNIQUE("street","house_number","box","municipality","postal_code");--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_members" ADD CONSTRAINT "chirohouthulst-website_members_first_name_last_name_date_of_birth_unique" UNIQUE("first_name","last_name","date_of_birth");--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_parents" ADD CONSTRAINT "chirohouthulst-website_parents_first_name_last_name_address_id_unique" UNIQUE("first_name","last_name","address_id");--> statement-breakpoint
ALTER TABLE "chirohouthulst-website_work_years" ADD CONSTRAINT "chirohouthulst-website_work_years_start_date_end_date_unique" UNIQUE("start_date","end_date");