"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import nlLocale from "@fullcalendar/core/locales/nl";
import { Button } from "~/components/ui/button";
import Link from "next/link";

const events = [
  {
    id: "chiro-okt-1",
    title: "Chiro",
    start: "2023-10-01T14:00:00",
    end: "2023-10-01T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-okt-8",
    title: "Chiro",
    start: "2023-10-08T14:00:00",
    end: "2023-10-08T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-okt-15",
    title: "Chiro",
    start: "2023-10-15T14:00:00",
    end: "2023-10-15T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-okt-22",
    title: "Chiro - Vriendjesdag",
    start: "2023-10-22T14:00:00",
    end: "2023-10-22T17:00:00",
    classNames: ["chiro", "vriendjesdag"],
  },
  {
    id: "openlucht-cinema",
    title: "Openluchtcinema",
    start: "2023-10-27T19:00:00",
    end: "2023-10-27T22:00:00",
    classNames: ["cinema"],
  },
  {
    id: "chiro-okt-29",
    title: "Chiro",
    start: "2023-10-29T14:00:00",
    end: "2023-10-29T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-nov-5",
    title: "Chiro",
    start: "2023-11-05T14:00:00",
    end: "2023-11-05T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "sint-maarten",
    title: "Chiro - Sint-Maarten",
    start: "2023-11-12T14:00:00",
    end: "2023-11-12T17:00:00",
    classNames: ["chiro", "sint-maarten"],
  },
  {
    id: "chiro-nov-19",
    title: "Chiro",
    start: "2023-11-19T14:00:00",
    end: "2023-11-19T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-nov-26",
    title: "Chiro",
    start: "2023-11-26T14:00:00",
    end: "2023-11-26T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-dec-3",
    title: "Chiro",
    start: "2023-12-03T14:00:00",
    end: "2023-12-03T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-dec-10",
    title: "Chiro",
    start: "2023-12-10T14:00:00",
    end: "2023-12-10T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-dec-17",
    title: "Chiro",
    start: "2023-12-17T14:00:00",
    end: "2023-12-17T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "kerstfeestje",
    title: "Kerstfeestje",
    start: "2023-12-23T18:00:00",
    end: "2023-12-23T20:00:00",
    classNames: ["feest"],
  },
  {
    id: "kerstmarkt",
    title: "Kerstmarkt",
    start: "2023-12-24T14:00:00",
    end: "2023-12-25T02:00:00",
    classNames: ["markt"],
  },
  {
    id: "chiro-jan-7",
    title: "Chiro",
    start: "2024-01-07T14:00:00",
    end: "2024-01-07T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-jan-14",
    title: "Chiro",
    start: "2024-01-14T14:00:00",
    end: "2024-01-14T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-jan-21",
    title: "Chiro",
    start: "2024-01-21T14:00:00",
    end: "2024-01-21T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-jan-28",
    title: "Chiro",
    start: "2024-01-28T14:00:00",
    end: "2024-01-28T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-feb-4",
    title: "Chiro",
    start: "2024-02-04T14:00:00",
    end: "2024-02-04T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "aspicafe",
    title: "Aspicafé",
    start: "2024-02-09T21:00:00",
    end: "2024-02-10T04:00:00",
    classNames: ["chirocafe"],
  },
  {
    id: "chiro-feb-11",
    title: "Chiro",
    start: "2024-02-11T14:00:00",
    end: "2024-02-11T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-feb-18",
    title: "Chiro",
    start: "2024-02-18T14:00:00",
    end: "2024-02-18T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-feb-25",
    title: "Chiro",
    start: "2024-02-25T14:00:00",
    end: "2024-02-25T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-mrt-3",
    title: "Chiro",
    start: "2024-03-03T14:00:00",
    end: "2024-03-03T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-mrt-10",
    title: "Chiro",
    start: "2024-03-10T14:00:00",
    end: "2024-03-10T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-mrt-17",
    title: "Chiro",
    start: "2024-03-17T14:00:00",
    end: "2024-03-17T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-mrt-24",
    title: "Chiro",
    start: "2024-03-24T14:00:00",
    end: "2024-03-24T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-apr-7",
    title: "Chiro - Vriendjesdag",
    start: "2024-04-07T14:00:00",
    end: "2024-04-07T17:00:00",
    classNames: ["chiro", "vriendjesdag"],
  },
  {
    id: "chiro-apr-21",
    title: "Chiro",
    start: "2024-04-21T14:00:00",
    end: "2024-04-21T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-apr-28",
    title: "Chiro",
    start: "2024-04-28T14:00:00",
    end: "2024-04-28T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "voetbalcompetitie",
    title: "Voetbalcompetitie",
    start: "2024-05-01T08:00:00",
    end: "2024-05-01T18:00:00",
    classNames: ["sport"],
  },
  {
    id: "chiro-mei-5",
    title: "Chiro",
    start: "2024-05-05T14:00:00",
    end: "2024-05-05T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chirocafe",
    title: "CHIROCAFÉ",
    start: "2024-05-09T11:30:00",
    end: "2024-05-10T04:00:00",
    classNames: ["chiro", "cafe"],
  },
  {
    id: "chiro-mei-19",
    title: "Chiro",
    start: "2024-05-19T14:00:00",
    end: "2024-05-19T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-mei-26",
    title: "Chiro",
    start: "2024-05-26T14:00:00",
    end: "2024-05-26T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-jun-2",
    title: "Chiro",
    start: "2024-06-02T14:00:00",
    end: "2024-06-02T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-jun-9",
    title: "Chiro",
    start: "2024-06-09T14:00:00",
    end: "2024-06-09T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-jun-16",
    title: "Chiro",
    start: "2024-06-16T14:00:00",
    end: "2024-06-16T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "chiro-jun-23",
    title: "Chiro",
    start: "2024-06-23T14:00:00",
    end: "2024-06-23T17:00:00",
    classNames: ["chiro"],
  },
  {
    id: "groepsuitstap",
    title: "Groepsuitstap",
    start: "2024-06-30T08:00:00",
    end: "2024-06-30T18:00:00",
    classNames: ["uitstap"],
  },
  {
    id: "chirokamp",
    title: "Chirokamp",
    start: "2024-07-20T08:00:00",
    end: "2024-07-30T14:00:00",
    classNames: ["chiro", "kamp"],
  },
  {
    id: "inschrijvingen-chirokamp-1",
    title: "Inschrijvingen Chirokamp",
    start: "2024-06-28T18:00:00",
    end: "2024-06-28T21:00:00",
    classNames: ["chiro", "inschrijvingen"],
  },
  {
    id: "inschrijvingen-chirokamp-2",
    title: "Inschrijvingen Chirokamp",
    start: "2024-06-29T14:00:00",
    end: "2024-06-29T18:00:00",
    classNames: ["chiro", "inschrijvingen"],
  },
  {
    id: "valiezen-chirokamp-1",
    title: "Valiezen binnenbrengen Chirokamp",
    start: "2024-07-13T10:00:00",
    end: "2024-07-13T18:00:00",
    classNames: ["chiro", "valiezen"],
  },
  {
    id: "valiezen-chirokamp-2",
    title: "Valiezen binnenbrengen Chirokamp",
    start: "2024-07-14T10:00:00",
    end: "2024-07-14T14:00:00",
    classNames: ["chiro", "valiezen"],
  },
  {
    id: "camion-laden-chirokamp-1",
    title: "Camion laden Chirokamp",
    start: "2024-07-13T8:00:00",
    end: "2024-07-13T18:00:00",
    classNames: ["chiro", "camion"],
  },
  {
    id: "camion-laden-chirokamp-2",
    title: "Camion laden Chirokamp",
    start: "2024-07-14T9:00:00",
    end: "2024-07-14T14:00:00",
    classNames: ["chiro", "camion"],
  },
  {
    id: "nawacht",
    title: "Nawacht (aspi's en leiding)",
    start: "2024-07-30T14:00:00",
    end: "2024-07-31T19:00:00",
    classNames: ["chiro", "valiezen"],
  },
];

export default function Calendar() {
  return (
    <div className="flex flex-col gap-4">
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
        editable={true}
        selectable={true}
        selectMirror={true}
        initialEvents={events}
      />
      <Button asChild>
        <Link href="kalender.jpg" download="kalender.jpg" className="w-fit">
          Download afprintbare kalender
        </Link>
      </Button>
    </div>
  );
}
