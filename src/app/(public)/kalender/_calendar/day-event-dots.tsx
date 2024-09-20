import { cn } from "~/lib/utils";
import { type Event } from "drizzle/schema";
import { getEventDotColor } from "./calendar-utils";

interface DayEventDotsProps {
  events: Event[];
}

export default function DayEventDots({ events }: DayEventDotsProps) {
  return (
    <div className="mt-1 flex lg:hidden" role="list">
      {Array.from({ length: events.length }, (_, index) => (
        <span
          key={index}
          className={cn(
            "mx-0.5 h-2 w-2 rounded-full",
            events[index] && getEventDotColor(events[index].eventType),
          )}
        />
      ))}
    </div>
  );
}
