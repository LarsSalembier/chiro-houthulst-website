import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import RadioGroupField from "~/components/forms/radio-group-field";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface SportsAndActivitiesFormProps {
  form: UseFormReturn<RegisterMemberInput>;
}

export default function SportsAndActivitiesForm({
  form,
}: SportsAndActivitiesFormProps) {
  return (
    <CardWrapper title="Sport en spel">
      <div className="space-y-4">
        <RadioGroupField
          form={form}
          name="medicalInformation.getsTiredQuickly"
          label="Is uw kind snel moe?"
          showBelowEachother
          options={[
            { value: "YES", label: "Ja" },
            { value: "NO", label: "Nee" },
          ]}
        />
        <RadioGroupField
          form={form}
          name="medicalInformation.canParticipateSports"
          label="Kan uw kind deelnemen aan sport en spel afgestemd op zijn/haar leeftijd?"
          showBelowEachother
          options={[
            { value: "YES", label: "Ja" },
            { value: "NO", label: "Nee" },
          ]}
        />
        <RadioGroupField
          form={form}
          name="medicalInformation.canSwim"
          label="Kan uw kind zwemmen?"
          showBelowEachother
          options={[
            { value: "YES", label: "Ja" },
            { value: "NO", label: "Nee" },
          ]}
        />
      </div>
    </CardWrapper>
  );
}
