"use client";

import React, { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type RegistrationFormValues } from "./schemas";
import { calculateAge } from "./calculate-age";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FormDescription } from "~/components/ui/form";
import FormFieldComponent from "./form-field";
import DatePicker from "./date-picker";
import RadioGroupField from "./radio-group-field";

interface MemberDetailsFormProps {
  form: UseFormReturn<RegistrationFormValues>;
}

export default function MemberDetailsForm({ form }: MemberDetailsFormProps) {
  const memberDateOfBirth = form.watch("memberDateOfBirth");
  const age = memberDateOfBirth ? calculateAge(memberDateOfBirth) : null;

  const genderOptions = [
    { value: "M", label: "Man" },
    { value: "F", label: "Vrouw" },
    { value: "X", label: "X" },
  ];

  useEffect(() => {
    if (memberDateOfBirth) {
      const age = calculateAge(memberDateOfBirth);
      if (age < 11) {
        form.setValue("memberEmailAddress", undefined);
        form.setValue("memberPhoneNumber", undefined);
      }
    }
  }, [memberDateOfBirth, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gegevens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <DatePicker
            form={form}
            name="memberDateOfBirth"
            label="Geboortedatum"
          />
          <RadioGroupField
            form={form}
            name="memberGender"
            label="Geslacht"
            options={genderOptions}
          />
        </div>
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
              Heb je een e-mailadres van uw kind? Top! Zo blijft hij/zij op de
              hoogte van het laatste nieuws en kan hij/zij zelf deze gegevens
              raadplegen.
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
      </CardContent>
    </Card>
  );
}
