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
  link: string;
}

export default function EventCard({
  title,
  date,
  time,
  description,
  link,
}: EventCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Op {date} vanaf {time}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary" disabled={true}>
          <Link href={link}>Lees meer</Link>
        </Button>
      </CardFooter>
    </Card>
    // <div className="rounded-lg bg-white p-6 shadow-md">
    //   <h3 className="mb-2 text-xl font-bold">
    //     <a href={link} className="hover:text-blue-500">
    //       {title}
    //     </a>
    //   </h3>
    //   <p className="text-gray-700">
    //     <strong>Datum:</strong> {date}
    //     <br />
    //     <strong>Tijd:</strong> {time}
    //     <br />
    //     {description}
    //   </p>
    // </div>
  );
}
