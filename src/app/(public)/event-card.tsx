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
import { isLeiding } from "~/utils/auth";
import UpdateEventDialog from "./kalender/update-event-dialog";
import DeleteEventDialog from "./kalender/delete-event-dialog";

interface EventCardProps {
  event: Event;
}

const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

const timeOptions = {
  hour: "numeric",
  minute: "numeric",
} as const;

export default function EventCard({ event }: EventCardProps) {
  let dateTimeString = "";
  if (event.startDate.toDateString() === event.startDate.toDateString()) {
    // Same day event
    dateTimeString = `${event.startDate.toLocaleDateString(undefined, dateOptions)} van ${event.startDate.toLocaleTimeString(
      undefined,
      timeOptions,
    )} tot ${event.endDate.toLocaleTimeString(undefined, timeOptions)}`;
  } else {
    // Multi-day event
    dateTimeString = `Van ${event.startDate.toLocaleDateString(undefined, dateOptions)} ${event.startDate.toLocaleTimeString(
      undefined,
      timeOptions,
    )} tot ${event.endDate.toLocaleDateString(undefined, dateOptions)} ${event.endDate.toLocaleTimeString(
      undefined,
      timeOptions,
    )}`;
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
