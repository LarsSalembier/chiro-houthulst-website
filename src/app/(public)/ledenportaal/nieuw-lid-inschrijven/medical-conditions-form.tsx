import React, { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import CheckboxField from "./checkbox-field";
import ConditionalField from "./conditional-field";
import FormFieldComponent from "./form-field";
import { type RegistrationFormValues } from "./schemas";

interface MedicalConditionsFormProps {
  form: UseFormReturn<RegistrationFormValues>;
}

export default function MedicalConditionsForm({
  form,
}: MedicalConditionsFormProps) {
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "asthma" && value.asthma === false) {
        form.setValue("asthmaInfo", "");
      }

      if (name === "bedwetting" && value.bedwetting === false) {
        form.setValue("bedwettingInfo", "");
      }

      if (name === "epilepsy" && value.epilepsy === false) {
        form.setValue("epilepsyInfo", "");
      }

      if (name === "heartCondition" && value.heartCondition === false) {
        form.setValue("heartConditionInfo", "");
      }

      if (name === "skinCondition" && value.skinCondition === false) {
        form.setValue("skinConditionInfo", "");
      }

      if (name === "rheumatism" && value.rheumatism === false) {
        form.setValue("rheumatismInfo", "");
      }

      if (name === "sleepwalking" && value.sleepwalking === false) {
        form.setValue("sleepwalkingInfo", "");
      }

      if (name === "diabetes" && value.diabetes === false) {
        form.setValue("diabetesInfo", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <CardWrapper title="Medische aandoeningen">
      <div className="space-y-6">
        <div key="asthma" className="space-y-3">
          <CheckboxField form={form} name="asthma" label="Astma" />
          <ConditionalField
            form={form}
            name="asthmaInfo"
            placeholder="Wat moet de leiding zeker weten over de astma van uw kind? Wat moet er gebeuren bij een astma-aanval?"
            condition={form.watch("asthma")}
          />
        </div>
        <div key="bedwetting" className="space-y-3">
          <CheckboxField form={form} name="bedwetting" label="Bedwateren" />
          <ConditionalField
            form={form}
            name="bedwettingInfo"
            placeholder="(optioneel) extra nuttige informatie"
            condition={form.watch("bedwetting")}
          />
        </div>
        <div key="epilepsy" className="space-y-3">
          <CheckboxField form={form} name="epilepsy" label="Epilepsie" />
          <ConditionalField
            form={form}
            name="epilepsyInfo"
            placeholder="Wat moet de leiding zeker weten over de epilepsie van uw kind? Wat moet er gebeuren bij een epilepsie-aanval?"
            condition={form.watch("epilepsy")}
          />
        </div>
        <div key="heartCondition" className="space-y-3">
          <CheckboxField
            form={form}
            name="heartCondition"
            label="Hartaandoening"
          />
          <ConditionalField
            form={form}
            name="heartConditionInfo"
            placeholder="Welke hartaandoening heeft uw kind? Wat moet de leiding zeker weten over deze hartaandoening?"
            condition={form.watch("heartCondition")}
          />
        </div>
        <div key="skinCondition" className="space-y-3">
          <CheckboxField
            form={form}
            name="skinCondition"
            label="Huidaandoening"
          />
          <ConditionalField
            form={form}
            name="skinConditionInfo"
            placeholder="Welke huidaandoening heeft uw kind? Wat moet de leiding zeker weten over deze huidaandoening?"
            condition={form.watch("skinCondition")}
          />
        </div>
        <div key="rheumatism" className="space-y-3">
          <CheckboxField form={form} name="rheumatism" label="Reuma" />
          <ConditionalField
            form={form}
            name="rheumatismInfo"
            placeholder="(optioneel) extra nuttige informatie"
            condition={form.watch("rheumatism")}
          />
        </div>
        <div key="sleepwalking" className="space-y-3">
          <CheckboxField
            form={form}
            name="sleepwalking"
            label="Slaapwandelen"
          />
          <ConditionalField
            form={form}
            name="sleepwalkingInfo"
            placeholder="(optioneel) extra nuttige informatie"
            condition={form.watch("sleepwalking")}
          />
        </div>
        <div key="diabetes" className="space-y-3">
          <CheckboxField form={form} name="diabetes" label="Suikerziekte" />
          <ConditionalField
            form={form}
            name="diabetesInfo"
            placeholder="Wat moet de leiding zeker weten over de diabetes/suikerziekte van uw kind?"
            condition={form.watch("diabetes")}
          />
        </div>

        <FormFieldComponent
          form={form}
          name="otherMedicalConditions"
          label="Andere, namelijk..."
          placeholder="Som hier andere medische aandoeningen op waarvan de leiding op de hoogte moet zijn."
        />
      </div>
    </CardWrapper>
  );
}
