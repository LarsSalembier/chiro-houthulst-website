import React from "react";
import Image, { type StaticImageData } from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

interface AgeGroupCardProps {
  image: StaticImageData;
  title: string;
  description: string;
  link: string;
}

export default function AgeGroupCard({
  image,
  title,
  description,
  link,
}: AgeGroupCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col gap-6">
        <Image
          src={image}
          alt={`Foto van de ${title}`}
          className="h-48 w-full rounded-md object-cover"
          placeholder="blur"
        />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">{description}</CardContent>
      <CardFooter>
        <Button asChild variant="secondary">
          <Link href={link}>Lees meer</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
