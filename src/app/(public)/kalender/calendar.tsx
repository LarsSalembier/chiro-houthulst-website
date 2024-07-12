"use client";

import FullCalendar from "@fullcalendar/react";
import nlLocale from "@fullcalendar/core/locales/nl";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { type ChiroEvent, type ChiroEventType } from "~/types/chiro-event";

const eventColorPalette = [
  "#ffca3a",
  "#8ac926",
  "#1982c4",
  "#6a4c93",
  "#ff595e",
];

const assignedEventColors: { [key in ChiroEventType]?: string } = {};

function getBgColorForEventType(type: ChiroEventType): string {
  if (!assignedEventColors[type]) {
    const randomIndex = Math.floor(Math.random() * eventColorPalette.length);
    assignedEventColors[type] = eventColorPalette[randomIndex];
  }

  return assignedEventColors[type]!;
}

function renderEventContent(eventInfo: {
  event: {
    title: string;
    extendedProps: {
      type: ChiroEventType;
    };
  };
}) {
  const event = eventInfo.event;
  const eventType = event.extendedProps.type;

  const eventBgColor = getBgColorForEventType(eventType);

  return (
    <div
      className="fc-event-main whitespace-normal text-wrap break-words rounded-md 
                 px-2 py-1 text-xs font-light sm:px-3 sm:py-2 sm:text-sm sm:font-medium"
      style={{
        backgroundColor: eventBgColor,
        color: "white",
      }}
    >
      <b>{event.title}</b>
    </div>
  );
}

interface CalendarProps {
  events: ChiroEvent[];
}

export default function Calendar({ events }: CalendarProps) {
  return (
    <div className="pb-8 md:pb-12 lg:pb-12">
      <FullCalendar
        locale={nlLocale}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        initialView="dayGridMonth"
        nowIndicator={true}
        editable={false}
        selectable={false}
        selectMirror={false}
        initialEvents={events}
        eventContent={renderEventContent}
      />
    </div>
  );
}
