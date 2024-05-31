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

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  description: string;
  link?: string;
  linkText?: string;
}

export default function EventCard({
  title,
  date,
  time,
  description,
  link,
  linkText,
}: EventCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {date} - {time}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        {link && linkText && (
          <Button asChild variant="secondary">
            <Link href={link}>{linkText}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
