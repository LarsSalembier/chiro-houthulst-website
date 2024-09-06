import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormContext } from "./form-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { nlBE } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
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
import { useEffect } from "react";

const calculateAge = (birthday: Date) => {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const memberSchema = z
  .object({
    firstName: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string({
          required_error: "Voornaam ontbreekt!",
        })
        .trim()
        .min(2, "Voornaam is te kort.")
        .max(255, "Voornaam is te lang."),
    ),
    lastName: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string({
          required_error: "Achternaam ontbreekt!",
        })
        .trim()
        .min(2, "Achternaam is te kort.")
        .max(255, "Achternaam is te lang."),
    ),
    gender: z.enum(["M", "F", "X"], {
      required_error: "Kies een geslacht.",
    }),
    dateOfBirth: z.date({
      required_error: "Geef een geldige geboortedatum in.",
    }),
    emailAddress: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().trim().email("Geef een geldig e-mailadres in.").optional(),
    ),
    phoneNumber: z.preprocess(
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
  })
  .refine(
    (data) => {
      const age = calculateAge(data.dateOfBirth);
      if (age >= 15) {
        return data.phoneNumber;
      }
      return true;
    },
    {
      message: "Telefoonnummer is verplicht voor leden van 15 jaar en ouder.",
      path: ["phoneNumber"],
    },
  )
  .refine(
    (data) => {
      const age = calculateAge(data.dateOfBirth);
      if (age >= 15) {
        return data.emailAddress;
      }
      return true;
    },
    {
      message: "E-mailadres is verplicht voor leden van 15 jaar en ouder.",
      path: ["emailAddress"],
    },
  );

export type MemberFormData = z.infer<typeof memberSchema>;

interface MemberFormProps {
  onNext: () => void;
}

export function MemberForm({ onNext }: MemberFormProps) {
  const { formData, setMemberData } = useFormContext();
  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: formData.memberData,
  });

  const dateOfBirth = form.watch("dateOfBirth");
  const age = dateOfBirth ? calculateAge(dateOfBirth) : null;

  useEffect(() => {
    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      if (age >= 15) {
        form.unregister("emailAddress");
        form.unregister("phoneNumber");
      } else if (age >= 11) {
        form.unregister("emailAddress");
        form.unregister("phoneNumber");
      } else {
        form.unregister("emailAddress");
        form.unregister("phoneNumber");
        form.setValue("emailAddress", undefined);
        form.setValue("phoneNumber", undefined);
      }
    }
  }, [dateOfBirth, form]);

  const onSubmit = (data: z.infer<typeof memberSchema>) => {
    setMemberData(data);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="dateOfBirth"
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
          name="gender"
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
        {age !== null && age >= 11 && (
          <>
            <FormField
              control={form.control}
              name="emailAddress"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Telefoonnummer {age >= 15 ? "(verplicht)" : "(optioneel)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Telefoonnummer van lid zelf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit">Volgende</Button>
      </form>
    </Form>
  );
}
