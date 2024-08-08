import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { UnorderedList } from "~/components/typography/lists";
import DayEventDots from "./day-event-dots";
import DayEventsList from "./day-events-list";
import AddEventDialog from "../add-event-dialog";
import React, { useState } from "react";
import { type Event } from "~/server/db/schema";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteEvent } from "../actions";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);

  const hasEvents = events.length > 0;

  async function handleDeleteEvent(eventId: number) {
    setIsLoading(true);
    try {
      await deleteEvent(eventId);
      toast.success(`Evenement succesvol verwijderd van de kalender.`);
    } catch (error) {
      toast.error(
        "Er is een fout opgetreden bij het verwijderen van het evenement.",
      );
      console.error("Error removing event:", error);
    } finally {
      setIsLoading(false);
    }
  }

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
            <UnorderedList className="flex flex-col gap-4 py-4">
              {events.map((event) => {
                return (
                  <li key={event.id} className="space-y-1">
                    <h4 className="text-lg font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
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
                    </p>
                    <p className="text-sm">{event.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                    <div className="flex gap-2">
                      {event.facebookEventUrl && (
                        <Button asChild size="sm">
                          <Link href={event.facebookEventUrl} target="_blank">
                            Bekijk op Facebook
                          </Link>
                        </Button>
                      )}
                      {userCanEdit && (
                        <Button
                          size="sm"
                          type="submit"
                          variant="destructive"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Evenement verwijderen..."
                            : "Evenement verwijderen"}
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </UnorderedList>
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
