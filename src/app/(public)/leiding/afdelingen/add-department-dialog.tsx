"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { addDepartmentAndRevalidate } from "./actions";
import ColorPicker from "~/components/ui/color-picker";
import {
  type CreateDepartmentData,
  createDepartmentSchema,
} from "~/server/schemas/create-department-schema";

export default function AddDepartmentDialog() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateDepartmentData>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      color: "000000",
      description: "",
    },
  });

  async function onSubmit(data: CreateDepartmentData) {
    setIsLoading(true);
    await addDepartmentAndRevalidate(data);
    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit">Voeg een afdeling toe</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voeg een afdeling toe</DialogTitle>
          <DialogDescription>
            Vul de gegevens van de nieuwe afdeling in.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naam</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kleur</FormLabel>
                  <FormControl>
                    <ColorPicker
                      {...field}
                      value={field.value ? field.value : "000000"}
                      onChange={(color) =>
                        form.setValue(
                          "color",
                          color === "000000" ? undefined : color,
                        )
                      }
                    />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-fit" disabled={isLoading}>
              {isLoading ? "Opslaan..." : "Afdeling toevoegen"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
