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
import { Checkbox } from "~/components/ui/checkbox";
import { Textarea } from "~/components/ui/textarea";

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
    .min(1, "Voornaam ontbreekt!")
    .max(255, "Voornaam is te lang."),
  lastName: z
    .string({
      required_error: "Achternaam ontbreekt!",
    })
    .min(1, "Achternaam ontbreekt!")
    .max(255, "Achternaam is te lang."),
  phoneNumber: z
    .string({
      required_error: "GSM-nummer ontbreekt!",
    })
    .regex(
      /^\d{3,4} \d{2} \d{2} \d{2}$/,
      "Geef een geldig GSM-nummer in in het formaat 0495 12 34 56 of 051 12 34 56",
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
      .min(1, "Voornaam ontbreekt!")
      .max(255, "Voornaam is te lang."),
    memberLastName: z
      .string({
        required_error: "Achternaam ontbreekt!",
      })
      .trim()
      .min(1, "Achternaam ontbreekt!")
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
          "Geef een geldig GSM-nummer in in het formaat 0495 12 34 56 of 051 12 34 56",
        )
        .optional(),
    ),
    extraContactPersonFirstName: z
      .string({
        required_error: "Voornaam ontbreekt!",
      })
      .trim()
      .min(1, "Voornaam ontbreekt!")
      .max(255, "Voornaam is te lang."),
    extraContactPersonLastName: z
      .string({
        required_error: "Achternaam ontbreekt!",
      })
      .trim()
      .min(1, "Achternaam ontbreekt!")
      .max(255, "Achternaam is te lang."),
    extraContactPersonPhoneNumber: z
      .string({
        required_error: "GSM-nummer ontbreekt!",
      })
      .trim()
      .regex(
        /^\d{3,4} \d{2} \d{2} \d{2}$/,
        "Geef een geldig GSM-nummer in in het formaat 0495 12 34 56 of 051 12 34 56",
      ),
    extraContactPersonRelationship: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .trim()
        .min(1, "Relatie tot uw kind ontbreekt!")
        .max(255, "Relatie tot uw kind is te lang."),
    ),
    permissionPhotos: z.boolean().default(true),
    permissionMedication: z.boolean().default(false),
    parents: z
      .array(parentSchema, {
        required_error: "Voeg minstens één ouder toe.",
      })
      .min(1, "Voeg minstens één ouder toe."),
    foodAllergies: z.boolean().default(false),
    foodAllergiesInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(1000, "Informatie is te lang.").optional(),
    ),
    substanceAllergies: z.boolean().default(false),
    substanceAllergiesInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(1000, "Informatie is te lang.").optional(),
    ),
    medicationAllergies: z.boolean().default(false),
    medicationAllergiesInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(1000, "Informatie is te lang.").optional(),
    ),
    hayFever: z.boolean().default(false),
    hayFeverInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(1000, "Informatie is te lang.").optional(),
    ),
    asthma: z.boolean().default(false),
    asthmaInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(255, "Informatie is te lang.").optional(),
    ),
    bedwetting: z.boolean().default(false),
    bedwettingInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(255, "Informatie is te lang.").optional(),
    ),
    epilepsy: z.boolean().default(false),
    epilepsyInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(255, "Informatie is te lang.").optional(),
    ),
    heartCondition: z.boolean().default(false),
    heartConditionInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(255, "Informatie is te lang.").optional(),
    ),
    skinCondition: z.boolean().default(false),
    skinConditionInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(255, "Informatie is te lang.").optional(),
    ),
    rheumatism: z.boolean().default(false),
    rheumatismInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(255, "Informatie is te lang.").optional(),
    ),
    sleepwalking: z.boolean().default(false),
    sleepwalkingInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(255, "Informatie is te lang.").optional(),
    ),
    diabetes: z.boolean().default(false),
    diabetesInfo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(255, "Informatie is te lang.").optional(),
    ),
    otherMedicalConditions: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(1000, "Informatie is te lang.").optional(),
    ),
    tetanusVaccination: z.boolean().default(false),
    tetanusVaccinationYear: z.preprocess(
      (val) => (val ? undefined : val),
      z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    ),
    pastMedicalHistory: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(1000, "Informatie is te lang.").optional(),
    ),
    hasToTakeMedication: z.boolean().default(false),
    medication: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(1000, "Informatie is te lang.").optional(),
    ),
    getsTiredQuickly: z.boolean().default(false),
    canParticipateSports: z.boolean().default(false),
    canSwim: z.boolean().default(false),
    otherRemarks: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().max(1000, "Informatie is te lang.").optional(),
    ),
    doctorFirstName: z
      .string({
        required_error: "Voornaam ontbreekt!",
      })
      .trim()
      .min(1, "Voornaam ontbreekt!")
      .max(255, "Voornaam is te lang."),
    doctorLastName: z
      .string({
        required_error: "Achternaam ontbreekt!",
      })
      .trim()
      .min(1, "Achternaam ontbreekt!")
      .max(255, "Achternaam is te lang."),
    doctorPhoneNumber: z
      .string({
        required_error: "GSM-nummer ontbreekt!",
      })
      .trim()
      .regex(
        /^\d{3,4} \d{2} \d{2} \d{2}$/,
        "Geef een geldig GSM-nummer in in het formaat 0495 12 34 56 of 051 12 34 56",
      ),
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
  )
  .refine(
    (data) => {
      if (data.substanceAllergies && !data.substanceAllergiesInfo) {
        return false;
      }
      return true;
    },
    {
      message: "Welke stofallergieën heeft uw kind?",
      path: ["substanceAllergiesInfo"],
    },
  )
  .refine(
    (data) => {
      if (data.medicationAllergies && !data.medicationAllergiesInfo) {
        return false;
      }
      return true;
    },
    {
      message: "Welke medicatieallergieën heeft uw kind?",
      path: ["medicationAllergiesInfo"],
    },
  )
  .refine(
    (data) => {
      if (data.foodAllergies && !data.foodAllergiesInfo) {
        return false;
      }
      return true;
    },
    {
      message: "Welke voedselallergieën heeft uw kind?",
      path: ["foodAllergiesInfo"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

export const metadata: Metadata = {
  title: "Uw kind inschrijven",
  description: "Schrijf uw kind in voor Chiro Houthulst.",
};

export default function AddMemberForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parents: [{}],
      permissionPhotos: true,
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

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "foodAllergies" && value.foodAllergies === false) {
        form.setValue("foodAllergiesInfo", "");
      }

      if (name === "substanceAllergies" && value.substanceAllergies === false) {
        form.setValue("substanceAllergiesInfo", "");
      }

      if (
        name === "medicationAllergies" &&
        value.medicationAllergies === false
      ) {
        form.setValue("medicationAllergiesInfo", "");
      }

      if (name === "hayFever" && value.hayFever === false) {
        form.setValue("hayFeverInfo", "");
      }

      if (name === "asthma" && value.asthma === false) {
        form.setValue("asthmaInfo", "");
      }

      if (name === "bedwetting" && value.bedwetting === false) {
        form.setValue("bedwettingInfo", "");
      }

      if (name === "epilepsy" && value.epilepsy === false) {
        form.setValue("epilepsyInfo", "");
      }

      if (name === "heartCondition" && value.heartCondition === false) {
        form.setValue("heartConditionInfo", "");
      }

      if (name === "skinCondition" && value.skinCondition === false) {
        form.setValue("skinConditionInfo", "");
      }

      if (name === "rheumatism" && value.rheumatism === false) {
        form.setValue("rheumatismInfo", "");
      }

      if (name === "sleepwalking" && value.sleepwalking === false) {
        form.setValue("sleepwalkingInfo", "");
      }

      if (name === "diabetes" && value.diabetes === false) {
        form.setValue("diabetesInfo", "");
      }

      if (name === "tetanusVaccination" && value.tetanusVaccination === false) {
        form.setValue("tetanusVaccinationYear", undefined);
      }

      if (
        name === "hasToTakeMedication" &&
        value.hasToTakeMedication === false
      ) {
        form.setValue("medication", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
            <CardTitle>Gegevens</CardTitle>
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
                        Heb je een e-mailadres van uw kind? Top! Zo blijft
                        hij/zij op de hoogte van het laatste nieuws en kan
                        hij/zij zelf deze gegevens raadplegen.
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
                    ? "Dit is de hoofdcontactpersoon voor noodgevallen. Vul hier de gegevens in van de ouder of voogd die als eerste wordt gecontacteerd. Bij voorkeur voeg je hieronder nog een tweede ouder toe."
                    : "Deze ouder wordt gecontacteerd als de hoofdcontactpersoon niet bereikbaar is."}
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
                        De ouder kan met bovenstaand e-mailadres inloggen om
                        deze gegevens te raadplegen en aan te passen.
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
        <Card>
          <CardHeader>
            <CardTitle>Extra contactpersoon</CardTitle>
            <CardDescription>
              Vul hier de gegevens in van een extra contactpersoon die we kunnen
              contacteren bij noodgevallen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="extraContactPersonFirstName"
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
                name="extraContactPersonLastName"
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
              name="extraContactPersonPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSM-nummer</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="extraContactPersonRelationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relatie tot uw kind</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Bv. grootouder, tante, nonkel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>
              Tijdens de activiteiten maken we soms foto&apos;s die we
              publiceren op de website en sociale media.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="permissionPhotos"
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Ik geef hiervoor toestemming.</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Toedienen van medicatie</CardTitle>
            <CardDescription>
              Het is verboden om als begeleid(st)er, behalve EHBO, op eigen
              initiatief medische handelingen uit te voeren. Ook het verstrekken
              van lichte pijnstillende en koortswerende medicatie zoals
              Perdolan, Dafalgan of Aspirine is, zonder toelating van de ouders,
              voorbehouden aan een arts. Daarom is het noodzakelijk om via deze
              steekkaart vooraf toestemming van ouders te hebben voor het
              eventueel toedienen van dergelijke hulp.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="permissionMedication"
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Wij geven toestemming aan de begeleiders om bij
                      hoogdringendheid aan onze zoon of dochter een dosis via de
                      apotheek vrij verkrijgbare pijnstillende en koortswerende
                      medicatie toe te dienen*
                    </FormLabel>
                    <FormDescription>
                      * gebaseerd op aanbeveling Kind & Gezin 09.12.2009 -
                      Aanpak van koorts / Toedienen van geneesmiddelen in de
                      kinderopvang
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Allergieën</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="foodAllergies"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Allergisch voor bepaalde voeding</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("foodAllergies") && (
                <FormField
                  control={form.control}
                  name="foodAllergiesInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Som hier op welke zaken (bv. noten, lactose, ...). Hoe ernstig is de allergie? Wat zijn de symptomen? Wat moet er gebeuren bij een allergische reactie?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="medicationAllergies"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Allergisch voor bepaalde medicatie</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("medicationAllergies") && (
                <FormField
                  control={form.control}
                  name="medicationAllergiesInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Som hier op welke zaken (bv. bepaalde antibiotica, ontsmettingsmiddelen, pijnstillers, ...). Hoe ernstig is de allergie? Wat zijn de symptomen? Wat moet er gebeuren bij een allergische reactie?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="substanceAllergies"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Allergisch voor bepaalde zaken</FormLabel>
                      <FormDescription>
                        Zoals verf, zonnecrème, insectenbeten, ...
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("substanceAllergies") && (
                <FormField
                  control={form.control}
                  name="substanceAllergiesInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Som hier op welke zaken (bv. verf, zonnecrème, insectenbeten, ...). Hoe ernstig is de allergie? Wat zijn de symptomen? Wat moet er gebeuren bij een allergische reactie?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="hayFever"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Hooikoorts</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("hayFever") && (
                <FormField
                  control={form.control}
                  name="hayFeverInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="(optioneel) extra nuttige informatie"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Medische aandoeningen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="asthma"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Astma</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("asthma") && (
                <FormField
                  control={form.control}
                  name="asthmaInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Wat moet de leiding zeker weten over de astma van uw kind? Wat moet er gebeuren bij een astma-aanval?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="bedwetting"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Bedwateren</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("bedwetting") && (
                <FormField
                  control={form.control}
                  name="bedwettingInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="(optioneel) extra nuttige informatie"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="epilepsy"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Epilepsie</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("epilepsy") && (
                <FormField
                  control={form.control}
                  name="epilepsyInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Wat moet de leiding zeker weten over de epilepsie van uw kind? Wat moet er gebeuren bij een epilepsie-aanval?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="heartCondition"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Hartaandoening</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("heartCondition") && (
                <FormField
                  control={form.control}
                  name="heartConditionInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Welke hartaandoening heeft uw kind? Wat moet de leiding zeker weten over deze hartaandoening?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="skinCondition"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Huidaandoening</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("skinCondition") && (
                <FormField
                  control={form.control}
                  name="skinConditionInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Welke huidaandoening heeft uw kind? Wat moet de leiding zeker weten over deze huidaandoening?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="rheumatism"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Reuma</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("rheumatism") && (
                <FormField
                  control={form.control}
                  name="rheumatismInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="(optioneel) extra nuttige informatie"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="sleepwalking"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Slaapwandelen</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("sleepwalking") && (
                <FormField
                  control={form.control}
                  name="sleepwalkingInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="(optioneel) extra nuttige informatie"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="diabetes"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Suikerziekte</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("diabetes") && (
                <FormField
                  control={form.control}
                  name="diabetesInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Wat moet de leiding zeker weten over de diabetes van uw kind?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="otherMedicalConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Andere, namelijk...</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Som hier andere medische aandoeningen op waarvan de leiding op de hoogte moet zijn."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Medische informatie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="pastMedicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vroegere ziekten of heelkundige ingrepen
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Was uw kind ooit ernstig ziek of onderging het een operatie waarvan we op de hoogte moeten zijn?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="hasToTakeMedication"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Moet uw kind medicatie nemen?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("hasToTakeMedication") && (
                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Welke, hoe dikwijls en hoeveel medicatie moet uw kind nemen? Zijn er bijwerkingen?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="tetanusVaccination"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Is uw kind gevaccineerd tegen tetanus?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("tetanusVaccination") && (
                <FormField
                  control={form.control}
                  name="tetanusVaccinationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="(optioneel) welk jaar?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sport en spel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="getsTiredQuickly"
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is uw kind snel moe?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canParticipateSports"
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Kan uw kind deelnemen aan sport en spel?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canSwim"
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Kan uw kind zwemmen?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contactgegevens huisarts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doctorFirstName"
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
                name="doctorLastName"
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
              name="doctorPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSM-nummer</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Algemene opmerkingen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="otherRemarks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Zijn er nog zaken die we zeker moeten weten over uw kind? Zijn er zaken waar we extra rekening mee moeten houden?"
                      {...field}
                      rows={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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
