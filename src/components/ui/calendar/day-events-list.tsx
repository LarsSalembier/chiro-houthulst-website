import { cn } from "~/lib/utils";
import { type ChiroEvent, ChiroEventType } from "~/types/chiro-event";

export const EVENT_TYPE_COLORS: Record<ChiroEventType, string> = {
  [ChiroEventType.CHIRO]: "bg-blue-200 text-blue-700",
  [ChiroEventType.SPECIAL_CHIRO]: "bg-purple-300 text-purple-800",
  [ChiroEventType.EVENT]: "bg-green-200 text-green-700",
  [ChiroEventType.CAMP]: "bg-yellow-200 text-yellow-800",
};

interface DayEventsListProps {
  events: ChiroEvent[];
}

export default function DayEventsList({ events }: DayEventsListProps) {
  return (
    <ul className="hidden flex-col gap-2 lg:flex" role="list">
      {events.map((event) => (
        <li key={event.id}>
          <div
            className={cn(
              "max-w-fit overflow-hidden overflow-ellipsis whitespace-nowrap text-nowrap rounded-md px-2 py-1 text-xs font-medium",
              EVENT_TYPE_COLORS[event.type],
            )}
          >
            {event.title}
          </div>
        </li>
      ))}
    </ul>
  );
}
