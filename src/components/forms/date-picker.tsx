import React from "react";
import {
  type UseFormReturn,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { format } from "date-fns";
import { nlBE } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";

interface DatePickerProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
}

export default function DatePicker<TFieldValues extends FieldValues>({
  form,
  name,
  label,
}: DatePickerProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <span>
                    {field.value
                      ? format(field.value, "PPP", {
                          locale: nlBE,
                        })
                      : "Selecteer geboortedatum"}
                  </span>
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                locale={nlBE}
                captionLayout="dropdown"
                fromYear={1950}
                toYear={new Date().getFullYear() + 1}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
