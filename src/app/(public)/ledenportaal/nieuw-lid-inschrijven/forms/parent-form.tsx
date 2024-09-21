import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";
import CardWrapper from "~/components/card-wrapper";
import FormFieldComponent from "../form-field";
import RadioGroupField from "~/components/forms/radio-group-field";
import { type RegistrationFormData } from "../schemas";

interface ParentFormProps {
  form: UseFormReturn<RegistrationFormData>;
  index: number;
  onRemove: () => void;
  isRemovable: boolean;
}

export function ParentForm({
  form,
  index,
  onRemove,
  isRemovable,
}: ParentFormProps) {
  const parentTypeOptions = [
    { value: "MOTHER", label: "Mama" },
    { value: "FATHER", label: "Papa" },
    { value: "PLUSMOTHER", label: "Plusmama" },
    { value: "PLUSFATHER", label: "Pluspapa" },
    { value: "GUARDIAN", label: "Voogd" },
  ];

  return (
    <CardWrapper
      title={`Ouder ${index + 1}`}
      description={
        index === 0
          ? "Dit is de hoofdcontactpersoon voor noodgevallen. Vul hier de gegevens in van de ouder of voogd die als eerste wordt gecontacteerd. Bij voorkeur voeg je hieronder nog een tweede ouder toe."
          : "Deze ouder wordt gecontacteerd als de hoofdcontactpersoon niet bereikbaar is."
      }
    >
      <div className="space-y-4">
        <RadioGroupField
          form={form}
          name={`parents.${index}.type`}
          options={parentTypeOptions}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name={`parents.${index}.firstName`}
            label="Voornaam"
          />
          <FormFieldComponent
            form={form}
            name={`parents.${index}.lastName`}
            label="Achternaam"
          />
        </div>
        <FormFieldComponent
          form={form}
          name={`parents.${index}.phoneNumber`}
          label="GSM-nummer"
          placeholder="Mobiel nummer van ouder"
        />
        <FormFieldComponent
          form={form}
          name={`parents.${index}.emailAddress`}
          label="E-mailadres"
          type="email"
          placeholder="Voor belangrijke mededelingen"
        />
        <FormFieldComponent
          form={form}
          name={`parents.${index}.street`}
          label="Straat"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name={`parents.${index}.houseNumber`}
            label="Huisnummer"
          />
          <FormFieldComponent
            form={form}
            name={`parents.${index}.bus`}
            label="Bus (optioneel)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name={`parents.${index}.postalCode`}
            label="Postcode"
          />
          <FormFieldComponent
            form={form}
            name={`parents.${index}.municipality`}
            label="Gemeente"
          />
        </div>
      </div>
      {isRemovable && (
        <Button
          variant="destructive"
          size="icon"
          onClick={onRemove}
          className="mt-4"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      )}
    </CardWrapper>
  );
}
