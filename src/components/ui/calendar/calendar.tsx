"use client";

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
  isSameDay,
  parseISO,
  type Locale,
  isBefore,
  startOfDay,
  addHours,
  endOfDay,
  isAfter,
} from "date-fns";
import { nl } from "date-fns/locale";

import { cn } from "~/lib/utils";
import { type ChiroEvent } from "~/types/chiro-event";
import CalendarHeader from "./calendar-header";
import DayCellContent from "./day-cell-content";

interface CalendarProps {
  events: ChiroEvent[];
  locale?: Locale;
}

function getEventsForDay(events: ChiroEvent[], day: Date): ChiroEvent[] {
  const beginningOfDay = startOfDay(day);
  return events.filter((event) => {
    const eventStart = parseISO(event.start);
    const eventEnd = parseISO(event.end);
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

export default function Calendar({ events, locale = nl }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const handlePreviousMonth = () => {
    setCurrentMonth(
      startOfMonth(
        new Date(currentMonth).setMonth(currentMonth.getMonth() - 1),
      ),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      startOfMonth(
        new Date(currentMonth).setMonth(currentMonth.getMonth() + 1),
      ),
    );
  };

  const handleTodayClick = () => {
    setCurrentMonth(new Date());
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { locale }),
    end: endOfWeek(endOfMonth(currentMonth), { locale }),
  });

  const weekdays = [...Array(7).keys()]
    .map((day) => format(daysInMonth[day]!, "EEEE", { locale }))
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1));

  return (
    <div className="max-w-7xl rounded-lg border bg-card text-card-foreground shadow-sm">
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onTodayClick={handleTodayClick}
      />
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

                  const eventsForDay = getEventsForDay(events, day);

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
                      <DayCellContent day={day} events={eventsForDay} />
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
