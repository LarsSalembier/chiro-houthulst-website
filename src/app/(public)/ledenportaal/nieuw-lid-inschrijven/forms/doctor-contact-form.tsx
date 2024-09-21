import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import FormFieldComponent from "../form-field";
import { type RegistrationFormData } from "../schemas";

interface DoctorContactFormProps {
  form: UseFormReturn<RegistrationFormData>;
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
