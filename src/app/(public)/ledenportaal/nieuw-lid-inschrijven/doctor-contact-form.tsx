import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import FormFieldComponent from "./form-field";
import { type RegistrationFormValues } from "./schemas";

interface DoctorContactFormProps {
  form: UseFormReturn<RegistrationFormValues>;
}

export default function DoctorContactForm({ form }: DoctorContactFormProps) {
  return (
    <CardWrapper title="Contactgegevens huisarts">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name="doctorFirstName"
            label="Voornaam"
          />
          <FormFieldComponent
            form={form}
            name="doctorLastName"
            label="Achternaam"
          />
        </div>
        <FormFieldComponent
          form={form}
          name="doctorPhoneNumber"
          label="GSM-nummer"
          type="tel"
        />
      </div>
    </CardWrapper>
  );
}
