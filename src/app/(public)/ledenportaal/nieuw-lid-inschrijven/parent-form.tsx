import React from "react";
import {
  type UseFormReturn,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";
import CardWrapper from "./card-wrapper";
import FormFieldComponent from "./form-field";
import RadioGroupField from "./radio-group-field";

interface ParentFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  index: number;
  onRemove: () => void;
  isRemovable: boolean;
}

export function ParentForm<TFieldValues extends FieldValues>({
  form,
  index,
  onRemove,
  isRemovable,
}: ParentFormProps<TFieldValues>) {
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
          name={`parents.${index}.type` as FieldPath<TFieldValues>}
          label="Type"
          options={parentTypeOptions}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name={`parents.${index}.firstName` as FieldPath<TFieldValues>}
            label="Voornaam"
          />
          <FormFieldComponent
            form={form}
            name={`parents.${index}.lastName` as FieldPath<TFieldValues>}
            label="Achternaam"
          />
        </div>
        <FormFieldComponent
          form={form}
          name={`parents.${index}.phoneNumber` as FieldPath<TFieldValues>}
          label="GSM-nummer"
          placeholder="Mobiel nummer van ouder"
        />
        <FormFieldComponent
          form={form}
          name={`parents.${index}.emailAddress` as FieldPath<TFieldValues>}
          label="E-mailadres"
          type="email"
          placeholder="Voor belangrijke mededelingen"
        />
        <FormFieldComponent
          form={form}
          name={`parents.${index}.street` as FieldPath<TFieldValues>}
          label="Straat"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name={`parents.${index}.houseNumber` as FieldPath<TFieldValues>}
            label="Huisnummer"
          />
          <FormFieldComponent
            form={form}
            name={`parents.${index}.bus` as FieldPath<TFieldValues>}
            label="Bus (optioneel)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name={`parents.${index}.postalCode` as FieldPath<TFieldValues>}
            label="Postcode"
          />
          <FormFieldComponent
            form={form}
            name={`parents.${index}.municipality` as FieldPath<TFieldValues>}
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
