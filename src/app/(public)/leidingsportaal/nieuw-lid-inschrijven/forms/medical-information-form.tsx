import React, { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import FormFieldComponent from "../form-field";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import CheckboxField from "~/components/forms/checkbox-field";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface MedicalInformationFormProps {
  form: UseFormReturn<RegisterMemberInput>;
}

export function MedicalInformationForm({ form }: MedicalInformationFormProps) {
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "medicalInformation.tetanusVaccination" &&
        value.medicalInformation?.tetanusVaccination === false
      ) {
        form.setValue("medicalInformation.tetanusVaccinationYear", null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <CardWrapper title="Medische informatie">
      <div className="space-y-6">
        <FormFieldComponent
          form={form}
          name="medicalInformation.pastMedicalHistory"
          label="Vroegere ziekten of heelkundige ingrepen"
          placeholder="Was uw kind ooit ernstig ziek of onderging het een operatie waarvan we op de hoogte moeten zijn?"
        />
        <FormField
          control={form.control}
          name="medicalInformation.medication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicatie</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Som hier op welke medicatie uw kind neemt. Wat is de dosis? Hoe vaak moet het genomen worden? Wat zijn de bijwerkingen?"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CheckboxField
          form={form}
          name="medicalInformation.tetanusVaccination"
          label="Is uw kind gevaccineerd tegen tetanus?"
        />
        {form.watch("medicalInformation.tetanusVaccination") && (
          <FormField
            control={form.control}
            name="medicalInformation.tetanusVaccinationYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jaar van laatste tetanusvaccinatie</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
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
