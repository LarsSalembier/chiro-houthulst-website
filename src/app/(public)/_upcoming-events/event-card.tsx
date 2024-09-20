import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Event } from "drizzle/schema";
import { isLeiding } from "~/lib/auth";
import UpdateEventDialog from "../../../components/dialogs/update-event-dialog";
import DeleteEventDialog from "../../../components/dialogs/delete-event-dialog";
import { format, isSameDay } from "date-fns";
import { nlBE } from "date-fns/locale";
import { Icons } from "~/components/icons";

function formatEventDateTime(startDate: Date, endDate: Date): string {
  if (isSameDay(startDate, endDate)) {
    return `${format(startDate, "PPP", { locale: nlBE })} van ${format(
      startDate,
      "HH:mm",
      { locale: nlBE },
    )} tot ${format(endDate, "HH:mm", { locale: nlBE })}`;
  } else {
    return `Van ${format(startDate, "PPP HH:mm", {
      locale: nlBE,
    })} tot ${format(endDate, "PPP HH:mm", { locale: nlBE })}`;
  }
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const dateTimeString = formatEventDateTime(event.startDate, event.endDate);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          <time dateTime={event.startDate.toISOString()}>{dateTimeString}</time>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">{event.description}</CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        {event.location && (
          <div className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-muted p-2 text-sm font-medium">
            <Icons.MapPin className="h-4 w-4" /> {event.location}
          </div>
        )}
        <div className="flex w-full flex-wrap gap-2">
          {event.facebookEventUrl && (
            <Button asChild variant="secondary" className="w-full">
              <Link href={event.facebookEventUrl}>Facebook-evenement</Link>
            </Button>
          )}
          {isLeiding() && (
            <>
              <DeleteEventDialog event={event} />
              <UpdateEventDialog event={event} />
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
