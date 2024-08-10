import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { LoadingButton } from "~/components/loading/loading-button";

export default function LoadingEventCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-1/4" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-4/5" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-36 w-full" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <LoadingButton variant="secondary" />
      </CardFooter>
    </Card>
  );
}
