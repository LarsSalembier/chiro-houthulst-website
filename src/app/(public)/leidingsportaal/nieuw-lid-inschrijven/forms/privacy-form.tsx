import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import RadioGroupField from "~/components/forms/radio-group-field";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface PrivacyFormProps {
  form: UseFormReturn<RegisterMemberInput>;
}

export default function PrivacyForm({ form }: PrivacyFormProps) {
  return (
    <CardWrapper
      title="Privacy"
      description="Tijdens de activiteiten maken we soms foto's die we publiceren op de website en sociale media."
    >
      <RadioGroupField
        form={form}
        name="memberData.gdprPermissionToPublishPhotos"
        showBelowEachother
        options={[
          { value: "YES", label: "Ja, ik geef hiervoor toestemming" },
          { value: "NO", label: "Nee, ik geef hiervoor geen toestemming" },
        ]}
      />
    </CardWrapper>
  );
}
