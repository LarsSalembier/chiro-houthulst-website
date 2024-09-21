import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import { type RegistrationFormData } from "../schemas";
import RadioGroupField from "~/components/forms/radio-group-field";

interface SportsAndActivitiesFormProps {
  form: UseFormReturn<RegistrationFormData>;
}

export default function SportsAndActivitiesForm({
  form,
}: SportsAndActivitiesFormProps) {
  return (
    <CardWrapper title="Sport en spel">
      <div className="space-y-4">
        <RadioGroupField
          form={form}
          name="getsTiredQuickly"
          label="Is uw kind snel moe?"
          showBelowEachother
          options={[
            { value: "true", label: "Ja" },
            { value: "false", label: "Nee" },
          ]}
        />
        <RadioGroupField
          form={form}
          name="canParticipateSports"
          label="Kan uw kind deelnemen aan sport en spel afgestemd op zijn/haar leeftijd?"
          showBelowEachother
          options={[
            { value: "true", label: "Ja" },
            { value: "false", label: "Nee" },
          ]}
        />
        <RadioGroupField
          form={form}
          name="canSwim"
          label="Kan uw kind zwemmen?"
          showBelowEachother
          options={[
            { value: "true", label: "Ja" },
            { value: "false", label: "Nee" },
          ]}
        />
      </div>
    </CardWrapper>
  );
}
