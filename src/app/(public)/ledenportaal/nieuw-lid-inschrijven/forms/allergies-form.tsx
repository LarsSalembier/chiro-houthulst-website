import React, { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import CheckboxField from "~/components/forms/checkbox-field";
import ConditionalField from "~/components/forms/conditional-field";
import { type RegistrationFormValues } from "../schemas";

interface AllergiesFormProps {
  form: UseFormReturn<RegistrationFormValues>;
}

export function AllergiesForm({ form }: AllergiesFormProps) {
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "foodAllergies" && value.foodAllergies === false) {
        form.setValue("foodAllergiesInfo", "");
      }

      if (name === "substanceAllergies" && value.substanceAllergies === false) {
        form.setValue("substanceAllergiesInfo", "");
      }

      if (
        name === "medicationAllergies" &&
        value.medicationAllergies === false
      ) {
        form.setValue("medicationAllergiesInfo", "");
      }

      if (name === "hayFever" && value.hayFever === false) {
        form.setValue("hayFeverInfo", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <CardWrapper title="Allergieën">
      <div className="space-y-6">
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="foodAllergies"
            label="Allergisch voor bepaalde voeding"
          />
          <ConditionalField
            form={form}
            name="foodAllergiesInfo"
            placeholder="Som hier op welke zaken (bv. noten, lactose, ...). Hoe ernstig is de allergie? Wat zijn de symptomen? Wat moet er gebeuren bij een allergische reactie?"
            condition={form.watch("foodAllergies")}
            numberOfLines={4}
          />
        </div>
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="medicationAllergies"
            label="Allergisch voor bepaalde medicatie"
          />
          <ConditionalField
            form={form}
            name="medicationAllergiesInfo"
            placeholder="Som hier op welke zaken (bv. bepaalde antibiotica, ontsmettingsmiddelen, pijnstillers, ...). Hoe ernstig is de allergie? Wat zijn de symptomen? Wat moet er gebeuren bij een allergische reactie?"
            condition={form.watch("medicationAllergies")}
            numberOfLines={4}
          />
        </div>
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="substanceAllergies"
            label="Allergisch voor bepaalde zaken"
          />
          <ConditionalField
            form={form}
            name="substanceAllergiesInfo"
            placeholder="Som hier op welke zaken (bv. verf, zonnecrème, insectenbeten, ...). Hoe ernstig is de allergie? Wat zijn de symptomen? Wat moet er gebeuren bij een allergische reactie?"
            condition={form.watch("substanceAllergies")}
            numberOfLines={4}
          />
        </div>
        <div className="space-y-3">
          <CheckboxField form={form} name="hayFever" label="Hooikoorts" />
          <ConditionalField
            form={form}
            name="hayFeverInfo"
            placeholder="(optioneel) extra nuttige informatie"
            condition={form.watch("hayFever")}
          />
        </div>
      </div>
    </CardWrapper>
  );
}
