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
  type Locale,
} from "date-fns";
import { nlBE } from "date-fns/locale";

import { cn } from "~/lib/utils";
import CalendarHeader from "./calendar-header";
import DayCellContent from "./day-cell-content";
import { type Event } from "~/server/db/schema";
import { getEventsForDay } from "./calendar-utils";

interface CalendarProps {
  events: Event[];
  locale?: Locale;
  userCanEdit: boolean;
}

export default function Calendar({
  events,
  locale = nlBE,
  userCanEdit,
}: CalendarProps) {
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
                      <DayCellContent
                        day={day}
                        events={eventsForDay}
                        userCanEdit={userCanEdit}
                        lastAddedEvent={events[events.length - 1]}
                      />
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
