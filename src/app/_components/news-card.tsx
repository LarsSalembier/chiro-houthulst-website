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

interface NewsCardProps {
  title: string;
  date: string;
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
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Gepubliceerd op {date}</CardDescription>
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
