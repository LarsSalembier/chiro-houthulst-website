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
import { type Event } from "~/server/db/schema";
import { isLeiding } from "~/lib/auth";
import UpdateEventDialog from "../../../components/dialogs/update-event-dialog";
import DeleteEventDialog from "../../../components/dialogs/delete-event-dialog";
import { format, isSameDay } from "date-fns";
import { nlBE } from "date-fns/locale";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  let dateTimeString = "";
  if (isSameDay(event.startDate, event.endDate)) {
    // Same day event
    dateTimeString = `${format(event.startDate, "PPP", {
      locale: nlBE,
    })} van ${format(event.startDate, "HH:mm", {
      locale: nlBE,
    })} tot ${format(event.endDate, "HH:mm", {
      locale: nlBE,
    })}`;
  } else {
    // Multi-day event
    dateTimeString = `Van ${format(event.startDate, "PPP HH:mm", {
      locale: nlBE,
    })} tot ${format(event.endDate, "PPP HH:mm", {
      locale: nlBE,
    })}`;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          <time dateTime={event.startDate.toISOString()}>{dateTimeString}</time>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {event.description}
        {event.location ? (
          <>
            <br />
            Locatie: {event.location}
          </>
        ) : (
          <></>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {event.facebookEventUrl && (
          <Button asChild variant="secondary">
            <Link href={event.facebookEventUrl}>Facebook-evenement</Link>
          </Button>
        )}
        {isLeiding() && (
          <>
            <DeleteEventDialog event={event} />
            <UpdateEventDialog event={event} />
          </>
        )}
      </CardFooter>
    </Card>
  );
}
