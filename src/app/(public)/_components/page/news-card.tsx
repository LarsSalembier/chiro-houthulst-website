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
import Link from "next/link";
import Paragraph from "~/components/typography/paragraph";

interface NewsCardProps {
  title: string;
  date: Date;
  description: string;
  link?: string;
  linkText?: string;
}

export default function NewsCard({
  title,
  date,
  description,
  link,
  linkText,
}: NewsCardProps) {
  const formattedDate = date.toLocaleDateString("nl-BE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <time dateTime={date.toISOString()}>
            Gepubliceerd op {formattedDate}
          </time>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Paragraph>{description}</Paragraph>
      </CardContent>
      {link && (
        <CardFooter>
          <Button asChild variant="secondary" className="w-fit">
            <Link href={link}>{linkText ?? "Lees meer"}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
