import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import CheckboxField from "~/components/forms/checkbox-field";
import { type RegistrationFormData } from "../schemas";

interface PrivacyFormProps {
  form: UseFormReturn<RegistrationFormData>;
}

export default function PrivacyForm({ form }: PrivacyFormProps) {
  return (
    <CardWrapper
      title="Privacy"
      description="Tijdens de activiteiten maken we soms foto's die we publiceren op de website en sociale media."
    >
      <CheckboxField
        form={form}
        name="permissionPhotos"
        label="Ik geef hiervoor toestemming."
      />
    </CardWrapper>
  );
}
