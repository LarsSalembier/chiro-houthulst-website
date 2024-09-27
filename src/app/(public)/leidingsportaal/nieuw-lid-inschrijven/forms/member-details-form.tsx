"use client";

import React, { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { calculateAge } from "../calculate-age";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FormDescription } from "~/components/ui/form";
import FormFieldComponent from "../form-field";
import DatePicker from "~/components/forms/date-picker";
import RadioGroupField from "~/components/forms/radio-group-field";
import GroupSelection from "./group-selection-form";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface MemberDetailsFormProps {
  form: UseFormReturn<RegisterMemberInput>;
}

export default function MemberDetailsForm({ form }: MemberDetailsFormProps) {
  const memberDateOfBirth = form.watch("memberData.dateOfBirth");
  const memberGender = form.watch("memberData.gender");
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
        form.setValue("memberData.emailAddress", null);
        form.setValue("memberData.phoneNumber", null);
      }
    }
  }, [memberDateOfBirth, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lid</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name="memberData.name.firstName"
            label="Voornaam"
          />
          <FormFieldComponent
            form={form}
            name="memberData.name.lastName"
            label="Achternaam"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <DatePicker
            form={form}
            name="memberData.dateOfBirth"
            label="Geboortedatum"
          />
          <RadioGroupField
            form={form}
            name="memberData.gender"
            label="Geslacht"
            options={genderOptions}
          />
        </div>
        {memberDateOfBirth && memberGender && <GroupSelection form={form} />}
        {age !== null && age >= 11 && (
          <>
            <FormFieldComponent
              form={form}
              name="memberData.emailAddress"
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
              name="memberData.phoneNumber"
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
