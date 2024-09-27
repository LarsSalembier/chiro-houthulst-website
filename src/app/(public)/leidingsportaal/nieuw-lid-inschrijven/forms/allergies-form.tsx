import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import CheckboxField from "~/components/forms/checkbox-field";
import ConditionalField from "~/components/forms/conditional-field";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface AllergiesFormProps {
  form: UseFormReturn<RegisterMemberInput>;
}

export function AllergiesForm({ form }: AllergiesFormProps) {
  return (
    <CardWrapper title="Allergieën">
      <div className="space-y-6">
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="medicalInformation.foodAllergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergisch aan bepaalde voeding</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Som hier op welke zaken (bv. noten, melk, gluten, ...). Hoe ernstig is de allergie? Wat zijn de symptomen? Wat moet er gebeuren bij een allergische reactie?"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="medicalInformation.substanceAllergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergisch aan bepaalde stoffen</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Som hier op welke zaken (bv. verf, zonnecrème, insectenbeten, ...). Hoe ernstig is de allergie? Wat zijn de symptomen? Wat moet er gebeuren bij een allergische reactie?"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="medicalInformation.medicationAllergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergisch aan bepaalde medicatie</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Som hier op welke zaken (bv. antibiotica, pijnstillers, ...). Hoe ernstig is de allergie? Wat zijn de symptomen? Wat moet er gebeuren bij een allergische reactie?"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="medicalInformation.hayFever.hasCondition"
            label="Hooikoorts"
          />
          <ConditionalField
            form={form}
            name="medicalInformation.hayFever.info"
            placeholder="(optioneel) extra nuttige informatie"
            condition={form.watch("medicalInformation.hayFever.hasCondition")}
          />
        </div>
      </div>
    </CardWrapper>
  );
}
