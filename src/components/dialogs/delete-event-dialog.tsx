"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { nlBE } from "date-fns/locale";
import { type Event } from "~/server/db/schema";
import { deleteEventAndRevalidate } from "./actions";
import { toast } from "sonner";
import { AuthenticationError, AuthorizationError } from "~/lib/errors";

interface DeleteEventDialogProps {
  event: Event;
}

export default function DeleteEventDialog({ event }: DeleteEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function deleteEvent() {
    setIsLoading(true);
    try {
      await deleteEventAndRevalidate(event.id);
      toast.success(
        `${event.title} (${format(event.startDate, "PPP HH:mm", {
          locale: nlBE,
        })}) succesvol verwijderd.`,
      );
    } catch (error) {
      if (error instanceof AuthenticationError) {
        toast.error("Je bent niet ingelogd.");
      } else if (error instanceof AuthorizationError) {
        toast.error(
          "Je hebt geen toestemming om een evenement aan te verwijderen.",
        );
      } else {
        toast.error(
          `Er is een fout opgetreden bij het verwijderen van ${event.title} (${format(
            event.startDate,
            "PPP HH:mm",
            { locale: nlBE },
          )}).`,
        );
      }
    }
    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" type="submit" variant="destructive">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verwijder {event.title}</DialogTitle>
          <DialogDescription>
            Ben je zeker dat je {event.title} (
            {format(event.startDate, "PPP", {
              locale: nlBE,
            })}
            ) wil verwijderen?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsLoading(false)}
          >
            Annuleren
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={deleteEvent}
            disabled={isLoading}
          >
            Verwijderen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
