import React, { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "../../../../../components/card-wrapper";
import FormFieldComponent from "../form-field";
import CheckboxField from "../../../../../components/forms/checkbox-field";
import ConditionalField from "../../../../../components/forms/conditional-field";
import { type RegistrationFormValues } from "../schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface MedicalInformationFormProps {
  form: UseFormReturn<RegistrationFormValues>;
}

export function MedicalInformationForm({ form }: MedicalInformationFormProps) {
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "tetanusVaccination" && value.tetanusVaccination === false) {
        form.setValue("tetanusVaccinationYear", undefined);
      }

      if (
        name === "hasToTakeMedication" &&
        value.hasToTakeMedication === false
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
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="hasToTakeMedication"
            label="Moet uw kind medicatie nemen?"
          />
          <ConditionalField
            form={form}
            name="medication"
            placeholder="Welke, hoe dikwijls en hoeveel medicatie moet uw kind nemen? Zijn er bijwerkingen?"
            condition={form.watch("hasToTakeMedication")}
          />
        </div>
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="tetanusVaccination"
            label="Is uw kind gevaccineerd tegen tetanus?"
          />
          {form.watch("tetanusVaccination") && (
            <FormField
              control={form.control}
              name="tetanusVaccinationYear"
              render={({ field }) => (
                <FormItem>
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
      </div>
    </CardWrapper>
  );
}
