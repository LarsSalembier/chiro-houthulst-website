import React, { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import CheckboxField from "~/components/forms/checkbox-field";
import ConditionalField from "~/components/forms/conditional-field";
import FormFieldComponent from "../form-field";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface MedicalConditionsFormProps {
  form: UseFormReturn<RegisterMemberInput>;
}

export default function MedicalConditionsForm({
  form,
}: MedicalConditionsFormProps) {
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "medicalInformation.asthma.hasCondition" &&
        value.medicalInformation?.asthma?.hasCondition === false
      ) {
        form.setValue("medicalInformation.asthma.info", "");
      }

      if (
        name === "medicalInformation.bedwetting.hasCondition" &&
        value.medicalInformation?.bedwetting?.hasCondition === false
      ) {
        form.setValue("medicalInformation.bedwetting.info", "");
      }

      if (
        name === "medicalInformation.epilepsy.hasCondition" &&
        value.medicalInformation?.epilepsy?.hasCondition === false
      ) {
        form.setValue("medicalInformation.epilepsy.info", "");
      }

      if (
        name === "medicalInformation.heartCondition.hasCondition" &&
        value.medicalInformation?.heartCondition?.hasCondition === false
      ) {
        form.setValue("medicalInformation.heartCondition.info", "");
      }

      if (
        name === "medicalInformation.skinCondition.hasCondition" &&
        value.medicalInformation?.skinCondition?.hasCondition === false
      ) {
        form.setValue("medicalInformation.skinCondition.info", "");
      }

      if (
        name === "medicalInformation.rheumatism.hasCondition" &&
        value.medicalInformation?.rheumatism?.hasCondition === false
      ) {
        form.setValue("medicalInformation.rheumatism.info", "");
      }

      if (
        name === "medicalInformation.sleepwalking.hasCondition" &&
        value.medicalInformation?.sleepwalking?.hasCondition === false
      ) {
        form.setValue("medicalInformation.sleepwalking.info", "");
      }

      if (
        name === "medicalInformation.diabetes.hasCondition" &&
        value.medicalInformation?.diabetes?.hasCondition === false
      ) {
        form.setValue("medicalInformation.diabetes.info", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <CardWrapper title="Medische aandoeningen">
      <div className="space-y-6">
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="medicalInformation.asthma.hasCondition"
            label="Astma"
          />
          <ConditionalField
            form={form}
            name="medicalInformation.asthma.info"
            placeholder="Wat moet de leiding zeker weten over de astma van uw kind? Wat moet er gebeuren bij een astma-aanval?"
            condition={form.watch("medicalInformation.asthma.hasCondition")}
          />
        </div>
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="medicalInformation.bedwetting.hasCondition"
            label="Bedwateren"
          />
          <ConditionalField
            form={form}
            name="medicalInformation.bedwetting.info"
            placeholder="(optioneel) extra nuttige informatie"
            condition={form.watch("medicalInformation.bedwetting.hasCondition")}
          />
        </div>
        <div key="epilepsy" className="space-y-3">
          <CheckboxField
            form={form}
            name="medicalInformation.epilepsy.hasCondition"
            label="Epilepsie"
          />
          <ConditionalField
            form={form}
            name="medicalInformation.epilepsy.info"
            placeholder="Wat moet de leiding zeker weten over de epilepsie van uw kind? Wat moet er gebeuren bij een epilepsie-aanval?"
            condition={form.watch("medicalInformation.epilepsy.hasCondition")}
          />
        </div>
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="medicalInformation.heartCondition.hasCondition"
            label="Hartaandoening"
          />
          <ConditionalField
            form={form}
            name="medicalInformation.heartCondition.info"
            placeholder="Welke hartaandoening heeft uw kind? Wat moet de leiding zeker weten over deze hartaandoening?"
            condition={form.watch(
              "medicalInformation.heartCondition.hasCondition",
            )}
          />
        </div>
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="medicalInformation.skinCondition.hasCondition"
            label="Huidaandoening"
          />
          <ConditionalField
            form={form}
            name="medicalInformation.skinCondition.info"
            placeholder="Welke huidaandoening heeft uw kind? Wat moet de leiding zeker weten over deze huidaandoening?"
            condition={form.watch(
              "medicalInformation.skinCondition.hasCondition",
            )}
          />
        </div>
        <div className="space-y-3">
          <CheckboxField
            form={form}
            name="medicalInformation.rheumatism.hasCondition"
            label="Reuma"
          />
          <ConditionalField
            form={form}
            name="medicalInformation.rheumatism.info"
            placeholder="(optioneel) extra nuttige informatie"
            condition={form.watch("medicalInformation.rheumatism.hasCondition")}
          />
        </div>
        <div key="sleepwalking" className="space-y-3">
          <CheckboxField
            form={form}
            name="medicalInformation.sleepwalking.hasCondition"
            label="Slaapwandelen"
          />
          <ConditionalField
            form={form}
            name="medicalInformation.sleepwalking.info"
            placeholder="(optioneel) extra nuttige informatie"
            condition={form.watch(
              "medicalInformation.sleepwalking.hasCondition",
            )}
          />
        </div>
        <div key="diabetes" className="space-y-3">
          <CheckboxField
            form={form}
            name="medicalInformation.diabetes.hasCondition"
            label="Suikerziekte"
          />
          <ConditionalField
            form={form}
            name="medicalInformation.diabetes.info"
            placeholder="Wat moet de leiding zeker weten over de diabetes/suikerziekte van uw kind?"
            condition={form.watch("medicalInformation.diabetes.hasCondition")}
          />
        </div>

        <FormFieldComponent
          form={form}
          name="medicalInformation.otherMedicalConditions"
          label="Andere, namelijk..."
          placeholder="Som hier andere medische aandoeningen op waarvan de leiding op de hoogte moet zijn."
        />
      </div>
    </CardWrapper>
  );
}
