import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";
import CardWrapper from "~/components/card-wrapper";
import FormFieldComponent from "../form-field";
import RadioGroupField from "~/components/forms/radio-group-field";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface ParentFormProps {
  form: UseFormReturn<RegisterMemberInput>;
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
          name={`parentsWithAddresses.${index}.parent.relationship`}
          options={parentTypeOptions}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name={`parentsWithAddresses.${index}.parent.name.firstName`}
            label="Voornaam"
          />
          <FormFieldComponent
            form={form}
            name={`parentsWithAddresses.${index}.parent.name.lastName`}
            label="Achternaam"
          />
        </div>
        <FormFieldComponent
          form={form}
          name={`parentsWithAddresses.${index}.parent.phoneNumber`}
          label="GSM-nummer"
          placeholder="Mobiel nummer van ouder"
        />
        <FormFieldComponent
          form={form}
          name={`parentsWithAddresses.${index}.parent.emailAddress`}
          label="E-mailadres"
          type="email"
          placeholder="Voor belangrijke mededelingen"
        />
        <FormFieldComponent
          form={form}
          name={`parentsWithAddresses.${index}.address.street`}
          label="Straat"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name={`parentsWithAddresses.${index}.address.houseNumber`}
            label="Huisnummer"
          />
          <FormFieldComponent
            form={form}
            name={`parentsWithAddresses.${index}.address.box`}
            label="Bus (optioneel)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent
            form={form}
            name={`parentsWithAddresses.${index}.address.postalCode`}
            label="Postcode"
            type="number"
          />
          <FormFieldComponent
            form={form}
            name={`parentsWithAddresses.${index}.address.municipality`}
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
