"use client";

import { Controller, useForm } from "react-hook-form";
import { useRegistrationFormContext } from "../registration-form-context";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RegistrationFormInputData,
  registrationFormInputDataSchema,
} from "../registration-form-input-data";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { useEffect, useState } from "react";
import { DatePicker, Input, Radio, RadioGroup } from "@nextui-org/react";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { type Group } from "~/domain/entities/group";
import { getGroups } from "./../actions";

const genderOptions = [
  { value: "M", label: "Man" },
  { value: "F", label: "Vrouw" },
  { value: "X", label: "X" },
];

export function calculateAge(birthday: Date) {
  // console.log(birthday);

  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function GeneralInfoPage() {
  const { formData, updateFormData } = useRegistrationFormContext();
  const router = useRouter();

  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(
      registrationFormInputDataSchema
        .pick({
          memberFirstName: true,
          memberLastName: true,
          memberGender: true,
          memberDateOfBirth: true,
          memberEmailAddress: true,
          memberPhoneNumber: true,
          groupId: true,
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
      groupId: formData.groupId,
    },
  });

  function onSubmit(data: Partial<RegistrationFormInputData>) {
    updateFormData(data);
    router.push("/leidingsportaal/lid-inschrijven/ouders");
  }

  const memberDateOfBirth = form.watch("memberDateOfBirth");
  const memberGender = form.watch("memberGender");
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
    async function fetchGroups() {
      if (memberDateOfBirth && memberGender) {
        setIsLoading(true);
        const groups = await getGroups(memberDateOfBirth, memberGender);

        setGroups(groups);
        if (groups.length === 1) {
          form.setValue("groupId", groups[0]!.id);
        }

        setIsLoading(false);
      }
    }

    void fetchGroups();
  }, [memberDateOfBirth, memberGender, form]);

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Algemene gegevens</PageHeaderHeading>
        <PageHeaderDescription>
          Geef hier de gegevens van het lid in om het inschrijvingsproces te
          starten.
        </PageHeaderDescription>
      </PageHeader>

      <div className="px-4 pb-12 md:pb-16 lg:pb-16">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start gap-4"
        >
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <Controller
              name="memberFirstName"
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Voornaam"
                  variant="faded"
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  onClear={() => form.setValue("memberFirstName", "")}
                  errorMessage={form.formState.errors.memberFirstName?.message}
                  isInvalid={!!form.formState.errors.memberFirstName}
                  isRequired
                />
              )}
            />

            <Controller
              name="memberLastName"
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Achternaam"
                  variant="faded"
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  onClear={() => form.setValue("memberLastName", "")}
                  errorMessage={form.formState.errors.memberLastName?.message}
                  isInvalid={!!form.formState.errors.memberLastName}
                  isRequired
                />
              )}
            />
          </div>

          <div className="flex w-full flex-col gap-4 md:flex-row">
            <Controller
              name="memberGender"
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioGroup
                  className="w-full"
                  label="Geslacht"
                  value={value}
                  onValueChange={onChange}
                  onBlur={onBlur}
                  errorMessage={form.formState.errors.memberGender?.message}
                  isInvalid={!!form.formState.errors.memberGender}
                  isRequired
                  orientation="horizontal"
                >
                  {genderOptions.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            />

            <Controller
              name="memberDateOfBirth"
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <DatePicker
                  className="w-full"
                  label="Geboortedatum"
                  variant="faded"
                  value={
                    value
                      ? new CalendarDate(
                          value.getFullYear(),
                          value.getMonth() + 1,
                          value.getDate(),
                        )
                      : undefined
                  }
                  onBlur={onBlur}
                  onChange={(date) => {
                    if (date instanceof CalendarDate) {
                      onChange(date.toDate(getLocalTimeZone()));
                    } else {
                      onChange(undefined);
                    }
                  }}
                  errorMessage={
                    form.formState.errors.memberDateOfBirth?.message
                  }
                  isInvalid={!!form.formState.errors.memberDateOfBirth}
                  isRequired
                  showMonthAndYearPickers
                />
              )}
            />
          </div>

          {age && age > 11 ? (
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <Controller
                name="memberEmailAddress"
                control={form.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="E-mailadres"
                    description="Het e-mailadres van het lid zelf."
                    variant="faded"
                    value={value ?? undefined}
                    onBlur={onBlur}
                    onChange={onChange}
                    onClear={() => form.setValue("memberEmailAddress", "")}
                    errorMessage={
                      form.formState.errors.memberEmailAddress?.message
                    }
                    isInvalid={!!form.formState.errors.memberEmailAddress}
                    isRequired={age ? age >= 15 : false}
                  />
                )}
              />

              <Controller
                name="memberPhoneNumber"
                control={form.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="GSM-nummer"
                    description="Het GSM-nummer van het lid zelf."
                    variant="faded"
                    value={value ?? undefined}
                    onBlur={onBlur}
                    onChange={onChange}
                    onClear={() => form.setValue("memberPhoneNumber", "")}
                    errorMessage={
                      form.formState.errors.memberPhoneNumber?.message
                    }
                    isInvalid={!!form.formState.errors.memberPhoneNumber}
                    isRequired={age ? age >= 15 : false}
                  />
                )}
              />
            </div>
          ) : null}

          <Button type="submit">Volgende</Button>
        </form>
      </div>
    </>
  );
}
