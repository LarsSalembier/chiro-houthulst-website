import Link from "next/link";
import React from "react";
import Paragraph from "~/components/typography/paragraph";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface EventCardProps {
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  link?: string;
  linkText?: string;
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

export default function EventCard({
  title,
  startDate,
  endDate,
  description,
  link,
  linkText,
}: EventCardProps) {
  let dateTimeString = "";
  if (startDate.toDateString() === endDate.toDateString()) {
    // Same day event
    dateTimeString = `${startDate.toLocaleDateString(undefined, dateOptions)} van ${startDate.toLocaleTimeString(
      undefined,
      timeOptions,
    )} tot ${endDate.toLocaleTimeString(undefined, timeOptions)}`;
  } else {
    // Multi-day event
    dateTimeString = `Van ${startDate.toLocaleDateString(undefined, dateOptions)} ${startDate.toLocaleTimeString(
      undefined,
      timeOptions,
    )} tot ${endDate.toLocaleDateString(undefined, dateOptions)} ${endDate.toLocaleTimeString(
      undefined,
      timeOptions,
    )}`;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <time dateTime={startDate.toISOString()}>{dateTimeString}</time>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Paragraph>{description}</Paragraph>
      </CardContent>
      {link && (
        <CardFooter>
          <Button asChild variant="secondary" className="w-fit">
            <Link href={link}>{linkText || "Lees meer"}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
