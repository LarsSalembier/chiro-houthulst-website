import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "../../../../../components/card-wrapper";
import CheckboxField from "../../../../../components/forms/checkbox-field";
import { type RegistrationFormValues } from "../schemas";

interface SportsAndActivitiesFormProps {
  form: UseFormReturn<RegistrationFormValues>;
}

export default function SportsAndActivitiesForm({
  form,
}: SportsAndActivitiesFormProps) {
  return (
    <CardWrapper title="Sport en spel">
      <div className="space-y-4">
        <CheckboxField
          form={form}
          name="getsTiredQuickly"
          label="Is uw kind snel moe?"
        />
        <CheckboxField
          form={form}
          name="canParticipateSports"
          label="Kan uw kind deelnemen aan sport en spel afgestemd op zijn/haar leeftijd?"
        />
        <CheckboxField
          form={form}
          name="canSwim"
          label="Kan uw kind zwemmen?"
        />
      </div>
    </CardWrapper>
  );
}
