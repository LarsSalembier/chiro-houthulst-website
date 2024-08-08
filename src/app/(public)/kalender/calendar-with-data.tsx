import Calendar from "~/app/(public)/kalender/calendar/calendar";
import { db } from "~/server/db";
import { isLeiding } from "~/utils/auth";

export default async function CalendarWithData() {
  const eventsFromDatabase = await db.query.events.findMany();

  return <Calendar events={eventsFromDatabase} userCanEdit={isLeiding()} />;
}
