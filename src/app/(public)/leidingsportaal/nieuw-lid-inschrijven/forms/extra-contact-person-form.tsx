import React from "react";
import { type UseFormReturn } from "react-hook-form";
import FormFieldComponent from "../form-field";
import { type RegistrationFormData } from "../schemas";
import CardWrapper from "~/components/card-wrapper";

interface ExtraContactPersonFormProps {
  form: UseFormReturn<RegistrationFormData>;
}

export default function ExtraContactPersonForm({
  form,
}: ExtraContactPersonFormProps) {
  return (
    <CardWrapper
      title="Extra contactpersoon"
      description="Vul hier de gegevens in van een extra contactpersoon die we kunnen contacteren bij noodgevallen."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name="extraContactPersonFirstName"
            label="Voornaam"
          />
          <FormFieldComponent
            form={form}
            name="extraContactPersonLastName"
            label="Achternaam"
          />
        </div>
        <FormFieldComponent
          form={form}
          name="extraContactPersonPhoneNumber"
          label="GSM-nummer"
          type="tel"
        />
        <FormFieldComponent
          form={form}
          name="extraContactPersonRelationship"
          label="Relatie tot uw kind"
          placeholder="Bv. grootouder, tante, nonkel"
        />
      </div>
    </CardWrapper>
  );
}
