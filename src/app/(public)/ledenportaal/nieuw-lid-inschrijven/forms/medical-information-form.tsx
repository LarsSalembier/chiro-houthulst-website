import React, { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import FormFieldComponent from "../form-field";
import ConditionalField from "~/components/forms/conditional-field";
import { type RegistrationFormValues } from "../schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import RadioGroupField from "~/components/forms/radio-group-field";

interface MedicalInformationFormProps {
  form: UseFormReturn<RegistrationFormValues>;
}

export function MedicalInformationForm({ form }: MedicalInformationFormProps) {
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "tetanusVaccination" &&
        value.tetanusVaccination === "false"
      ) {
        form.setValue("tetanusVaccinationYear", undefined);
      }

      if (
        name === "hasToTakeMedication" &&
        value.hasToTakeMedication === "false"
      ) {
        form.setValue("medication", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <CardWrapper title="Medische informatie">
      <div className="space-y-6">
        <FormFieldComponent
          form={form}
          name="pastMedicalHistory"
          label="Vroegere ziekten of heelkundige ingrepen"
          placeholder="Was uw kind ooit ernstig ziek of onderging het een operatie waarvan we op de hoogte moeten zijn?"
        />
        <RadioGroupField
          form={form}
          name="hasToTakeMedication"
          label="Moet uw kind medicatie nemen?"
          showBelowEachother
          options={[
            { label: "Ja", value: "true" },
            { label: "Nee", value: "false" },
          ]}
        />
        <ConditionalField
          form={form}
          name="medication"
          placeholder="Welke, hoe dikwijls en hoeveel medicatie moet uw kind nemen? Zijn er bijwerkingen?"
          condition={form.watch("hasToTakeMedication") === "true"}
        />
        <RadioGroupField
          form={form}
          name="tetanusVaccination"
          label="Is uw kind gevaccineerd tegen tetanus?"
          showBelowEachother
          options={[
            { label: "Ja", value: "true" },
            { label: "Nee", value: "false" },
          ]}
        />
        {form.watch("tetanusVaccination") === "true" && (
          <FormField
            control={form.control}
            name="tetanusVaccinationYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jaar van laatste tetanusvaccinatie</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="(optioneel) welk jaar?"
                    min={2000}
                    max={new Date().getFullYear()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </CardWrapper>
  );
}
