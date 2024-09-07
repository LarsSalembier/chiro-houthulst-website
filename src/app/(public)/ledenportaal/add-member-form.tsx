"use client";

import { toast } from "sonner";
import { AuthenticationError } from "~/lib/errors";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { nlBE } from "date-fns/locale";
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Metadata } from "next";

const calculateAge = (birthday: Date) => {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const parentSchema = z.object({
  type: z.enum(["MOTHER", "FATHER", "GUARDIAN", "PLUSMOTHER", "PLUSFATHER"], {
    required_error: "Kies een type ouder/voogd.",
  }),
  firstName: z
    .string({
      required_error: "Voornaam ontbreekt!",
    })
    .min(2, "Voornaam is te kort.")
    .max(255, "Voornaam is te lang."),
  lastName: z
    .string({
      required_error: "Achternaam ontbreekt!",
    })
    .min(2, "Achternaam is te kort.")
    .max(255, "Achternaam is te lang."),
  phoneNumber: z
    .string({
      required_error: "Telefoonnummer ontbreekt!",
    })
    .regex(
      /^\d{3,4} \d{2} \d{2} \d{2}$/,
      "Geef een geldig telefoonnummer in in het formaat 0495 12 34 56 of 051 12 34 56",
    ),
  emailAddress: z
    .string({
      required_error: "E-mailadres ontbreekt!",
    })
    .email("Geef een geldig e-mailadres in."),
  street: z
    .string({
      required_error: "Straatnaam ontbreekt!",
    })
    .min(1, "Straatnaam ontbreekt!")
    .max(255, "Straatnaam is te lang."),
  houseNumber: z
    .string({
      required_error: "Huisnummer ontbreekt!",
    })
    .min(1, "Huisnummer ontbreekt!")
    .max(10, "Huisnummer is te lang."),
  bus: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().max(10, "Busnummer is te lang.").optional(),
  ),
  postalCode: z
    .string({
      required_error: "Postcode ontbreekt!",
    })
    .regex(/^\d{4}$/, "Geef een geldige postcode in."),
  municipality: z
    .string({
      required_error: "Gemeente ontbreekt!",
    })
    .min(1, "Gemeente ontbreekt!")
    .max(255, "Gemeente is te lang."),
});

const formSchema = z
  .object({
    memberFirstName: z
      .string({
        required_error: "Voornaam ontbreekt!",
      })
      .trim()
      .min(2, "Voornaam is te kort.")
      .max(255, "Voornaam is te lang."),
    memberLastName: z
      .string({
        required_error: "Achternaam ontbreekt!",
      })
      .trim()
      .min(2, "Achternaam is te kort.")
      .max(255, "Achternaam is te lang."),
    memberGender: z.enum(["M", "F", "X"], {
      required_error: "Kies een geslacht.",
    }),
    memberDateOfBirth: z.date({
      required_error: "Geef een geldige geboortedatum in.",
    }),
    memberEmailAddress: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().email("Geef een geldig e-mailadres in.").optional(),
    ),
    memberPhoneNumber: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .trim()
        .regex(
          /^\d{3,4} \d{2} \d{2} \d{2}$/,
          "Geef een geldig telefoonnummer in in het formaat 0495 12 34 56 of 051 12 34 56",
        )
        .optional(),
    ),
    parents: z
      .array(parentSchema, {
        required_error: "Voeg minstens één ouder toe.",
      })
      .min(1, "Voeg minstens één ouder toe."),
  })
  .refine(
    (data) => {
      const age = calculateAge(data.memberDateOfBirth);
      if (age >= 15) {
        return data.memberPhoneNumber;
      }
      return true;
    },
    {
      message: "GSM-nummer is verplicht voor leden van 15 jaar en ouder.",
      path: ["memberPhoneNumber"],
    },
  )
  .refine(
    (data) => {
      const age = calculateAge(data.memberDateOfBirth);
      if (age >= 15) {
        return data.memberEmailAddress;
      }
      return true;
    },
    {
      message: "E-mailadres is verplicht voor leden van 15 jaar en ouder.",
      path: ["memberEmailAddress"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

export const metadata: Metadata = {
  title: "Nieuw lid inschrijven",
  description: "Schrijf een nieuw lid in voor Chiro Houthulst.",
};

export default function AddMemberForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parents: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parents",
  });

  const memberDateOfBirth = form.watch("memberDateOfBirth");
  const age = memberDateOfBirth ? calculateAge(memberDateOfBirth) : null;

  useEffect(() => {
    if (memberDateOfBirth) {
      const age = calculateAge(memberDateOfBirth);
      if (age < 11) {
        form.setValue("memberEmailAddress", undefined);
        form.setValue("memberPhoneNumber", undefined);
      }
    }
  }, [memberDateOfBirth, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      // await createMemberAndRevalidate(data);
      console.log(data);
      toast.success(`Lid is succesvol toegevoegd.`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof AuthenticationError) {
      toast.error("Je bent niet ingelogd.");
    } else {
      toast.error("Er is iets misgegaan bij het toevoegen van het lid.");
      console.error("Error adding member", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informatie over het kind</CardTitle>
            <CardDescription>
              Vul hier de gegevens van uw kind in. Heb je een e-mailadres van
              het lid? Top! Zo blijft hij/zij op de hoogte van het laatste
              nieuws en kan hij/zij zelf inloggen op de website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="memberFirstName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Voornaam</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="memberLastName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Achternaam</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="memberDateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Geboortedatum</FormLabel>
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
                                : "Selecteer je geboortedatum"}
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
              <FormField
                control={form.control}
                name="memberGender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geslacht</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="M" />
                          </FormControl>
                          <FormLabel>Man</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="F" />
                          </FormControl>
                          <FormLabel>Vrouw</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="X" />
                          </FormControl>
                          <FormLabel>X</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {age !== null && age >= 11 && (
              <>
                <FormField
                  control={form.control}
                  name="memberEmailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        E-mailadres {age >= 15 ? "(verplicht)" : "(optioneel)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="E-mailadres van lid zelf"
                        />
                      </FormControl>
                      <FormDescription>
                        Uw kind kan met het bovenstaande e-mailadres inloggen om
                        toegang te krijgen tot het ledenportaal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        GSM-nummer {age >= 15 ? "(verplicht)" : "(optioneel)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="GSM-nummer van lid zelf"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                  <span>Ouder {index + 1}</span>
                  {index > 0 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="self-center"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {index === 0
                    ? "Dit is de hoofdcontactpersoon voor noodgevallen en communicatie met Chiro Houthulst. Vul hier de gegevens in van de ouder of voogd die als eerste wordt gecontacteerd. Bij voorkeur voeg je hieronder nog een tweede ouder toe."
                    : "Deze "}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`parents.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-2"
                        >
                          {[
                            { value: "MOTHER", label: "Mama" },
                            { value: "FATHER", label: "Papa" },
                            { value: "PLUSMOTHER", label: "Plusmama" },
                            { value: "PLUSFATHER", label: "Pluspapa" },
                            { value: "GUARDIAN", label: "Voogd" },
                          ].map((option) => (
                            <FormItem
                              key={option.value}
                              className="flex items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`parents.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voornaam</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`parents.${index}.lastName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achternaam</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`parents.${index}.phoneNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSM-nummer</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Mobiel nummer van ouder"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`parents.${index}.emailAddress`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mailadres</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Voor belangrijke mededelingen"
                        />
                      </FormControl>
                      <FormDescription>
                        Deze ouder kan met het bovenstaande e-mailadres inloggen
                        om toegang te krijgen tot het ledenportaal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`parents.${index}.street`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Straat</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`parents.${index}.houseNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Huisnummer</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`parents.${index}.bus`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bus (optioneel)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`parents.${index}.postalCode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`parents.${index}.municipality`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gemeente</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            type="button"
            variant="secondary"
            className="mt-2"
            onClick={() =>
              append({
                street: form.watch(`parents.${fields.length - 1}.street`),
                houseNumber: form.watch(
                  `parents.${fields.length - 1}.houseNumber`,
                ),
                bus: form.watch(`parents.${fields.length - 1}.bus`),
                postalCode: form.watch(
                  `parents.${fields.length - 1}.postalCode`,
                ),
                municipality: form.watch(
                  `parents.${fields.length - 1}.municipality`,
                ),
              } as z.infer<typeof parentSchema>)
            }
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Voeg nog een ouder toe
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit">
            {form.formState.isSubmitting
              ? "Bezig met toevoegen..."
              : "Inschrijven"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
