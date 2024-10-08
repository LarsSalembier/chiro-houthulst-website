import React from "react";
import { type UseFormReturn } from "react-hook-form";
import FormFieldComponent from "../form-field";
import CardWrapper from "~/components/card-wrapper";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface ExtraContactPersonFormProps {
  form: UseFormReturn<RegisterMemberInput>;
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
            name="emergencyContact.name.firstName"
            label="Voornaam"
          />
          <FormFieldComponent
            form={form}
            name="emergencyContact.name.lastName"
            label="Achternaam"
          />
        </div>
        <FormFieldComponent
          form={form}
          name="emergencyContact.phoneNumber"
          label="GSM-nummer"
          type="tel"
        />
        <FormFieldComponent
          form={form}
          name="emergencyContact.relationship"
          label="Relatie tot uw kind"
          placeholder="Bv. grootouder, tante, nonkel"
        />
      </div>
    </CardWrapper>
  );
}
