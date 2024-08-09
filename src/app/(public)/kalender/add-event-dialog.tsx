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
import { CalendarIcon, PlusIcon } from "lucide-react";
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
import { format, getHours, set } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import TimePicker from "~/components/ui/date-time-picker/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  type CreateEventData,
  createEventSchema,
} from "~/server/schemas/create-event-schema";
import { useState } from "react";
import { nlBE } from "date-fns/locale";
import { type Event } from "~/server/db/schema";
import { addEventAndRevalidateCalendar } from "./actions";

interface AddEventDialogProps {
  startDate: Date;
  lastAddedEvent?: Event;
}

export default function AddEventDialog({
  startDate,
  lastAddedEvent,
}: AddEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultStartDate = set(startDate, {
    hours: getHours(lastAddedEvent?.startDate ?? startDate),
    minutes: lastAddedEvent?.startDate.getMinutes() ?? 0,
  });

  const defaultEndDate = set(startDate, {
    hours: getHours(lastAddedEvent?.endDate ?? startDate),
    minutes: lastAddedEvent?.endDate.getMinutes() ?? 0,
  });

  const form = useForm<CreateEventData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: lastAddedEvent?.title ?? "",
      description: lastAddedEvent?.description ?? "",
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      location:
        lastAddedEvent?.location ?? "Chiroheem - Jonkershovestraat 101s",
      facebookEventUrl: lastAddedEvent?.facebookEventUrl ?? "",
      eventType: lastAddedEvent?.eventType ?? "chiro",
    },
  });

  async function onSubmit(values: CreateEventData) {
    setIsLoading(true);
    await addEventAndRevalidateCalendar(values);
    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="z-100 h-6 w-6 self-end lg:h-8 lg:w-8"
        >
          <PlusIcon className="h-3 w-3 text-foreground lg:h-4 lg:w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voeg een evenement toe</DialogTitle>
          <DialogDescription>
            Vul onderstaand formulier in om een evenement toe te voegen aan de
            kalender.
          </DialogDescription>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                    {isLoading ? "Opslaan..." : "Evenement toevoegen"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
