"use client";

import { toast } from "sonner";
import { AuthenticationError } from "~/lib/errors";
import { Button } from "~/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { PlusIcon } from "lucide-react";
import { type Metadata } from "next";
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
import MedicationPermissionForm from "./forms/medication-permission-form";
import { Section, SectionContent, SectionTitle } from "~/components/section";
import { registerMember } from "./actions";
import {
  registerMemberSchema,
  type RegisterMemberInput,
} from "~/interface-adapters/controllers/members/schema";
import CheckboxField from "~/components/forms/checkbox-field";
import RadioGroupField from "~/components/forms/radio-group-field";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Uw kind inschrijven",
  description: "Schrijf uw kind in voor Chiro Houthulst.",
};

export default function RegistrationForm() {
  const form = useForm<RegisterMemberInput>({
    resolver: zodResolver(registerMemberSchema),
    defaultValues: {
      memberData: {
        gdprPermissionToPublishPhotos: true,
      },
      parentsWithAddresses: [
        {
          parent: {
            name: {
              firstName: "",
              lastName: "",
            },
            phoneNumber: "",
            emailAddress: "",
            relationship: "MOTHER",
          },
          address: {
            street: "",
            houseNumber: "",
            box: "",
            postalCode: 0,
            municipality: "",
          },
        },
      ],
    },
  });

  const paymentMethod = form.watch("yearlyMembership.paymentMethod");
  const paid = form.watch("yearlyMembership.paymentReceived");

  useEffect(() => {
    if (paymentMethod || paid) {
      form.setValue("yearlyMembership.paymentDate", new Date());
    } else {
      form.setValue("yearlyMembership.paymentDate", null);
    }
  }, [paymentMethod, paid, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parentsWithAddresses",
  });

  const onSubmit = async (data: RegisterMemberInput) => {
    try {
      const result = await registerMember(data);

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(`${data.memberData.name.firstName} is ingeschreven.`);
      }
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

  const paymentMethodOptions = [
    { value: "CASH", label: "Cash" },
    { value: "BANK_TRANSFER", label: "Overschrijving" },
    { value: "PAYCONIQ", label: "Payconiq" },
    { value: "OTHER", label: "Andere" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Section>
          <SectionTitle>Gegevens van het lid</SectionTitle>
          <SectionContent>
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
                    parent: {
                      name: {
                        firstName: "",
                        lastName: "",
                      },
                      phoneNumber: "",
                      emailAddress: "",
                      relationship: "MOTHER",
                    },
                    address: {
                      street: form.watch(
                        `parentsWithAddresses.${fields.length - 1}.address.street`,
                      ),
                      houseNumber: form.watch(
                        `parentsWithAddresses.${fields.length - 1}.address.houseNumber`,
                      ),
                      box: form.watch(
                        `parentsWithAddresses.${fields.length - 1}.address.box`,
                      ),
                      postalCode: form.watch(
                        `parentsWithAddresses.${fields.length - 1}.address.postalCode`,
                      ),
                      municipality: form.watch(
                        `parentsWithAddresses.${fields.length - 1}.address.municipality`,
                      ),
                    },
                  })
                }
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Voeg nog een ouder toe
              </Button>
            </div>
            <ExtraContactPersonForm form={form} />
            <PrivacyForm form={form} />
          </SectionContent>
        </Section>
        <Section>
          <SectionTitle>Medische steekkaart</SectionTitle>
          <SectionContent>
            <MedicationPermissionForm form={form} />
            <AllergiesForm form={form} />
            <MedicalConditionsForm form={form} />
            <MedicalInformationForm form={form} />
            <SportsAndActivitiesForm form={form} />
            <DoctorContactForm form={form} />
            <CardWrapper title="Algemene opmerkingen">
              <FormFieldComponent
                form={form}
                name="medicalInformation.otherRemarks"
                label="Zijn er nog zaken die we zeker moeten weten over uw kind? Zijn er zaken waar we extra rekening mee moeten houden?"
                placeholder="Vul hier eventuele opmerkingen in"
              />
            </CardWrapper>
            <CardWrapper title="Betaling">
              <div className="flex flex-col gap-4">
                <CheckboxField
                  form={form}
                  name="yearlyMembership.paymentReceived"
                  label="Betaling ontvangen?"
                />
                <RadioGroupField
                  form={form}
                  name="yearlyMembership.paymentMethod"
                  options={paymentMethodOptions}
                />
              </div>
            </CardWrapper>

            <div className="flex flex-col gap-4">
              <Button type="submit">
                {form.formState.isSubmitting
                  ? "Bezig met toevoegen..."
                  : "Inschrijven"}
              </Button>
            </div>
          </SectionContent>
        </Section>
      </form>
    </Form>
  );
}
