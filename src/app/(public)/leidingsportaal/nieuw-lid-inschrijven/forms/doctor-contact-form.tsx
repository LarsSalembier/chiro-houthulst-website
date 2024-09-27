import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import FormFieldComponent from "../form-field";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface DoctorContactFormProps {
  form: UseFormReturn<RegisterMemberInput>;
}

export default function DoctorContactForm({ form }: DoctorContactFormProps) {
  return (
    <CardWrapper title="Contactgegevens huisarts">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name="medicalInformation.doctor.name.firstName"
            label="Voornaam"
          />
          <FormFieldComponent
            form={form}
            name="medicalInformation.doctor.name.lastName"
            label="Achternaam"
          />
        </div>
        <FormFieldComponent
          form={form}
          name="medicalInformation.doctor.phoneNumber"
          label="GSM-nummer"
          type="tel"
        />
      </div>
    </CardWrapper>
  );
}
