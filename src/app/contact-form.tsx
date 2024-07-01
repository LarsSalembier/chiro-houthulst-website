"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import sendEmail from "./_actions/send-email";
import { Button } from "~/components/ui/button";
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
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Vul uw naam in.")
    .max(100, "Naam is te lang."),
  email: z
    .string()
    .email("Geef een geldig emailadres in.")
    .max(100, "Emailadres is te lang."),
  message: z
    .string()
    .trim()
    .min(10, "Vul een bericht in.")
    .max(2000, "Bericht is te lang."),
});

export default function ContactForm({ className }: { className?: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await sendEmail(data);
      toast.success(
        "Uw bericht is verstuurd. We nemen zo snel mogelijk contact met u op.",
      );
      form.reset();
    } catch (error) {
      toast.error("Er is iets misgegaan bij het verzenden van uw bericht.");
      console.error("Error sending email:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col gap-4 ${className}`}
      >
        <FormField
          disabled
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uw naam</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uw emailadres</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bericht</FormLabel>
              <FormControl>
                <Textarea {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit" disabled>
          Verstuur uw bericht
        </Button>
      </form>
    </Form>
  );
}
