import React from "react";
import Image, { type StaticImageData } from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
      <CardHeader>
        <Image
          src={image}
          alt={`Foto van de ${title}`}
          className="h-48 w-full rounded-md object-cover"
          placeholder="blur"
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary">
          <Link href={link}>Lees meer</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
