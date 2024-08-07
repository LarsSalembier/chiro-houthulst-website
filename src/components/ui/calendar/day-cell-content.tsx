import { type ChiroEvent } from "~/types/chiro-event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { format, isSameDay, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { UnorderedList } from "~/components/typography/lists";
import DayEventDots from "./day-event-dots";
import DayEventsList from "./day-events-list";

interface DayCellContentProps {
  day: Date;
  events: ChiroEvent[];
}

export default function DayCellContent({ day, events }: DayCellContentProps) {
  const hasEvents = events.length > 0;
  return (
    <>
      {hasEvents ? (
        <Dialog>
          <DialogTrigger asChild>
            <div
              role="button"
              aria-label={`Evenementen op ${format(day, "MMMM dd, yyyy", {
                locale: nl,
              })}`}
              className="flex h-full w-full flex-col justify-between p-2 lg:justify-normal lg:gap-4"
            >
              <span className="self-end text-xs font-light lg:self-start">
                {day.getDate()}
              </span>
              <DayEventsList events={events} />
              <DayEventDots events={events} />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {format(day, "dd MMMM yyyy", { locale: nl })}
              </DialogTitle>
              <DialogDescription>
                Wat we organiseren op {format(day, "dd MMMM", { locale: nl })}.
              </DialogDescription>
            </DialogHeader>
            <UnorderedList className="flex flex-col gap-4 py-4">
              {events.map((event) => (
                <li key={event.id}>
                  <h4 className="text-lg font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {isSameDay(parseISO(event.start), parseISO(event.end))
                      ? `Van ${format(parseISO(event.start), "HH:mm", {
                          locale: nl,
                        })} tot ${format(parseISO(event.end), "HH:mm", {
                          locale: nl,
                        })}`
                      : `Vanaf ${format(parseISO(event.start), "dd MMMM", {
                          locale: nl,
                        })} om ${format(parseISO(event.start), "HH:mm", {
                          locale: nl,
                        })} tot en met ${format(
                          parseISO(event.end),
                          "dd MMMM",
                          {
                            locale: nl,
                          },
                        )} om ${format(parseISO(event.end), "HH:mm", {
                          locale: nl,
                        })}`}
                  </p>
                </li>
              ))}
            </UnorderedList>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="flex h-full w-full flex-col justify-between p-2 lg:justify-normal lg:gap-4">
          <span className="self-end text-xs font-light lg:self-start">
            {day.getDate()}
          </span>
          <DayEventsList events={events} />
          <DayEventDots events={events} />
        </div>
      )}
    </>
  );
}
