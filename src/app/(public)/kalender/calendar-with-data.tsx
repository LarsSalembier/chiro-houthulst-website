import Calendar from "~/app/(public)/kalender/calendar/calendar";
import { db } from "~/server/db";
import { hasRole } from "~/utils/roles";

export default async function CalendarWithData() {
  const eventsFromDatabase = await db.query.events.findMany();

  return (
    <Calendar
      events={eventsFromDatabase}
      userCanEdit={hasRole("leiding") || hasRole("admin")}
    />
  );
}
