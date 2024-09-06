// ParentForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormContext } from "./form-context";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import React from "react";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

const parentFormSchema = z.object({
  type: z.enum(["MOTHER", "FATHER", "GUARDIAN", "PLUSMOTHER", "PLUSFATHER"], {
    errorMap: () => ({ message: "Kies een geldig type ouder/voogd." }),
  }),
  firstName: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({ required_error: "Voornaam ontbreekt!" })
      .trim()
      .min(2, "Voornaam is te kort.")
      .max(255, "Voornaam is te lang."),
  ),
  lastName: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({ required_error: "Achternaam ontbreekt!" })
      .trim()
      .min(2, "Achternaam is te kort.")
      .max(255, "Achternaam is te lang."),
  ),
  phoneNumber: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({ required_error: "Telefoonnummer ontbreekt!" })
      .trim()
      .regex(
        /^\d{3,4} \d{2} \d{2} \d{2}$/,
        "Geef een geldig telefoonnummer in in het formaat 0495 12 34 56 of 051 12 34 56",
      ),
  ),
  emailAddress: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({ required_error: "E-mailadres ontbreekt!" })
      .trim()
      .email("Geef een geldig e-mailadres in.")
      .max(255, "E-mailadres is te lang."),
  ),
  street: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({ required_error: "Straatnaam ontbreekt!" })
      .trim()
      .max(255, "Straatnaam is te lang."),
  ),
  houseNumber: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({ required_error: "Huisnummer ontbreekt!" })
      .trim()
      .max(10, "Huisnummer is te lang."),
  ),
  bus: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(10, "Busnummer is te lang.").optional(),
  ),
  postalCode: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({ required_error: "Postcode ontbreekt!" })
      .trim()
      .regex(/^\d{4}$/, "Geef een geldige postcode in.")
      .optional(),
  ),
  municipality: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({ required_error: "Gemeente ontbreekt!" })
      .trim()
      .max(255, "Gemeente is te lang."),
  ),
});

export type ParentFormData = z.infer<typeof parentFormSchema>;

interface ParentFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const ParentForm = ({ onPrevious, onNext }: ParentFormProps) => {
  const { formData, setParentData } = useFormContext();
  const form = useForm<z.infer<typeof parentFormSchema>>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: formData.parentData,
  });

  const handlePrevious = () => {
    onPrevious();
  };

  const handleSubmit = (data: z.infer<typeof parentFormSchema>) => {
    setParentData(data);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-2"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MOTHER" />
                    </FormControl>
                    <FormLabel>Mama</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FATHER" />
                    </FormControl>
                    <FormLabel>Papa</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PLUSMOTHER" />
                    </FormControl>
                    <FormLabel>Plusmama</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PLUSFATHER" />
                    </FormControl>
                    <FormLabel>Pluspapa</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="GUARDIAN" />
                    </FormControl>
                    <FormLabel>Voogd</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="space-y-1">
          <FormLabel>Naam</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Voornaam" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Achternaam" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefoonnummer</FormLabel>
              <FormControl>
                <Input {...field} type="tel" placeholder="Telefoonnummer" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mailadres</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="E-mailadres" />
              </FormControl>
              <FormDescription>
                Deze ouder/voogd kan inloggen op het ledenportaal indien ze een
                account aanmaken met dit e-mailadres.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-between">
          <Button variant="secondary" onClick={handlePrevious}>
            Vorige
          </Button>
          <Button type="submit">Volgende</Button>
        </div>
      </form>
    </Form>
  );
};
