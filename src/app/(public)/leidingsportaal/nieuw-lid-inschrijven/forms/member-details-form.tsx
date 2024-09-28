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
import { getAllMemberData } from "../actions";

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
        form.setValue("memberData.emailAddress", "");
        form.setValue("memberData.phoneNumber", "");
      }
    }
  }, [memberDateOfBirth, form]);

  const firstName = form.watch("memberData.name.firstName");
  const lastName = form.watch("memberData.name.lastName");
  const dateOfBirth = form.watch("memberData.dateOfBirth");

  useEffect(() => {
    const fetchData = async () => {
      if (firstName && lastName && dateOfBirth) {
        const data = await getAllMemberData(firstName, lastName, dateOfBirth);

        if ("error" in data) {
          console.error(data.error);
        } else {
          if (data.success) {
            const {
              memberData,
              parentsWithAddresses,
              emergencyContact,
              medicalInformation,
            } = data.success;

            form.setValue("memberData.gender", memberData.gender);
            form.setValue(
              "memberData.emailAddress",
              memberData.emailAddress ?? "",
            );
            form.setValue(
              "memberData.phoneNumber",
              memberData.phoneNumber ?? "",
            );
            form.setValue(
              "memberData.gdprPermissionToPublishPhotos",
              memberData.gdprPermissionToPublishPhotos,
            );

            for (let i = 0; i < parentsWithAddresses.length; i++) {
              form.setValue(
                `parentsWithAddresses.${i}.parent.name.firstName`,
                parentsWithAddresses[i]!.parent.name.firstName,
              );
              form.setValue(
                `parentsWithAddresses.${i}.parent.name.lastName`,
                parentsWithAddresses[i]!.parent.name.lastName,
              );
              form.setValue(
                `parentsWithAddresses.${i}.parent.phoneNumber`,
                parentsWithAddresses[i]!.parent.phoneNumber,
              );
              form.setValue(
                `parentsWithAddresses.${i}.parent.emailAddress`,
                parentsWithAddresses[i]!.parent.emailAddress,
              );
              form.setValue(
                `parentsWithAddresses.${i}.parent.relationship`,
                parentsWithAddresses[i]!.parent.relationship,
              );
              form.setValue(
                `parentsWithAddresses.${i}.address.street`,
                parentsWithAddresses[i]!.address.street,
              );
              form.setValue(
                `parentsWithAddresses.${i}.address.houseNumber`,
                parentsWithAddresses[i]!.address.houseNumber,
              );
              form.setValue(
                `parentsWithAddresses.${i}.address.box`,
                parentsWithAddresses[i]!.address.box ?? "",
              );
              form.setValue(
                `parentsWithAddresses.${i}.address.postalCode`,
                parentsWithAddresses[i]!.address.postalCode,
              );
              form.setValue(
                `parentsWithAddresses.${i}.address.municipality`,
                parentsWithAddresses[i]!.address.municipality,
              );
            }

            form.setValue(
              "emergencyContact.name.firstName",
              emergencyContact.name.firstName,
            );
            form.setValue(
              "emergencyContact.name.lastName",
              emergencyContact.name.lastName,
            );
            form.setValue(
              "emergencyContact.phoneNumber",
              emergencyContact.phoneNumber,
            );
            form.setValue(
              "emergencyContact.relationship",
              emergencyContact.relationship ?? "",
            );

            form.setValue(
              "medicalInformation.asthma.hasCondition",
              medicalInformation.asthma.hasCondition,
            );
            form.setValue(
              "medicalInformation.asthma.info",
              medicalInformation.asthma.info ?? "",
            );
            form.setValue(
              "medicalInformation.bedwetting.hasCondition",
              medicalInformation.bedwetting.hasCondition,
            );
            form.setValue(
              "medicalInformation.bedwetting.info",
              medicalInformation.bedwetting.info ?? "",
            );
            form.setValue(
              "medicalInformation.canParticipateSports",
              medicalInformation.canParticipateSports,
            );
            form.setValue(
              "medicalInformation.canSwim",
              medicalInformation.canSwim,
            );
            form.setValue(
              "medicalInformation.diabetes.hasCondition",
              medicalInformation.diabetes.hasCondition,
            );
            form.setValue(
              "medicalInformation.diabetes.info",
              medicalInformation.diabetes.info ?? "",
            );
            form.setValue(
              "medicalInformation.doctor",
              medicalInformation.doctor,
            );
            form.setValue(
              "medicalInformation.epilepsy.hasCondition",
              medicalInformation.epilepsy.hasCondition,
            );
            form.setValue(
              "medicalInformation.epilepsy.info",
              medicalInformation.epilepsy.info ?? "",
            );
            form.setValue(
              "medicalInformation.foodAllergies",
              medicalInformation.foodAllergies ?? "",
            );
            form.setValue(
              "medicalInformation.getsTiredQuickly",
              medicalInformation.getsTiredQuickly,
            );
            form.setValue(
              "medicalInformation.hayFever.hasCondition",
              medicalInformation.hayFever.hasCondition,
            );
            form.setValue(
              "medicalInformation.hayFever.info",
              medicalInformation.hayFever.info ?? "",
            );
            form.setValue(
              "medicalInformation.heartCondition.hasCondition",
              medicalInformation.heartCondition.hasCondition,
            );
            form.setValue(
              "medicalInformation.heartCondition.info",
              medicalInformation.heartCondition.info ?? "",
            );
            form.setValue(
              "medicalInformation.medication",
              medicalInformation.medication ?? "",
            );
            form.setValue(
              "medicalInformation.medicationAllergies",
              medicalInformation.medicationAllergies ?? "",
            );
            form.setValue(
              "medicalInformation.otherMedicalConditions",
              medicalInformation.otherMedicalConditions ?? "",
            );
            form.setValue(
              "medicalInformation.otherRemarks",
              medicalInformation.otherRemarks ?? "",
            );
            form.setValue(
              "medicalInformation.pastMedicalHistory",
              medicalInformation.pastMedicalHistory ?? "",
            );
            form.setValue(
              "medicalInformation.permissionMedication",
              medicalInformation.permissionMedication,
            );
            form.setValue(
              "medicalInformation.rheumatism.hasCondition",
              medicalInformation.rheumatism.hasCondition,
            );
            form.setValue(
              "medicalInformation.rheumatism.info",
              medicalInformation.rheumatism.info ?? "",
            );
            form.setValue(
              "medicalInformation.skinCondition.hasCondition",
              medicalInformation.skinCondition.hasCondition,
            );
            form.setValue(
              "medicalInformation.sleepwalking.hasCondition",
              medicalInformation.sleepwalking.hasCondition,
            );
            form.setValue(
              "medicalInformation.sleepwalking.info",
              medicalInformation.sleepwalking.info ?? "",
            );
            form.setValue(
              "medicalInformation.substanceAllergies",
              medicalInformation.substanceAllergies ?? "",
            );
            form.setValue(
              "medicalInformation.tetanusVaccination",
              medicalInformation.tetanusVaccination,
            );
            form.setValue(
              "medicalInformation.tetanusVaccinationYear",
              medicalInformation.tetanusVaccinationYear,
            );
          }
        }
      }
    };

    void fetchData();
  }, [firstName, lastName, dateOfBirth, form]);

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
