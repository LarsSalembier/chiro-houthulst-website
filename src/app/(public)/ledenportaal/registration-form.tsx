"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";

const schema = z.object({
  // Ouderinformatie
  parentFirstName: z.string().min(1, "Voornaam is verplicht"),
  parentLastName: z.string().min(1, "Achternaam is verplicht"),
  parentType: z.enum(["MOEDER", "VADER", "GUARDIAN"]),
  parentPhone: z.string().min(1, "Telefoonnummer is verplicht"),
  parentEmail: z.string().email("Ongeldig e-mailadres"),

  // Adres
  street: z.string().min(1, "Straat is verplicht"),
  houseNumber: z.string().min(1, "Huisnummer is verplicht"),
  box: z.string().optional(),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  postalCode: z.string().min(1, "Postcode is verplicht"),

  // Tweede ouderinformatie
  addSecondParent: z.boolean(),
  partnerFirstName: z.string().optional(),
  partnerLastName: z.string().optional(),
  partnerType: z.enum(["MOTHER", "FATHER", "GUARDIAN"]).optional(),
  partnerPhone: z.string().optional(),
  partnerEmail: z.string().email("Ongeldig e-mailadres").optional(),

  // Kindinformatie
  childFirstName: z.string().min(1, "Voornaam is verplicht"),
  childLastName: z.string().min(1, "Achternaam is verplicht"),
  childGender: z.enum(["MALE", "FEMALE", "X"]),
  childDateOfBirth: z.string().min(1, "Geboortedatum is verplicht"),
  permissionPhotos: z.boolean(),

  // Medische Informatie
  generalPractitionerFirstName: z
    .string()
    .min(1, "Voornaam huisarts is verplicht"),
  generalPractitionerLastName: z
    .string()
    .min(1, "Achternaam huisarts is verplicht"),
  generalPractitionerPhone: z
    .string()
    .min(1, "Telefoonnummer huisarts is verplicht"),
  pastMedicalHistory: z.string().optional(),
  tetanusVaccination: z.boolean(),
  tetanusVaccinationYear: z.number().optional(),
  asthma: z.boolean(),
  asthmaInfo: z.string().optional(),
  bedwetting: z.boolean(),
  bedwettingInfo: z.string().optional(),
  epilepsy: z.boolean(),
  epilepsyInfo: z.string().optional(),
  heartCondition: z.boolean(),
  heartConditionInfo: z.string().optional(),
  hayFever: z.boolean(),
  hayFeverInfo: z.string().optional(),
  skinCondition: z.boolean(),
  skinConditionInfo: z.string().optional(),
  rheumatism: z.boolean(),
  rheumatismInfo: z.string().optional(),
  sleepwalking: z.boolean(),
  sleepwalkingInfo: z.string().optional(),
  diabetes: z.boolean(),
  diabetesInfo: z.string().optional(),
  foodAllergies: z.string().optional(),
  substanceAllergies: z.string().optional(),
  medicationAllergies: z.string().optional(),
  medicationDuringStay: z.string().optional(),
  getsTiredQuickly: z.boolean(),
  getsTiredQuicklyInfo: z.string().optional(),
  canParticipateSports: z.boolean(),
  canParticipateSportsInfo: z.string().optional(),
  canSwim: z.boolean(),
  canSwimInfo: z.string().optional(),
  otherRemarks: z.string().optional(),
  permissionMedication: z.boolean(),

  // Betalingsinformatie (Vereenvoudigd voor dit voorbeeld)
  paymentOption: z.enum(["KAMP", "WERKJAAR"]),
});

type FormData = z.infer<typeof schema>;

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Hier zou je normaal gesproken de gegevens naar je backend sturen
  };

  const nextStep = () => {
    if (isValid) {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  const addSecondParent = watch("addSecondParent");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl space-y-8"
    >
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Gegevens ouder</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parentFirstName">Voornaam</Label>
              <Input id="parentFirstName" {...register("parentFirstName")} />
              {errors.parentFirstName && (
                <p className="text-red-500">{errors.parentFirstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="parentLastName">Achternaam</Label>
              <Input id="parentLastName" {...register("parentLastName")} />
              {errors.parentLastName && (
                <p className="text-red-500">{errors.parentLastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label>Relatie tot kind</Label>
            <RadioGroup defaultValue="MOTHER">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="MOTHER"
                  id="MOTHER"
                  {...register("parentType")}
                />
                <Label htmlFor="MOTHER">Moeder</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="FATHER"
                  id="FATHER"
                  {...register("parentType")}
                />
                <Label htmlFor="FATHER">Vader</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="GUARDIAN"
                  id="GUARDIAN"
                  {...register("parentType")}
                />
                <Label htmlFor="GUARDIAN">Voogd</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="parentPhone">Telefoonnummer</Label>
            <Input id="parentPhone" {...register("parentPhone")} />
            {errors.parentPhone && (
              <p className="text-red-500">{errors.parentPhone.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="parentEmail">E-mailadres</Label>
            <Input id="parentEmail" type="email" {...register("parentEmail")} />
            {errors.parentEmail && (
              <p className="text-red-500">{errors.parentEmail.message}</p>
            )}
          </div>
          <h3 className="mt-6 text-xl font-bold">Adres</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Straat</Label>
              <Input id="street" {...register("street")} />
              {errors.street && (
                <p className="text-red-500">{errors.street.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="houseNumber">Huisnummer</Label>
              <Input id="houseNumber" {...register("houseNumber")} />
              {errors.houseNumber && (
                <p className="text-red-500">{errors.houseNumber.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="box">Bus (Optioneel)</Label>
            <Input id="box" {...register("box")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="municipality">Gemeente</Label>
              <Input id="municipality" {...register("municipality")} />
              {errors.municipality && (
                <p className="text-red-500">{errors.municipality.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postalCode">Postcode</Label>
              <Input id="postalCode" {...register("postalCode")} />
              {errors.postalCode && (
                <p className="text-red-500">{errors.postalCode.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="addSecondParent" {...register("addSecondParent")} />
            <Label htmlFor="addSecondParent">
              Wenst u gegevens van een tweede ouder toe te voegen?
            </Label>
          </div>
          <Button type="button" onClick={nextStep}>
            Volgende
          </Button>
        </div>
      )}

      {step === 2 && addSecondParent && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Gegevens ouder 2</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partnerFirstName">Voornaam</Label>
              <Input id="partnerFirstName" {...register("partnerFirstName")} />
              {errors.partnerFirstName && (
                <p className="text-red-500">
                  {errors.partnerFirstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="partnerLastName">Achternaam</Label>
              <Input id="partnerLastName" {...register("partnerLastName")} />
              {errors.partnerLastName && (
                <p className="text-red-500">{errors.partnerLastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label>Relatie tot kind</Label>
            <RadioGroup defaultValue="MOTHER">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="MOTHER"
                  id="PARTNER_MOTHER"
                  {...register("partnerType")}
                />
                <Label htmlFor="PARTNER_MOTHER">Moeder</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="FATHER"
                  id="PARTNER_FATHER"
                  {...register("partnerType")}
                />
                <Label htmlFor="PARTNER_FATHER">Vader</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="GUARDIAN"
                  id="PARTNER_GUARDIAN"
                  {...register("partnerType")}
                />
                <Label htmlFor="PARTNER_GUARDIAN">Voogd</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="partnerPhone">Telefoonnummer</Label>
            <Input id="partnerPhone" {...register("partnerPhone")} />
            {errors.partnerPhone && (
              <p className="text-red-500">{errors.partnerPhone.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="partnerEmail">E-mailadres</Label>
            <Input
              id="partnerEmail"
              type="email"
              {...register("partnerEmail")}
            />
            {errors.partnerEmail && (
              <p className="text-red-500">{errors.partnerEmail.message}</p>
            )}
          </div>
          <div className="flex justify-between">
            <Button type="button" onClick={prevStep}>
              Vorige
            </Button>
            <Button type="button" onClick={nextStep}>
              Volgende
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Gegevens kind</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="childFirstName">Voornaam</Label>
              <Input id="childFirstName" {...register("childFirstName")} />
              {errors.childFirstName && (
                <p className="text-red-500">{errors.childFirstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="childLastName">Achternaam</Label>
              <Input id="childLastName" {...register("childLastName")} />
              {errors.childLastName && (
                <p className="text-red-500">{errors.childLastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label>Geslacht</Label>
            <RadioGroup defaultValue="M">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="M" {...register("childGender")} />
                <Label htmlFor="M">Jongen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="F" id="F" {...register("childGender")} />
                <Label htmlFor="F">Meisje</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id="X" {...register("childGender")} />
                <Label htmlFor="X">X</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="childDateOfBirth">Geboortedatum</Label>
            <Input
              id="childDateOfBirth"
              type="date"
              {...register("childDateOfBirth")}
            />
            {errors.childDateOfBirth && (
              <p className="text-red-500">{errors.childDateOfBirth.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="permissionPhotos" {...register("permissionPhotos")} />
            <Label htmlFor="permissionPhotos">
              Toestemming voor het gebruik van foto&apos;s
            </Label>
          </div>
          <div className="flex justify-between">
            <Button type="button" onClick={prevStep}>
              Vorige
            </Button>
            <Button type="button" onClick={nextStep}>
              Volgende
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Medische Informatie</h2>
          <div>
            <Label htmlFor="generalPractitionerFirstName">
              Voornaam huisdokter
            </Label>
            <Input
              id="generalPractitionerFirstName"
              {...register("generalPractitionerFirstName")}
            />
            {errors.childFirstName && (
              <p className="text-red-500">{errors.childFirstName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="generalPractitionerLastName">
              Achternaam huisdokter
            </Label>
            <Input
              id="generalPractitionerLastName"
              {...register("generalPractitionerLastName")}
            />
            {errors.childLastName && (
              <p className="text-red-500">{errors.childLastName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="generalPractitionerPhone">
              Telefoonnummer Huisarts
            </Label>
            <Input
              id="generalPractitionerPhone"
              {...register("generalPractitionerPhone")}
            />
            {errors.generalPractitionerPhone && (
              <p className="text-red-500">
                {errors.generalPractitionerPhone.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="pastMedicalHistory">
              Medische Voorgeschiedenis
            </Label>
            <Textarea
              id="pastMedicalHistory"
              {...register("pastMedicalHistory")}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tetanusVaccination"
              {...register("tetanusVaccination")}
            />
            <Label htmlFor="tetanusVaccination">Tetanusvaccinatie</Label>
          </div>
          {watch("tetanusVaccination") && (
            <div>
              <Label htmlFor="tetanusVaccinationYear">
                Jaar van Tetanusvaccinatie
              </Label>
              <Input
                type="number"
                id="tetanusVaccinationYear"
                {...register("tetanusVaccinationYear")}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="asthma" {...register("asthma")} />
            <Label htmlFor="asthma">Astma</Label>
          </div>
          {watch("asthma") && (
            <div>
              <Label htmlFor="asthmaInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea id="asthmaInfo" {...register("asthmaInfo")} />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="bedwetting" {...register("bedwetting")} />
            <Label htmlFor="bedwetting">Bedplassen</Label>
          </div>
          {watch("bedwetting") && (
            <div>
              <Label htmlFor="bedwettingInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea id="bedwettingInfo" {...register("bedwettingInfo")} />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="epilepsy" {...register("epilepsy")} />
            <Label htmlFor="epilepsy">Epilepsie</Label>
          </div>
          {watch("epilepsy") && (
            <div>
              <Label htmlFor="epilepsyInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea id="epilepsyInfo" {...register("epilepsyInfo")} />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="heartCondition" {...register("heartCondition")} />
            <Label htmlFor="heartCondition">Hartaandoening</Label>
          </div>
          {watch("heartCondition") && (
            <div>
              <Label htmlFor="heartConditionInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea
                id="heartConditionInfo"
                {...register("heartConditionInfo")}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="hayFever" {...register("hayFever")} />
            <Label htmlFor="hayFever">Hooikoorts</Label>
          </div>
          {watch("hayFever") && (
            <div>
              <Label htmlFor="hayFeverInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea id="hayFeverInfo" {...register("hayFeverInfo")} />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="skinCondition" {...register("skinCondition")} />
            <Label htmlFor="skinCondition">Huidaandoening</Label>
          </div>
          {watch("skinCondition") && (
            <div>
              <Label htmlFor="skinConditionInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea
                id="skinConditionInfo"
                {...register("skinConditionInfo")}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="rheumatism" {...register("rheumatism")} />
            <Label htmlFor="rheumatism">Reuma</Label>
          </div>
          {watch("rheumatism") && (
            <div>
              <Label htmlFor="rheumatismInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea id="rheumatismInfo" {...register("rheumatismInfo")} />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="sleepwalking" {...register("sleepwalking")} />
            <Label htmlFor="sleepwalking">Slaapwandelen</Label>
          </div>
          {watch("sleepwalking") && (
            <div>
              <Label htmlFor="sleepwalkingInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea
                id="sleepwalkingInfo"
                {...register("sleepwalkingInfo")}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="diabetes" {...register("diabetes")} />
            <Label htmlFor="diabetes">Diabetes</Label>
          </div>
          {watch("diabetes") && (
            <div>
              <Label htmlFor="diabetesInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea id="diabetesInfo" {...register("diabetesInfo")} />
            </div>
          )}
          <div>
            <Label htmlFor="foodAllergies">Voedselallergieën</Label>
            <Input id="foodAllergies" {...register("foodAllergies")} />
          </div>
          <div>
            <Label htmlFor="substanceAllergies">Stofallergieën</Label>
            <Input
              id="substanceAllergies"
              {...register("substanceAllergies")}
            />
          </div>
          <div>
            <Label htmlFor="medicationAllergies">Medicatieallergieën</Label>
            <Input
              id="medicationAllergies"
              {...register("medicationAllergies")}
            />
          </div>
          <div>
            <Label htmlFor="medicationDuringStay">Medicatie</Label>
            <Input
              id="medicationDuringStay"
              {...register("medicationDuringStay")}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="getsTiredQuickly" {...register("getsTiredQuickly")} />
            <Label htmlFor="getsTiredQuickly">Is snel vermoeid</Label>
          </div>
          {watch("getsTiredQuickly") && (
            <div>
              <Label htmlFor="getsTiredQuicklyInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea
                id="getsTiredQuicklyInfo"
                {...register("getsTiredQuicklyInfo")}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="canParticipateSports"
              {...register("canParticipateSports")}
            />
            <Label htmlFor="canParticipateSports">
              Kan deelnemen aan sportactiviteiten
            </Label>
          </div>
          {watch("canParticipateSports") && (
            <div>
              <Label htmlFor="canParticipateSportsInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea
                id="canParticipateSportsInfo"
                {...register("canParticipateSportsInfo")}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="canSwim" {...register("canSwim")} />
            <Label htmlFor="canSwim">Kan zwemmen</Label>
          </div>
          {watch("canSwim") && (
            <div>
              <Label htmlFor="canSwimInfo">
                Extra informatie die we hierover moeten weten
              </Label>
              <Textarea id="canSwimInfo" {...register("canSwimInfo")} />
            </div>
          )}
          <div>
            <Label htmlFor="otherRemarks">Overige opmerkingen</Label>
            <Textarea id="otherRemarks" {...register("otherRemarks")} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="permissionMedication"
              {...register("permissionMedication")}
            />
            <Label htmlFor="permissionMedication">
              Toestemming voor toedienen van medicatie
            </Label>
          </div>
          <div className="flex justify-between">
            <Button type="button" onClick={prevStep}>
              Vorige
            </Button>
            <Button type="button" onClick={nextStep}>
              Volgende
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
