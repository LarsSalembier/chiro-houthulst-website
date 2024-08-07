import { cn } from "~/lib/utils";
import { ChiroEventType, type ChiroEvent } from "~/types/chiro-event";

export const EVENT_DOT_COLORS: Record<ChiroEventType, string> = {
  [ChiroEventType.CHIRO]: "bg-blue-500",
  [ChiroEventType.SPECIAL_CHIRO]: "bg-purple-500",
  [ChiroEventType.EVENT]: "bg-green-500",
  [ChiroEventType.CAMP]: "bg-yellow-500",
};

interface DayEventDotsProps {
  events: ChiroEvent[];
}

export default function DayEventDots({ events }: DayEventDotsProps) {
  return (
    <div className="mt-1 flex lg:hidden" role="list">
      {Array.from({ length: events.length }, (_, index) => (
        <span
          key={index}
          className={cn(
            "mx-0.5 h-2 w-2 rounded-full",
            events[index] && EVENT_DOT_COLORS[events[index].type],
          )}
        />
      ))}
    </div>
  );
}
