import React from "react";
import Image, { type StaticImageData } from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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
        <a href={link} className="text-blue-500 hover:underline">
          Lees meer
        </a>
      </CardFooter>
    </Card>
    // <div className="rounded-lg bg-white p-6 shadow-md">
    //   <Image
    //     src={image}
    //     alt={`Foto van de ${title}`}
    //     className="mb-4 h-48 w-full rounded-md object-cover"
    //     placeholder="blur"
    //   />
    //   <h3 className="mb-2 text-xl font-bold">
    //     <a href={link} className="hover:text-blue-500">
    //       {title}
    //     </a>
    //   </h3>
    //   <p className="text-gray-700">{description}</p>
    // </div>
  );
}
