"use client";

import { toast } from "sonner";
import { AuthenticationError } from "~/lib/errors";
import { Button } from "~/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { PlusIcon } from "lucide-react";
import { type Metadata } from "next";
import {
  type parentSchema,
  registrationFormSchema,
  type RegistrationFormValues,
} from "./schemas";
import MemberDetailsForm from "./forms/member-details-form";
import { ParentForm } from "./forms/parent-form";
import { AllergiesForm } from "./forms/allergies-form";
import DoctorContactForm from "./forms/doctor-contact-form";
import ExtraContactPersonForm from "./forms/extra-contact-person-form";
import MedicalConditionsForm from "./forms/medical-conditions-form";
import { MedicalInformationForm } from "./forms/medical-information-form";
import PrivacyForm from "./forms/privacy-form";
import SportsAndActivitiesForm from "./forms/sports-and-activities-form";
import FormFieldComponent from "./form-field";
import CardWrapper from "../../../../components/card-wrapper";
import { type z } from "zod";
import { createMemberRegistrationAndRevalidate } from "./actions";

export const metadata: Metadata = {
  title: "Uw kind inschrijven",
  description: "Schrijf uw kind in voor Chiro Houthulst.",
};

export default function RegistrationForm() {
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      parents: [{}],
      permissionPhotos: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parents",
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      await createMemberRegistrationAndRevalidate(data);
      console.log(data);
      toast.success(`${data.memberFirstName} is ingeschreven!`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof AuthenticationError) {
      toast.error("Je bent niet ingelogd.");
    } else {
      toast.error("Er is iets misgegaan bij het toevoegen van het lid.");
      console.error("Error adding member", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <MemberDetailsForm form={form} />
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <ParentForm
              key={field.id}
              form={form}
              index={index}
              onRemove={() => remove(index)}
              isRemovable={index > 0}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({
                street: form.watch(`parents.${fields.length - 1}.street`),
                houseNumber: form.watch(
                  `parents.${fields.length - 1}.houseNumber`,
                ),
                bus: form.watch(`parents.${fields.length - 1}.bus`),
                postalCode: form.watch(
                  `parents.${fields.length - 1}.postalCode`,
                ),
                municipality: form.watch(
                  `parents.${fields.length - 1}.municipality`,
                ),
              } as z.infer<typeof parentSchema>)
            }
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Voeg nog een ouder toe
          </Button>
        </div>
        <ExtraContactPersonForm form={form} />
        <PrivacyForm form={form} />
        <AllergiesForm form={form} />
        <MedicalConditionsForm form={form} />
        <MedicalInformationForm form={form} />
        <SportsAndActivitiesForm form={form} />
        <DoctorContactForm form={form} />
        <CardWrapper title="Algemene opmerkingen">
          <FormFieldComponent
            form={form}
            name="otherRemarks"
            label="Zijn er nog zaken die we zeker moeten weten over uw kind? Zijn er zaken waar we extra rekening mee moeten houden?"
            placeholder="Vul hier eventuele opmerkingen in"
          />
        </CardWrapper>

        <div className="flex flex-col gap-4">
          <Button type="submit">
            {form.formState.isSubmitting
              ? "Bezig met toevoegen..."
              : "Inschrijven"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
