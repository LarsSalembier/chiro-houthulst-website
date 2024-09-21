"use client";

import {
  MAX_GROUP_COLOR_LENGTH,
  MAX_GROUP_NAME_LENGTH,
  MAX_URL_LENGTH,
} from "drizzle/schema";
import { genderEnumSchema } from "~/domain/enums/gender";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { createGroup } from "../actions";

const groupFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "De groepsnaam moet minstens 3 tekens bevatten" })
      .max(MAX_GROUP_NAME_LENGTH, {
        message: `De groepsnaam mag maximaal ${MAX_GROUP_NAME_LENGTH} tekens bevatten`,
      }),
    color: z
      .string()
      .trim()
      .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, {
        message: "Voer een geldige hexadecimale kleurcode in (bijv. #FFFFFF)",
      })
      .max(MAX_GROUP_COLOR_LENGTH, {
        message: `De kleurcode mag maximaal ${MAX_GROUP_COLOR_LENGTH} tekens bevatten`,
      })
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, { message: "De beschrijving moet minstens 3 tekens bevatten" })
      .optional(),
    minimumAgeInDays: z.coerce
      .number({
        required_error: "Minimumleeftijd is verplicht",
        invalid_type_error: "Minimumleeftijd moet een getal zijn",
      })
      .int({ message: "Minimumleeftijd moet een geheel getal zijn" })
      .nonnegative({ message: "Minimumleeftijd kan niet negatief zijn" }),
    maximumAgeInDays: z.coerce
      .number({
        invalid_type_error: "Maximumleeftijd moet een getal zijn",
      })
      .int({ message: "Maximumleeftijd moet een geheel getal zijn" })
      .positive({ message: "Maximumleeftijd moet positief zijn" })
      .optional(),
    gender: genderEnumSchema.nullable(),
    active: z.boolean().default(true),
    mascotImageUrl: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .trim()
        .url({ message: "Voer een geldige URL in" })
        .max(MAX_URL_LENGTH, {
          message: `De URL mag maximaal ${MAX_URL_LENGTH} tekens bevatten`,
        })
        .optional(),
    ),
    coverImageUrl: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .trim()
        .url({ message: "Voer een geldige URL in" })
        .max(MAX_URL_LENGTH, {
          message: `De URL mag maximaal ${MAX_URL_LENGTH} tekens bevatten`,
        })
        .optional(),
    ),
  })
  .refine((data) => {
    if (
      data.maximumAgeInDays !== undefined &&
      data.minimumAgeInDays > data.maximumAgeInDays
    ) {
      return [
        {
          path: ["maximumAgeInDays"],
          message: "Maximumleeftijd moet groter zijn dan minimumleeftijd",
        },
      ];
    }
    return true;
  });

export type GroupFormValues = z.infer<typeof groupFormSchema>;

export default function AddGroupForm() {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      color: "",
      description: "",
      minimumAgeInDays: undefined,
      maximumAgeInDays: undefined,
      gender: undefined,
      active: true,
      mascotImageUrl: "",
      coverImageUrl: "",
    },
  });

  const onSubmit = async (data: GroupFormValues) => {
    try {
      await createGroup(data);
      toast.success("Groep succesvol aangemaakt!");
    } catch (error) {
      toast.error("Er is iets misgegaan bij het aanmaken van de groep.");
      console.error("Error creating group:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Groepsnaam</FormLabel>
              <FormControl>
                <Input placeholder="Bijvoorbeeld: Speelclub" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Kleurcode</FormLabel>
              <FormControl>
                <Input placeholder="#FF5733" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Beschrijving</FormLabel>
              <FormControl>
                <Textarea placeholder="Beschrijf de groep..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Minimum Age */}
        <FormField
          control={form.control}
          name="minimumAgeInDays"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Minimumleeftijd (in dagen)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Bijvoorbeeld: 365"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Maximum Age */}
        <FormField
          control={form.control}
          name="maximumAgeInDays"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Maximumleeftijd (in dagen)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Bijvoorbeeld: 1460"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Geslacht</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "null" ? null : value)
                  }
                  defaultValue={field.value ?? "null"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer geslacht" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Alle</SelectItem>
                    <SelectItem value="M">Jongens</SelectItem>
                    <SelectItem value="F">Meisjes</SelectItem>
                    <SelectItem value="X">X</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active */}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <FormLabel>Actief</FormLabel>
            </FormItem>
          )}
        />

        {/* Mascot Image URL */}
        <FormField
          control={form.control}
          name="mascotImageUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Mascotte Afbeelding URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://voorbeeld.com/mascotte.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Image URL */}
        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Cover Afbeelding URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://voorbeeld.com/cover.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {form.formState.isSubmitting
            ? "Bezig met opslaan..."
            : "Groep toevoegen"}
        </Button>
      </form>
    </Form>
  );
}
