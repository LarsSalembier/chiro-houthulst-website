import * as React from "react";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  type Locale,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { nlBE } from "date-fns/locale";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Skeleton } from "../ui/skeleton";

function DayEventsList({ eventCount }: { eventCount: number }) {
  return (
    <ul className="hidden flex-col gap-2 lg:flex" role="list">
      {Array.from({ length: eventCount }).map((_, index) => (
        <li key={index}>
          <Skeleton
            className={cn(
              "h-6 min-w-28 max-w-fit overflow-hidden rounded-md px-2 py-1",
              Math.random() > 0.75
                ? "bg-blue-200"
                : Math.random() > 0.5
                  ? "bg-purple-300"
                  : Math.random() > 0.25
                    ? "bg-green-200"
                    : "bg-yellow-200",
            )}
          />
        </li>
      ))}
    </ul>
  );
}

function DayEventDots({ eventCount }: { eventCount: number }) {
  return (
    <div className="mt-1 flex lg:hidden" role="list">
      {Array.from({ length: eventCount }, (_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "mx-0.5 h-2 w-2 rounded-full",
            Math.random() > 0.75
              ? "bg-blue-500"
              : Math.random() > 0.5
                ? "bg-purple-500"
                : Math.random() > 0.25
                  ? "bg-green-500"
                  : "bg-yellow-500",
          )}
        />
      ))}
    </div>
  );
}

function CalendarHeader({ currentMonth }: { currentMonth: Date }) {
  return (
    <div className="flex items-center justify-between p-4">
      <h2 className="text-xl font-semibold">
        {format(currentMonth, "MMMM yyyy", { locale: nlBE })}
      </h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Vorige maand</span>
        </Button>
        <Button variant="outline" disabled className="hidden md:inline-flex">
          Vandaag
        </Button>
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Volgende maand</span>
        </Button>
      </div>
    </div>
  );
}

function DayCellContent({ day }: { day: Date }) {
  const eventCount = Math.random() > 0.95 ? 2 : Math.random() > 0.8 ? 1 : 0;
  const hasEvents = eventCount > 0;

  return (
    <>
      {!hasEvents ? (
        <div
          role="button"
          aria-label={`Evenementen op ${format(day, "MMMM dd, yyyy", {
            locale: nlBE,
          })}`}
          className="flex h-full w-full flex-col justify-between p-2 lg:justify-normal lg:gap-4"
        >
          <span className="self-end text-xs font-light lg:self-start">
            {day.getDate()}
          </span>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-between p-2 lg:justify-normal lg:gap-4">
          <span className="self-end text-xs font-light lg:self-start">
            {day.getDate()}
          </span>
          <DayEventsList eventCount={eventCount} />
          <DayEventDots eventCount={eventCount} />
        </div>
      )}
    </>
  );
}

interface LoadingCalendarProps {
  locale?: Locale;
}

export default function LoadingCalendar({
  locale = nlBE,
}: LoadingCalendarProps) {
  const currentMonth = new Date();

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { locale }),
    end: endOfWeek(endOfMonth(currentMonth), { locale }),
  });

  const weekdays = [...Array(7).keys()]
    .map((day) => format(daysInMonth[day]!, "EEEE", { locale }))
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1));

  return (
    <div className="max-w-7xl rounded-lg border bg-card text-card-foreground shadow-sm">
      <CalendarHeader currentMonth={currentMonth} />
      <table
        className="w-full table-fixed border-collapse"
        aria-label="Kalender"
      >
        <thead>
          <tr className="divide-x border-y text-sm">
            {weekdays.map((day) => (
              <th key={day} className="p-2 text-center font-medium" scope="col">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.slice(0, 2)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <tr key={weekIndex} className="relative divide-x border-y">
              {daysInMonth
                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                .map((day) => {
                  if (!day) return null;

                  return (
                    <td
                      key={day.toString()}
                      className={cn(
                        "h-14 w-full text-sm font-medium lg:h-28",
                        isSameMonth(day, currentMonth)
                          ? "bg-white"
                          : "bg-gray-100",
                        isToday(day) && "bg-blue-500 text-white",
                      )}
                    >
                      <DayCellContent day={day} />
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
