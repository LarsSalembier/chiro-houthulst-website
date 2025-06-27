"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CalendarDate } from "@internationalized/date";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import { getFullMemberDetails, updateMember } from "../actions";
import { findGroupForMember } from "~/app/leidingsportaal/inschrijven/actions";
import { type Gender, type ParentRelationship, type PaymentMethod, type Group } from "~/server/db/schema";
import SignInAsLeiding from "~/app/leidingsportaal/sign-in-as-leiding";
import DDMMYYYYDateInput from "~/components/ui/dd-mm-yyyy-date-input";

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = parseInt(params.id as string, 10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberData, setMemberData] = useState<Awaited<ReturnType<typeof getFullMemberDetails>> | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { href: "/leidingsportaal/leden", label: "Leden" },
    { href: `/leidingsportaal/leden/${memberId}`, label: "Lidgegevens" },
    { label: "Bewerken" },
  ];

  const form = useForm({
    defaultValues: {
      member: {
        firstName: "",
        lastName: "",
        gender: undefined as Gender | undefined,
        dateOfBirth: undefined as Date | undefined,
        emailAddress: "",
        phoneNumber: "",
        gdprPermissionToPublishPhotos: true,
      },
      parents: [
        {
          firstName: "",
          lastName: "",
          emailAddress: "",
          phoneNumber: "",
          relationship: undefined as ParentRelationship | undefined,
          address: {
            street: "",
            houseNumber: "",
            postalCode: "",
            municipality: "",
          },
          isPrimary: true,
        },
      ],
      emergencyContact: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        relationship: "",
      },
      medicalInformation: {
        doctorFirstName: "",
        doctorLastName: "",
        doctorPhoneNumber: "",
        tetanusVaccination: true,
        asthma: false,
        asthmaDescription: "",
        bedwetting: false,
        bedwettingDescription: "",
        epilepsy: false,
        epilepsyDescription: "",
        heartCondition: false,
        heartConditionDescription: "",
        hayFever: false,
        hayFeverDescription: "",
        skinCondition: false,
        skinConditionDescription: "",
        rheumatism: false,
        rheumatismDescription: "",
        sleepwalking: false,
        sleepwalkingDescription: "",
        diabetes: false,
        diabetesDescription: "",
        hasFoodAllergies: false,
        foodAllergies: "",
        hasSubstanceAllergies: false,
        substanceAllergies: "",
        hasMedicationAllergies: false,
        medicationAllergies: "",
        hasMedication: false,
        medication: "",
        hasOtherMedicalConditions: false,
        otherMedicalConditions: "",
        getsTiredQuickly: false,
        canParticipateSports: true,
        canSwim: true,
        otherRemarks: "",
        permissionMedication: true,
      },
      payment: {
        paymentReceived: false,
        paymentMethod: undefined as PaymentMethod | undefined,
        paymentDate: undefined as Date | undefined,
      },
    },
    onSubmit: async ({ value }) => {
      try {
        const submitData = {
          member: {
            ...value.member,
            gender: value.member.gender!,
            dateOfBirth: value.member.dateOfBirth!,
          },
          parents: value.parents.map((parent) => ({
            ...parent,
            relationship: parent.relationship!,
            address: {
              ...parent.address,
              postalCode: parseInt(parent.address.postalCode, 10) ?? 0,
            },
          })),
          emergencyContact: value.emergencyContact,
          medicalInformation: value.medicalInformation,
          payment: value.payment,
        };

        await updateMember(Number(memberId), submitData);
        router.push(`/leidingsportaal/leden/${memberId}`);
      } catch (error) {
        console.error("Error updating member:", error);
        // Handle error (show toast, etc.)
      }
    },
  });

  useEffect(() => {
    const loadMember = async () => {
      setLoading(true);
      try {
        const data = await getFullMemberDetails(memberId);
        setMemberData(data);
      } catch (err) {
        setFormError("Kon lidgegevens niet laden.");
      } finally {
        setLoading(false);
      }
    };
    if (memberId) void loadMember();
  }, [memberId]);

  // Load member data into form when available
  useEffect(() => {
    if (memberData) {
      // Set member data
      form.setFieldValue("member.firstName", memberData.firstName ?? "");
      form.setFieldValue("member.lastName", memberData.lastName ?? "");
      form.setFieldValue("member.gender", memberData.gender);
      if (memberData.dateOfBirth) {
        // Handle both Date objects and date strings
        const date = memberData.dateOfBirth instanceof Date 
          ? memberData.dateOfBirth 
          : new Date(memberData.dateOfBirth);
        form.setFieldValue("member.dateOfBirth", date);
      }
      form.setFieldValue("member.emailAddress", memberData.emailAddress ?? "");
      form.setFieldValue("member.phoneNumber", memberData.phoneNumber ?? "");
      form.setFieldValue("member.gdprPermissionToPublishPhotos", memberData.gdprPermissionToPublishPhotos ?? true);

      // Set current group from member data
      if (memberData.yearlyMemberships?.[0]?.group) {
        setCurrentGroup(memberData.yearlyMemberships[0].group);
      }

      // Set parents data
      if (memberData.parents && memberData.parents.length > 0) {
        const parentsData = memberData.parents.map((parent) => ({
          firstName: parent.firstName ?? "",
          lastName: parent.lastName ?? "",
          emailAddress: parent.emailAddress ?? "",
          phoneNumber: parent.phoneNumber ?? "",
          relationship: parent.relationship,
          address: {
            street: parent.address?.street ?? "",
            houseNumber: parent.address?.houseNumber ?? "",
            postalCode: parent.address?.postalCode?.toString() ?? "",
            municipality: parent.address?.municipality ?? "",
          },
          isPrimary: parent.isPrimary ?? false,
        }));
        form.setFieldValue("parents", parentsData);
      }

      // Set emergency contact data
      if (memberData.emergencyContact) {
        form.setFieldValue("emergencyContact.firstName", memberData.emergencyContact.firstName ?? "");
        form.setFieldValue("emergencyContact.lastName", memberData.emergencyContact.lastName ?? "");
        form.setFieldValue("emergencyContact.phoneNumber", memberData.emergencyContact.phoneNumber ?? "");
        form.setFieldValue("emergencyContact.relationship", memberData.emergencyContact.relationship ?? "");
      }

      // Set medical information data
      if (memberData.medicalInformation) {
        form.setFieldValue("medicalInformation.doctorFirstName", memberData.medicalInformation.doctorFirstName ?? "");
        form.setFieldValue("medicalInformation.doctorLastName", memberData.medicalInformation.doctorLastName ?? "");
        form.setFieldValue("medicalInformation.doctorPhoneNumber", memberData.medicalInformation.doctorPhoneNumber ?? "");
        form.setFieldValue("medicalInformation.tetanusVaccination", memberData.medicalInformation.tetanusVaccination ?? true);
        form.setFieldValue("medicalInformation.asthma", memberData.medicalInformation.asthma ?? false);
        form.setFieldValue("medicalInformation.asthmaDescription", memberData.medicalInformation.asthmaInformation ?? "");
        form.setFieldValue("medicalInformation.bedwetting", memberData.medicalInformation.bedwetting ?? false);
        form.setFieldValue("medicalInformation.bedwettingDescription", memberData.medicalInformation.bedwettingInformation ?? "");
        form.setFieldValue("medicalInformation.epilepsy", memberData.medicalInformation.epilepsy ?? false);
        form.setFieldValue("medicalInformation.epilepsyDescription", memberData.medicalInformation.epilepsyInformation ?? "");
        form.setFieldValue("medicalInformation.heartCondition", memberData.medicalInformation.heartCondition ?? false);
        form.setFieldValue("medicalInformation.heartConditionDescription", memberData.medicalInformation.heartConditionInformation ?? "");
        form.setFieldValue("medicalInformation.hayFever", memberData.medicalInformation.hayFever ?? false);
        form.setFieldValue("medicalInformation.hayFeverDescription", memberData.medicalInformation.hayFeverInformation ?? "");
        form.setFieldValue("medicalInformation.skinCondition", memberData.medicalInformation.skinCondition ?? false);
        form.setFieldValue("medicalInformation.skinConditionDescription", memberData.medicalInformation.skinConditionInformation ?? "");
        form.setFieldValue("medicalInformation.rheumatism", memberData.medicalInformation.rheumatism ?? false);
        form.setFieldValue("medicalInformation.rheumatismDescription", memberData.medicalInformation.rheumatismInformation ?? "");
        form.setFieldValue("medicalInformation.sleepwalking", memberData.medicalInformation.sleepwalking ?? false);
        form.setFieldValue("medicalInformation.sleepwalkingDescription", memberData.medicalInformation.sleepwalkingInformation ?? "");
        form.setFieldValue("medicalInformation.diabetes", memberData.medicalInformation.diabetes ?? false);
        form.setFieldValue("medicalInformation.diabetesDescription", memberData.medicalInformation.diabetesInformation ?? "");
        form.setFieldValue("medicalInformation.hasFoodAllergies", !!memberData.medicalInformation.foodAllergies);
        form.setFieldValue("medicalInformation.foodAllergies", memberData.medicalInformation.foodAllergies ?? "");
        form.setFieldValue("medicalInformation.hasSubstanceAllergies", !!memberData.medicalInformation.substanceAllergies);
        form.setFieldValue("medicalInformation.substanceAllergies", memberData.medicalInformation.substanceAllergies ?? "");
        form.setFieldValue("medicalInformation.hasMedicationAllergies", !!memberData.medicalInformation.medicationAllergies);
        form.setFieldValue("medicalInformation.medicationAllergies", memberData.medicalInformation.medicationAllergies ?? "");
        form.setFieldValue("medicalInformation.hasMedication", !!memberData.medicalInformation.medication);
        form.setFieldValue("medicalInformation.medication", memberData.medicalInformation.medication ?? "");
        form.setFieldValue("medicalInformation.hasOtherMedicalConditions", !!memberData.medicalInformation.otherMedicalConditions);
        form.setFieldValue("medicalInformation.otherMedicalConditions", memberData.medicalInformation.otherMedicalConditions ?? "");
        form.setFieldValue("medicalInformation.getsTiredQuickly", memberData.medicalInformation.getsTiredQuickly ?? false);
        form.setFieldValue("medicalInformation.canParticipateSports", memberData.medicalInformation.canParticipateSports ?? true);
        form.setFieldValue("medicalInformation.canSwim", memberData.medicalInformation.canSwim ?? true);
        form.setFieldValue("medicalInformation.otherRemarks", memberData.medicalInformation.otherRemarks ?? "");
        form.setFieldValue("medicalInformation.permissionMedication", memberData.medicalInformation.permissionMedication ?? true);
      }

      // Set payment data
      if (memberData.yearlyMemberships?.[0]) {
        form.setFieldValue("payment.paymentReceived", memberData.yearlyMemberships[0].paymentReceived ?? false);
        form.setFieldValue("payment.paymentMethod", memberData.yearlyMemberships[0].paymentMethod ?? undefined);
        if (memberData.yearlyMemberships[0].paymentDate) {
          form.setFieldValue("payment.paymentDate", new Date(memberData.yearlyMemberships[0].paymentDate));
        }
      }
    }
  }, [memberData, form]);

  // Parent management functions
  const addParent = () => {
    const currentParents = form.getFieldValue("parents");
    const lastParent = currentParents[currentParents.length - 1];

    const newParent = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      phoneNumber: "",
      relationship: undefined as ParentRelationship | undefined,
      address: {
        street: lastParent?.address?.street ?? "",
        houseNumber: lastParent?.address?.houseNumber ?? "",
        postalCode: lastParent?.address?.postalCode ?? "",
        municipality: lastParent?.address?.municipality ?? "",
      },
      isPrimary: false,
    };
    form.setFieldValue("parents", [...currentParents, newParent]);
  };

  const removeParent = (index: number) => {
    const currentParents = form.getFieldValue("parents");
    if (currentParents.length > 1) {
      const updatedParents = currentParents.filter((_, i: number) => i !== index);
      if (
        currentParents[index]?.isPrimary &&
        updatedParents.length > 0 &&
        updatedParents[0]
      ) {
        updatedParents[0].isPrimary = true;
      }
      form.setFieldValue("parents", updatedParents);
    }
  };

  const setPrimaryParent = (index: number) => {
    const currentParents = form.getFieldValue("parents");
    const updatedParents = currentParents.map((parent: {
      firstName: string;
      lastName: string;
      emailAddress: string;
      phoneNumber: string;
      relationship: ParentRelationship | undefined;
      address: {
        street: string;
        houseNumber: string;
        postalCode: string;
        municipality: string;
      };
      isPrimary: boolean;
    }, i: number) => ({
      ...parent,
      isPrimary: i === index,
    }));
    form.setFieldValue("parents", updatedParents);
  };

  const handleGroupUpdate = async (dateOfBirth: Date | undefined, gender: Gender | undefined) => {
    if (dateOfBirth && gender) {
      try {
        const group = await findGroupForMember(dateOfBirth, gender);
        setCurrentGroup(group);
      } catch (error) {
        console.error("Error finding group:", error);
        setCurrentGroup(null);
      }
    } else {
      setCurrentGroup(null);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Laden...</div>;
  }

  if (!memberData) {
    return <div className="flex min-h-screen items-center justify-center text-red-600">{formError ?? "Lid niet gevonden"}</div>;
  }

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />
      <BlogTextNoAnimation>
        <h1>Lidgegevens bewerken</h1>
        <div className="flex gap-4">
          <SignedOut>
            <SignInAsLeiding />
          </SignedOut>
        </div>
      </BlogTextNoAnimation>
      <SignedIn>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="mx-auto max-w-4xl space-y-8"
        >
          {/* Member Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Gegevens van het lid</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {formError && (
                <div className="rounded-lg bg-danger-50 p-4">
                  <p className="text-sm text-danger-700">{formError}</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field
                  name="member.firstName"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value?.trim()) return "Voornaam is verplicht";
                      if (value.trim().length > 100)
                        return "Voornaam mag maximaal 100 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Voornaam"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>

                <form.Field
                  name="member.lastName"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value?.trim()) return "Achternaam is verplicht";
                      if (value.trim().length > 100)
                        return "Achternaam mag maximaal 100 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Achternaam"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>

                <form.Field
                  name="member.gender"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Geslacht is verplicht";
                      if (!["M", "F", "X"].includes(value))
                        return "Ongeldige waarde voor geslacht";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Select
                      label="Geslacht"
                      selectedKeys={
                        field.state.value ? [field.state.value] : []
                      }
                      onSelectionChange={async (keys) => {
                        const value = Array.from(keys)[0] as Gender;
                        field.handleChange(value);
                        
                        // Update group when gender changes
                        const dateOfBirth = form.getFieldValue("member.dateOfBirth");
                        await handleGroupUpdate(dateOfBirth, value);
                      }}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    >
                      <SelectItem key="M">Jongen</SelectItem>
                      <SelectItem key="F">Meisje</SelectItem>
                      <SelectItem key="X">Anders</SelectItem>
                    </Select>
                  )}
                </form.Field>

                <form.Field
                  name="member.dateOfBirth"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Geboortedatum is verplicht";
                      if (!(value instanceof Date) || isNaN(value.getTime()))
                        return "Ongeldige geboortedatum";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <DDMMYYYYDateInput
                      label="Geboortedatum"
                      value={field.state.value}
                      onChange={async (date: Date | undefined) => {
                        field.handleChange(date);
                        
                        // Update group when birthdate changes
                        const gender = form.getFieldValue("member.gender");
                        await handleGroupUpdate(date, gender);
                      }}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>

                {currentGroup && (
                  <div
                    className="rounded-lg p-4"
                    style={{
                      backgroundColor: currentGroup.color
                        ? `${currentGroup.color}15`
                        : "#f0f9ff",
                    }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: currentGroup.color ?? "#0c4a6e",
                      }}
                    >
                      <strong>Huidige groep:</strong> {currentGroup.name}
                    </p>
                  </div>
                )}

                <form.Field
                  name="member.emailAddress"
                  validators={{
                    onChange: ({ value }) => {
                      if (value && value.trim().length > 255)
                        return "E-mailadres mag maximaal 255 karakters bevatten";
                      if (value && !z.string().email().safeParse(value).success)
                        return "Geldig e-mailadres is verplicht";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="E-mailadres"
                      type="email"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                    />
                  )}
                </form.Field>

                <form.Field
                  name="member.phoneNumber"
                  validators={{
                    onChange: ({ value }) => {
                      if (value && value.trim().length > 20)
                        return "Telefoonnummer mag maximaal 20 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Telefoonnummer"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                    />
                  )}
                </form.Field>
              </div>

              <form.Field name="member.gdprPermissionToPublishPhotos">
                {(field) => (
                  <Checkbox
                    isSelected={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    Toestemming voor het publiceren van foto&apos;s
                  </Checkbox>
                )}
              </form.Field>
            </CardBody>
          </Card>

          {/* Parents Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Ouders</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <form.Subscribe selector={(state) => state.values.parents}>
                {(parents) => (
                  <>
                    {parents.map((parent, parentIndex) => (
                      <div key={parentIndex} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">
                            Ouder {parentIndex + 1}
                            {parent.isPrimary && (
                              <span className="ml-2 text-sm font-medium text-primary-600">
                                (Primaire ouder)
                              </span>
                            )}
                          </h3>
                          <div className="flex gap-2">
                            {!parent.isPrimary && (
                              <Button
                                type="button"
                                color="primary"
                                variant="flat"
                                size="sm"
                                onPress={() => setPrimaryParent(parentIndex)}
                              >
                                Stel in als primaire ouder
                              </Button>
                            )}
                            {parents.length > 1 && (
                              <Button
                                type="button"
                                color="danger"
                                variant="flat"
                                size="sm"
                                onPress={() => removeParent(parentIndex)}
                              >
                                Verwijderen
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field
                            name={`parents[${parentIndex}].firstName`}
                            validators={{
                              onChange: ({ value }) => {
                                if (!value?.trim())
                                  return "Voornaam is verplicht";
                                if (value.trim().length > 100)
                                  return "Voornaam mag maximaal 100 karakters bevatten";
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <Input
                                label="Voornaam"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                                isInvalid={field.state.meta.errors.length > 0}
                                errorMessage={field.state.meta.errors[0]}
                                isRequired
                              />
                            )}
                          </form.Field>

                          <form.Field
                            name={`parents[${parentIndex}].lastName`}
                            validators={{
                              onChange: ({ value }) => {
                                if (!value?.trim())
                                  return "Achternaam is verplicht";
                                if (value.trim().length > 100)
                                  return "Achternaam mag maximaal 100 karakters bevatten";
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <Input
                                label="Achternaam"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                                isInvalid={field.state.meta.errors.length > 0}
                                errorMessage={field.state.meta.errors[0]}
                                isRequired
                              />
                            )}
                          </form.Field>

                          <form.Field
                            name={`parents[${parentIndex}].emailAddress`}
                            validators={{
                              onChange: ({ value }) => {
                                if (!value?.trim())
                                  return "E-mailadres is verplicht";
                                if (value.trim().length > 255)
                                  return "E-mailadres mag maximaal 255 karakters bevatten";
                                if (
                                  !z.string().email().safeParse(value).success
                                ) {
                                  return "Geldig e-mailadres is verplicht";
                                }
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <Input
                                label="E-mailadres"
                                type="email"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                                isInvalid={field.state.meta.errors.length > 0}
                                errorMessage={field.state.meta.errors[0]}
                                isRequired
                              />
                            )}
                          </form.Field>

                          <form.Field
                            name={`parents[${parentIndex}].phoneNumber`}
                            validators={{
                              onChange: ({ value }) => {
                                if (!value?.trim())
                                  return "Telefoonnummer is verplicht";
                                if (value.trim().length > 20)
                                  return "Telefoonnummer mag maximaal 20 karakters bevatten";
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <Input
                                label="Telefoonnummer"
                                type="tel"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                                isInvalid={field.state.meta.errors.length > 0}
                                errorMessage={field.state.meta.errors[0]}
                                isRequired
                              />
                            )}
                          </form.Field>

                          <form.Field
                            name={`parents[${parentIndex}].relationship`}
                            validators={{
                              onChange: ({ value }) => {
                                if (!value) return "Relatie is verplicht";
                                if (
                                  ![
                                    "MOTHER",
                                    "FATHER",
                                    "PLUSMOTHER",
                                    "PLUSFATHER",
                                    "GUARDIAN",
                                  ].includes(value)
                                )
                                  return "Ongeldige waarde voor relatie";
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <Select
                                label="Relatie"
                                selectedKeys={
                                  field.state.value ? [field.state.value] : []
                                }
                                onSelectionChange={(keys) => {
                                  const value = Array.from(
                                    keys,
                                  )[0] as ParentRelationship;
                                  field.handleChange(value);
                                }}
                                isInvalid={field.state.meta.errors.length > 0}
                                errorMessage={field.state.meta.errors[0]}
                                isRequired
                              >
                                <SelectItem key="FATHER">Vader</SelectItem>
                                <SelectItem key="MOTHER">Moeder</SelectItem>
                                <SelectItem key="PLUSFATHER">
                                  Plusvader
                                </SelectItem>
                                <SelectItem key="PLUSMOTHER">
                                  Plusmoeder
                                </SelectItem>
                                <SelectItem key="GUARDIAN">Voogd</SelectItem>
                              </Select>
                            )}
                          </form.Field>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field
                            name={`parents[${parentIndex}].address.street`}
                            validators={{
                              onChange: ({ value }) => {
                                if (!value?.trim())
                                  return "Straat is verplicht";
                                if (value.trim().length > 100)
                                  return "Straat mag maximaal 100 karakters bevatten";
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <Input
                                label="Straat"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                                isInvalid={field.state.meta.errors.length > 0}
                                errorMessage={field.state.meta.errors[0]}
                                isRequired
                              />
                            )}
                          </form.Field>

                          <form.Field
                            name={`parents[${parentIndex}].address.houseNumber`}
                            validators={{
                              onChange: ({ value }) => {
                                if (!value?.trim())
                                  return "Huisnummer is verplicht";
                                if (value.trim().length > 10)
                                  return "Huisnummer mag maximaal 10 karakters bevatten";
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <Input
                                label="Huisnummer"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                                isInvalid={field.state.meta.errors.length > 0}
                                errorMessage={field.state.meta.errors[0]}
                                isRequired
                              />
                            )}
                          </form.Field>

                          <form.Field
                            name={`parents[${parentIndex}].address.postalCode`}
                            validators={{
                              onChange: ({ value }) => {
                                if (!value?.trim())
                                  return "Postcode is verplicht";
                                const postalCode = parseInt(value.trim(), 10);
                                if (isNaN(postalCode))
                                  return "Postcode moet een geldig nummer zijn";
                                if (postalCode < 1000 || postalCode > 9999)
                                  return "Postcode moet tussen 1000 en 9999 liggen";
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <Input
                                label="Postcode"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                                isInvalid={field.state.meta.errors.length > 0}
                                errorMessage={field.state.meta.errors[0]}
                                isRequired
                              />
                            )}
                          </form.Field>

                          <form.Field
                            name={`parents[${parentIndex}].address.municipality`}
                            validators={{
                              onChange: ({ value }) => {
                                if (!value?.trim())
                                  return "Gemeente is verplicht";
                                if (value.trim().length > 50)
                                  return "Gemeente mag maximaal 50 karakters bevatten";
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <Input
                                label="Gemeente"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                                isInvalid={field.state.meta.errors.length > 0}
                                errorMessage={field.state.meta.errors[0]}
                                isRequired
                              />
                            )}
                          </form.Field>
                        </div>

                        {parentIndex < parents.length - 1 && <Divider />}
                      </div>
                    ))}

                    <div className="flex justify-center pt-4">
                      <Button
                        type="button"
                        color="primary"
                        variant="flat"
                        onPress={addParent}
                      >
                        Ouder toevoegen
                      </Button>
                    </div>
                  </>
                )}
              </form.Subscribe>
            </CardBody>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Noodcontact</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field
                  name="emergencyContact.firstName"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value?.trim()) return "Voornaam is verplicht";
                      if (value.trim().length > 100)
                        return "Voornaam mag maximaal 100 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Voornaam"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>

                <form.Field
                  name="emergencyContact.lastName"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value?.trim()) return "Achternaam is verplicht";
                      if (value.trim().length > 100)
                        return "Achternaam mag maximaal 100 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Achternaam"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>

                <form.Field
                  name="emergencyContact.phoneNumber"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value?.trim()) return "Telefoonnummer is verplicht";
                      if (value.trim().length > 20)
                        return "Telefoonnummer mag maximaal 20 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Telefoonnummer"
                      type="tel"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>

                <form.Field
                  name="emergencyContact.relationship"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value?.trim()) return "Relatie is verplicht";
                      if (value.trim().length > 50)
                        return "Relatie mag maximaal 50 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Relatie (oma, zus ...)"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>
              </div>
            </CardBody>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Medische informatie</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field
                  name="medicalInformation.doctorFirstName"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value?.trim())
                        return "Voornaam van dokter is verplicht";
                      if (value.trim().length > 100)
                        return "Voornaam mag maximaal 100 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Voornaam dokter"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>
                <form.Field
                  name="medicalInformation.doctorLastName"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value?.trim())
                        return "Achternaam van dokter is verplicht";
                      if (value.trim().length > 100)
                        return "Achternaam mag maximaal 100 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Achternaam dokter"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>
                <form.Field
                  name="medicalInformation.doctorPhoneNumber"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value?.trim())
                        return "Telefoonnummer van dokter is verplicht";
                      if (value.trim().length > 20)
                        return "Telefoonnummer mag maximaal 20 karakters bevatten";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Telefoonnummer dokter"
                      type="tel"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      isRequired
                    />
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <form.Field name="medicalInformation.tetanusVaccination">
                  {(field) => (
                    <Checkbox
                      isSelected={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      Tetanusvaccinatie
                    </Checkbox>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.asthma">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Astma
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.asthmaDescription">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf astma"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf de astma en eventuele triggers..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.bedwetting">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Bedplassen
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.bedwettingDescription">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf bedplassen"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf frequentie en eventuele maatregelen..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.epilepsy">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Epilepsie
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.epilepsyDescription">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf epilepsie"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf type aanvallen en medicatie..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.heartCondition">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Hartafwijking
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.heartConditionDescription">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf hartafwijking"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf de hartafwijking en eventuele beperkingen..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.hayFever">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Hooikoorts
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.hayFeverDescription">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf hooikoorts"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf triggers en eventuele medicatie..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.skinCondition">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Huidaandoening
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.skinConditionDescription">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf huidaandoening"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf de huidaandoening en eventuele verzorging..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.rheumatism">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Reuma
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.rheumatismDescription">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf reuma"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf de reuma en eventuele beperkingen..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.sleepwalking">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Slaapwandelen
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.sleepwalkingDescription">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf slaapwandelen"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf frequentie en eventuele maatregelen..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.diabetes">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Diabetes
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.diabetesDescription">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf diabetes"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf type diabetes en eventuele medicatie..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.getsTiredQuickly">
                  {(field) => (
                    <Checkbox
                      isSelected={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      Snel moe
                    </Checkbox>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.canParticipateSports">
                  {(field) => (
                    <Checkbox
                      isSelected={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      Kan sporten
                    </Checkbox>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.canSwim">
                  {(field) => (
                    <Checkbox
                      isSelected={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      Kan zwemmen
                    </Checkbox>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.permissionMedication">
                  {(field) => (
                    <Checkbox
                      isSelected={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      Toestemming medicatie
                    </Checkbox>
                  )}
                </form.Field>
              </div>

              {/* Medical conditions with text fields */}
              <div className="space-y-4">
                <form.Field name="medicalInformation.hasFoodAllergies">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Heeft voedselallergieën
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.foodAllergies">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf voedselallergieën"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf eventuele voedselallergieën..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.hasSubstanceAllergies">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Heeft stofallergieën
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.substanceAllergies">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf stofallergieën"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf eventuele stofallergieën..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.hasMedicationAllergies">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Heeft medicijnallergieën
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.medicationAllergies">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf medicijnallergieën"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf eventuele medicijnallergieën..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.hasMedication">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Gebruikt medicatie
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.medication">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf medicatie"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf eventuele medicatie..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.hasOtherMedicalConditions">
                  {(field) => (
                    <div className="space-y-2">
                      <Checkbox
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Heeft andere medische aandoeningen
                      </Checkbox>
                      {field.state.value && (
                        <form.Field name="medicalInformation.otherMedicalConditions">
                          {(descField) => (
                            <Textarea
                              label="Beschrijf andere medische aandoeningen"
                              value={descField.state.value}
                              onValueChange={descField.handleChange}
                              isInvalid={descField.state.meta.errors.length > 0}
                              errorMessage={descField.state.meta.errors[0]}
                              placeholder="Beschrijf andere medische aandoeningen..."
                            />
                          )}
                        </form.Field>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="medicalInformation.otherRemarks">
                  {(field) => (
                    <Textarea
                      label="Andere opmerkingen"
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                      placeholder="Andere belangrijke opmerkingen..."
                    />
                  )}
                </form.Field>
              </div>
            </CardBody>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Betaling</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field name="payment.paymentReceived">
                  {(field) => (
                    <Checkbox
                      isSelected={field.state.value}
                      onValueChange={(checked) => {
                        field.handleChange(checked);
                        // Automatically set payment date to current date when payment is received
                        if (checked) {
                          form.setFieldValue("payment.paymentDate", new Date());
                        } else {
                          form.setFieldValue("payment.paymentDate", undefined);
                        }
                      }}
                    >
                      Betaling ontvangen
                    </Checkbox>
                  )}
                </form.Field>

                <form.Field name="payment.paymentMethod">
                  {(field) => (
                    <Select
                      label="Betaalmethode"
                      selectedKeys={
                        field.state.value ? [field.state.value] : []
                      }
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as PaymentMethod;
                        field.handleChange(value);
                      }}
                      isInvalid={field.state.meta.errors.length > 0}
                      errorMessage={field.state.meta.errors[0]}
                    >
                      <SelectItem key="CASH">Contant</SelectItem>
                      <SelectItem key="BANK_TRANSFER">Overschrijving</SelectItem>
                      <SelectItem key="PAYCONIQ">Payconiq</SelectItem>
                      <SelectItem key="OTHER">Anders</SelectItem>
                    </Select>
                  )}
                </form.Field>
              </div>
            </CardBody>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="flat"
              onPress={() => router.push(`/leidingsportaal/leden/${memberId}`)}
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Bewerken..." : "Wijzigingen opslaan"}
            </Button>
          </div>
        </form>
      </SignedIn>
    </>
  );
} 