import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import DayEventDots from "./day-event-dots";
import DayEventsList from "./day-events-list";
import AddEventDialog from "../add-event-dialog";
import React from "react";
import { type Event } from "~/server/db/schema";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Header4 } from "~/components/typography/headers";
import { MutedText, Paragraph } from "~/components/typography/text";
import UpdateEventDialog from "../update-event-dialog";
import DeleteEventDialog from "../delete-event-dialog";

interface DayCellContentProps {
  day: Date;
  events: Event[];
  userCanEdit: boolean;
  lastAddedEvent?: Event;
}

export default function DayCellContent({
  day,
  events,
  userCanEdit,
  lastAddedEvent,
}: DayCellContentProps) {
  const hasEvents = events.length > 0;

  return (
    <>
      {hasEvents ? (
        <Dialog>
          <div
            aria-label={`Evenementen op ${format(day, "MMMM dd, yyyy", {
              locale: nl,
            })}`}
            className="flex h-full w-full flex-col justify-between gap-2 p-2 lg:gap-4"
          >
            <DialogTrigger asChild>
              <div className="flex flex-col gap-2 lg:gap-4" role="button">
                <span className="self-end text-xs font-light lg:self-start">
                  {day.getDate()}
                </span>
                <DayEventsList events={events} />
                <DayEventDots events={events} />
              </div>
            </DialogTrigger>
            {userCanEdit && (
              <AddEventDialog startDate={day} lastAddedEvent={lastAddedEvent} />
            )}
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {format(day, "dd MMMM yyyy", { locale: nl })}
              </DialogTitle>
            </DialogHeader>
            <ul className="flex flex-col gap-4 py-4">
              {events.map((event) => {
                return (
                  <li key={event.id} className="space-y-2">
                    <Header4>{event.title}</Header4>
                    <MutedText className="text-sm text-muted-foreground">
                      {isSameDay(event.startDate, event.endDate)
                        ? `Van ${format(event.startDate, "HH:mm", {
                            locale: nl,
                          })} tot ${format(event.endDate, "HH:mm", {
                            locale: nl,
                          })}`
                        : `Vanaf ${format(event.startDate, "dd MMMM", {
                            locale: nl,
                          })} om ${format(event.endDate, "HH:mm", {
                            locale: nl,
                          })} tot en met ${format(event.endDate, "dd MMMM", {
                            locale: nl,
                          })} om ${format(event.endDate, "HH:mm", {
                            locale: nl,
                          })}`}
                      <br />
                      Locatie: {event.location}
                    </MutedText>
                    <Paragraph>{event.description}</Paragraph>
                    <div className="flex gap-2">
                      {event.facebookEventUrl && (
                        <Button asChild size="sm">
                          <Link href={event.facebookEventUrl} target="_blank">
                            Bekijk op Facebook
                          </Link>
                        </Button>
                      )}
                      {userCanEdit && (
                        <>
                          <DeleteEventDialog event={event} />
                          <UpdateEventDialog event={event} />
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex h-full w-full flex-col justify-between p-2 lg:gap-4">
              <span className="self-end text-xs font-light lg:self-start">
                {day.getDate()}
              </span>
              <DayEventsList events={events} />
              <DayEventDots events={events} />
              {userCanEdit && (
                <AddEventDialog
                  startDate={day}
                  lastAddedEvent={lastAddedEvent}
                />
              )}
            </div>
          </DialogTrigger>
        </Dialog>
      )}
    </>
  );
}
