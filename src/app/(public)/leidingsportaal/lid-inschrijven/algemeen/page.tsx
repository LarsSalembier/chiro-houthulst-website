"use client";

import { useForm } from "react-hook-form";
import { useRegistrationFormContext } from "../registration-form-context";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RegistrationFormInputData,
  registrationFormInputDataSchema,
} from "../registration-form-input-data";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import FormFieldComponent from "../../nieuw-lid-inschrijven/form-field";
import RadioGroupField from "~/components/forms/radio-group-field";
import { Button } from "~/components/ui/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const genderOptions = [
  { value: "M", label: "Man" },
  { value: "F", label: "Vrouw" },
  { value: "X", label: "X" },
];

export function calculateAge(birthday: Date) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function GeneralInfoPage() {
  const { formData, updateFormData } = useRegistrationFormContext();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(
      registrationFormInputDataSchema
        .pick({
          memberFirstName: true,
          memberLastName: true,
          memberGender: true,
          memberDateOfBirth: true,
          memberEmailAddress: true,
          memberPhoneNumber: true,
        })
        .refine(
          (data) => {
            const age = calculateAge(data.memberDateOfBirth);
            return !(age >= 15 && data.memberPhoneNumber === null);
          },
          {
            message: "GSM-nummer is verplicht voor leden van 15 jaar en ouder.",
            path: ["memberPhoneNumber"],
          },
        )
        .refine(
          (data) => {
            const age = calculateAge(data.memberDateOfBirth);
            return !(age >= 15 && data.memberEmailAddress === null);
          },
          {
            message:
              "E-mailadres is verplicht voor leden van 15 jaar en ouder.",
            path: ["memberEmailAddress"],
          },
        ),
    ),
    defaultValues: {
      memberFirstName: formData.memberFirstName,
      memberLastName: formData.memberLastName,
      memberGender: formData.memberGender,
      memberDateOfBirth: formData.memberDateOfBirth,
      memberEmailAddress: formData.memberEmailAddress,
      memberPhoneNumber: formData.memberPhoneNumber,
    },
  });

  function onSubmit(data: Partial<RegistrationFormInputData>) {
    updateFormData(data);
    router.push("/form/step2");
  }

  const memberDateOfBirth = form.watch("memberDateOfBirth");
  // const memberGender = form.watch("memberGender");
  const age = memberDateOfBirth ? calculateAge(memberDateOfBirth) : null;

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Inschrijvingsformulier</PageHeaderHeading>
        <PageHeaderDescription>
          Vul onderstaand formulier in om je kind of jezelf in te schrijven.
        </PageHeaderDescription>
      </PageHeader>

      <div className="p-4 pb-8 md:pb-12 lg:pb-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormFieldComponent
                form={form}
                name="memberFirstName"
                label="Voornaam"
              />
              <FormFieldComponent
                form={form}
                name="memberLastName"
                label="Achternaam"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="memberDateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geboortedatum</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Geboortedatum"
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <RadioGroupField
                form={form}
                name="memberGender"
                label="Geslacht"
                options={genderOptions}
              />
            </div>
            {/* {memberDateOfBirth && memberGender && <GroupSelection form={form} />} */}
            {age !== null && age >= 11 && (
              <>
                <FormFieldComponent
                  form={form}
                  name="memberEmailAddress"
                  label={`E-mailadres ${age >= 15 ? "(verplicht)" : "(optioneel)"}`}
                  type="email"
                  placeholder="E-mailadres van lid zelf"
                />
                <FormDescription>
                  Heb je een e-mailadres van uw kind? Top! Zo blijft hij/zij op
                  de hoogte van het laatste nieuws en kan hij/zij zelf deze
                  gegevens raadplegen.
                </FormDescription>
                <FormFieldComponent
                  form={form}
                  name="memberPhoneNumber"
                  label={`GSM-nummer ${age >= 15 ? "(verplicht)" : "(optioneel)"}`}
                  type="tel"
                  placeholder="GSM-nummer van lid zelf"
                />
              </>
            )}
            <Button type="submit">Volgende</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
