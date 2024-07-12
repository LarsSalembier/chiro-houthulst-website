import { Button } from "~/components/ui/button";
import Link from "next/link";
import { type Metadata } from "next";
import Calendar from "./calendar";
import { events } from "~/config/events";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "~/components/page-header";

export const metadata: Metadata = {
  title: "Kalender",
  description: "Kalender van Chiro Houthulst",
};

export default function CalendarPage() {
  return (
    <div className="container relative flex flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>Onze kalender</PageHeaderHeading>
        <PageHeaderDescription>
          Bekijk hier onze kalender met alle activiteiten en evenementen.
          Download de kalender om hem af te drukken.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link
              target="_blank"
              rel="noreferrer"
              href="kalender.jpg"
              download="kalender.jpg"
            >
              Download afprintbare kalender
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
      <Calendar events={events} />
    </div>
  );
}
