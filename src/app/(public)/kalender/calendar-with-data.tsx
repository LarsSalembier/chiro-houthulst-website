import Calendar from "./_calendar/calendar";
import { getAllEvents } from "~/server/queries/event-queries";
import { isLeiding } from "~/lib/auth";

export default async function CalendarWithData() {
  const eventsFromDatabase = await getAllEvents();

  return <Calendar events={eventsFromDatabase} userCanEdit={isLeiding()} />;
}
