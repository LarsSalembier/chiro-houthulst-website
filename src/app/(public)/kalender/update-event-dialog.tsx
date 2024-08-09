"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { CalendarIcon, EditIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import TimePicker from "~/components/ui/date-time-picker/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import { nlBE } from "date-fns/locale";
import { type Event } from "~/server/db/schema";
import { updateEventAndRevalidate } from "./actions";
import {
  type UpdateEventData,
  updateEventSchema,
} from "~/server/schemas/event-schemas";
import { toast } from "sonner";
import { AuthenticationError, AuthorizationError } from "~/utils/errors";

interface UpdateEventDialogProps {
  event: Event;
}

export default function UpdateEventDialog({ event }: UpdateEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateEventData>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: event.title,
      description: event.description ?? "",
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location ?? "",
      facebookEventUrl: event.facebookEventUrl ?? "",
      eventType: event.eventType,
    },
  });

  async function onSubmit(values: UpdateEventData) {
    setIsLoading(true);
    try {
      await updateEventAndRevalidate(event.id, values);
      toast.success(
        `${values.title} (${format(values.startDate, "PPP HH:mm", {
          locale: nlBE,
        })}) succesvol aangepast.`,
      );
    } catch (error) {
      if (error instanceof AuthenticationError) {
        toast.error("Je bent niet ingelogd.");
      } else if (error instanceof AuthorizationError) {
        toast.error("Je hebt geen toestemming om een evenement aan te passen.");
      } else {
        toast.error(
          `Er is een fout opgetreden bij het aanpassen van ${values.title} (${format(
            values.startDate,
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
        <Button size="icon" type="submit" variant="secondary">
          <EditIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bewerk {event.title}</DialogTitle>
          <DialogDescription>
            Vul onderstaand formulier in om het evenement aan te passen.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naam evenement</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beschrijving</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-left">
                      Startdatum en -tijd
                    </FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP HH:mm", {
                                locale: nlBE,
                              })
                            ) : (
                              <span>Kies een startdatum</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="border-t border-border p-3">
                          <TimePicker
                            setDate={field.onChange}
                            date={field.value}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-left">
                      Einddatum en -tijd
                    </FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP HH:mm", {
                                locale: nlBE,
                              })
                            ) : (
                              <span>Kies een einddatum</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="border-t border-border p-3">
                          <TimePicker
                            setDate={field.onChange}
                            date={field.value}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locatie</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebookEventUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Facebook-evenement</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soort evenement</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer een soort evenement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="chiro">
                          Gewone Chirozondag
                        </SelectItem>
                        <SelectItem value="special_chiro">
                          Evenement voor leden / speciale Chirozondag
                        </SelectItem>
                        <SelectItem value="event">
                          Openbaar evenement
                        </SelectItem>
                        <SelectItem value="camp">
                          Chirokamp (en camion etc.)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-4">
                <Button variant="outline">Annuleren</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Opslaan..." : "Wijzigingen opslaan"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
