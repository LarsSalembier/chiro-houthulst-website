"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type WorkyearInsert } from "~/domain/entities/workyear";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { nlBE } from "date-fns/locale";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { createWorkyear } from "./actions";
import { cn } from "~/lib/utils";
import { z } from "zod";

const formSchema = z
  .object({
    id: z.number().int().positive(),
    startDate: z.date({
      required_error: "Startdatum is verplicht",
      invalid_type_error: "Startdatum moet een geldige datum zijn",
    }),
    endDate: z.date({
      required_error: "Einddatum is verplicht",
      invalid_type_error: "Einddatum moet een geldige datum zijn",
    }),
    membershipFee: z
      .number({
        required_error: "Lidgeld is verplicht",
        invalid_type_error: "Lidgeld moet een geldig getal zijn",
      })
      .positive("Lidgeld moet positief zijn"),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Startdatum moet voor einddatum liggen",
    path: ["endDate"],
  });

export default function AddWorkyearForm() {
  const form = useForm<WorkyearInsert>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      membershipFee: undefined,
    },
  });

  const onSubmit = async (data: WorkyearInsert) => {
    try {
      await createWorkyear(data);

      toast.success("Werkjaar succesvol aangemaakt!");
    } catch (error) {
      toast.error("Er is iets misgegaan bij het aanmaken van het werkjaar.");
      console.error("Error creating workyear:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Nieuw Werkjaar Toevoegen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Startdatum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: nlBE })
                          ) : (
                            <span>Selecteer een datum</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={nlBE}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Einddatum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: nlBE })
                          ) : (
                            <span>Selecteer een datum</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={nlBE}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Membership Fee */}
            <FormField
              control={form.control}
              name="membershipFee"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Lidgeld</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Bijvoorbeeld 25.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {form.formState.isSubmitting
                ? "Bezig met opslaan..."
                : "Werkjaar toevoegen"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
