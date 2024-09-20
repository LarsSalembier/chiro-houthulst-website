import {
  addHours,
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns";
import { type Event } from "drizzle/schema";

export function getEventDotColor(eventType: string) {
  switch (eventType) {
    case "chiro":
      return "bg-blue-500";
    case "special_chiro":
      return "bg-purple-500";
    case "event":
      return "bg-green-500";
    case "camp":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}

export function getEventTypeColors(eventType: string) {
  switch (eventType) {
    case "chiro":
      return "bg-blue-200 text-blue-700";
    case "special_chiro":
      return "bg-purple-300 text-purple-800";
    case "event":
      return "bg-green-200 text-green-700";
    case "camp":
      return "bg-yellow-200 text-yellow-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

export function getEventsForDay(events: Event[], day: Date) {
  const beginningOfDay = startOfDay(day);
  return events.filter((event) => {
    const eventStart = event.startDate;
    const eventEnd = event.endDate;
    return (
      // Event starts today
      isSameDay(eventStart, beginningOfDay) ||
      // Event spans into following days
      (isBefore(eventStart, beginningOfDay) &&
        isAfter(eventEnd, endOfDay(beginningOfDay))) ||
      // Event ends today but after 6:00 AM
      (isSameDay(eventEnd, beginningOfDay) &&
        isAfter(eventEnd, addHours(beginningOfDay, 6)))
    );
  });
}
