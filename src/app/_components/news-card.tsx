import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface NewsCardProps {
  title: string;
  date: string;
  description: string;
  link: string;
}

export default function NewsCard({
  title,
  date,
  description,
  link,
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
        <a href={link} className="text-blue-500 hover:underline">
          Lees meer
        </a>
      </CardFooter>
    </Card>
  );
}
