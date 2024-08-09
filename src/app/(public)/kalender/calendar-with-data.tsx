import Calendar from "~/app/(public)/kalender/calendar/calendar";
import { getAllEvents } from "~/server/queries/event-queries";
import { isLeiding } from "~/utils/auth";

export default async function CalendarWithData() {
  const eventsFromDatabase = await getAllEvents();

  return <Calendar events={eventsFromDatabase} userCanEdit={isLeiding()} />;
}
