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
import Paragraph from "~/components/typography/paragraph";
import Header3 from "~/components/typography/header3";

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
        <Header3>{title}</Header3>
        <Paragraph>{description}</Paragraph>
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary">
          <Link href={link}>Lees meer</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
