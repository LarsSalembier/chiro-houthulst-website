import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  Users,
  CreditCard,
  Check,
  X,
  Syringe,
  AlertTriangle,
  Info,
  Activity,
  Droplet,
} from "lucide-react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { isLeiding } from "~/lib/auth";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { getMemberUseCase } from "~/application/use-cases/members/get-member";

// Function to format date to DD-MM-YYYY
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const MedicalConditionsList = ({
  conditions,
  type,
}: {
  conditions: {
    name: string;
    hasCondition: boolean;
    info: string | null;
  }[];
  type: string;
}) => {
  if (type === "allergies") {
    const hasAllergies = conditions.some(
      (condition) => condition.hasCondition === true,
    );

    if (!hasAllergies) {
      return <p>Geen bekende allergieën.</p>;
    }

    return (
      <ul className="list-inside list-disc">
        {conditions
          .filter((condition) => condition.hasCondition)
          .map((condition) => (
            <li key={condition.name}>
              {condition.name.charAt(0).toUpperCase() + condition.name.slice(1)}
              {condition.info ? (
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-gray-500" />
                  {condition.info}
                </span>
              ) : null}
            </li>
          ))}
      </ul>
    );
  } else {
    const relevantConditions = conditions.filter(
      (condition) => condition.hasCondition,
    );

    if (relevantConditions.length === 0) {
      return <p>Geen bekende aandoeningen.</p>;
    }

    return (
      <ul className="list-inside list-disc">
        {conditions
          .filter((condition) => condition.hasCondition)
          .map((condition) => (
            <li key={condition.name}>
              {condition.name.charAt(0).toUpperCase() + condition.name.slice(1)}
              {condition.info ? (
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-gray-500" />
                  {condition.info}
                </span>
              ) : null}
            </li>
          ))}
      </ul>
    );
  }
};

export default async function LidDetail({
  params,
}: {
  params: { memberId: string };
}) {
  if (!params.memberId || isNaN(parseInt(params.memberId))) {
    return "Geen lid gevonden.";
  }

  try {
    const {
      member,
      parentsWithAddresses,
      emergencyContact,
      medicalInformation,
      yearlyMembership,
      group,
    } = await getMemberUseCase(parseInt(params.memberId));

    return (
      <div className="container relative flex flex-col gap-6">
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <SignedIn>
          <PageHeader>
            <PageHeaderHeading>
              {member.name.firstName} {member.name.lastName}
            </PageHeaderHeading>
            <PageHeaderDescription>
              Inschrijving van {member.name.firstName} {member.name.lastName}{" "}
              voor het werkjaar 2024-2025
            </PageHeaderDescription>
          </PageHeader>
          <div className="pb-8 md:pb-12 lg:pb-12">
            {isLeiding() ? (
              <div className="flex flex-col gap-6">
                {/* Algemene Gegevens */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-blue-500" />
                      Algemeen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-semibold">Afdeling:</p>
                      <p>{group.name}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Geslacht:</p>
                      <p>
                        {member.gender === "M"
                          ? "Man"
                          : member.gender === "F"
                            ? "Vrouw"
                            : "X"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Geboortedatum:</p>
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        {formatDate(member.dateOfBirth)}
                      </p>
                    </div>
                    {member.emailAddress && (
                      <div>
                        <p className="font-semibold">E-mail:</p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {member.emailAddress}
                        </p>
                      </div>
                    )}
                    {member.phoneNumber && (
                      <div>
                        <p className="font-semibold">
                          Telefoonnummer lid zelf:
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          {member.phoneNumber}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">Toestemming foto&apos;s:</p>
                      <p>
                        {member.gdprPermissionToPublishPhotos ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Ouders / Voogden */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-green-500" />
                      Ouders
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {parentsWithAddresses.map((parent) => (
                      <div
                        key={parent.parent.id}
                        className="border-t pt-4 first:border-t-0 first:pt-0"
                      >
                        <h3 className="mb-2 font-semibold">
                          {parent.parent.relationship === "MOTHER"
                            ? "Mama"
                            : parent.parent.relationship === "FATHER"
                              ? "Papa"
                              : parent.parent.relationship === "PLUSMOTHER"
                                ? "Plusmama"
                                : parent.parent.relationship === "PLUSFATHER"
                                  ? "Pluspapa"
                                  : "Voogd"}
                          : {parent.parent.name.firstName}{" "}
                          {parent.parent.name.lastName}
                        </h3>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <p className="flex items-center gap-2 font-semibold">
                            <Phone className="h-4 w-4 text-gray-500" />
                            {parent.parent.phoneNumber}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            {parent.parent.emailAddress}
                          </p>
                          <p className="col-span-full flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            {parent.address.street} {parent.address.houseNumber}
                            {parent.address.box &&
                              `, bus ${parent.address.box}`}
                            , {parent.address.postalCode}{" "}
                            {parent.address.municipality}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Noodcontact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-6 w-6 text-red-500" />
                      Noodcontact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {emergencyContact.name.firstName}{" "}
                      {emergencyContact.name.lastName}
                      {emergencyContact.relationship &&
                        ` (${emergencyContact.relationship.toLowerCase()})`}
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {emergencyContact.phoneNumber}
                    </p>
                  </CardContent>
                </Card>

                {/* Medische Fiche */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-6 w-6 text-orange-500" />
                      Medische Fiche
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="font-semibold">
                          Medische voorgeschiedenis:
                        </p>
                        <p>
                          {medicalInformation.pastMedicalHistory ??
                            "Geen voorgeschiedenis"}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <p className="font-semibold">
                          Toestemming toedienen medicatie:
                        </p>
                        <p>
                          {medicalInformation.permissionMedication ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <span className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-500" /> Nee
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <p className="font-semibold">Tetanusvaccinatie:</p>
                        <p>
                          {medicalInformation.tetanusVaccination ? (
                            <span className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              {medicalInformation.tetanusVaccinationYear ? (
                                <span>
                                  in het jaar{" "}
                                  {medicalInformation.tetanusVaccinationYear}
                                </span>
                              ) : null}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-500" /> Nee
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <p className="font-semibold">
                          Is niet abnormaal snel moe:
                        </p>
                        <p>
                          {!medicalInformation.getsTiredQuickly ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <p className="font-semibold">
                          Kan deelnemen aan sport en spel voor zijn/haar
                          leeftijd:
                        </p>
                        <p className="flex gap-4">
                          {medicalInformation.canParticipateSports ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <p className="font-semibold">Kan zwemmen:</p>
                        <p>
                          {medicalInformation.canSwim ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        {/* Aandoeningen */}
                        <p className="font-semibold">Aandoeningen:</p>
                        <MedicalConditionsList
                          conditions={[
                            {
                              name: "Astma",
                              hasCondition:
                                medicalInformation.asthma.hasCondition,
                              info: medicalInformation.asthma.info,
                            },
                            {
                              name: "Bedplassen",
                              hasCondition:
                                medicalInformation.bedwetting.hasCondition,
                              info: medicalInformation.bedwetting.info,
                            },
                            {
                              name: "Epilepsie",
                              hasCondition:
                                medicalInformation.epilepsy.hasCondition,
                              info: medicalInformation.epilepsy.info,
                            },
                            {
                              name: "Hartaandoening",
                              hasCondition:
                                medicalInformation.heartCondition.hasCondition,
                              info: medicalInformation.heartCondition.info,
                            },
                            {
                              name: "Hooikoorts",
                              hasCondition:
                                medicalInformation.hayFever.hasCondition,
                              info: medicalInformation.hayFever.info,
                            },
                            {
                              name: "Huidaandoening",
                              hasCondition:
                                medicalInformation.skinCondition.hasCondition,
                              info: medicalInformation.skinCondition.info,
                            },
                            {
                              name: "Reuma",
                              hasCondition:
                                medicalInformation.rheumatism.hasCondition,
                              info: medicalInformation.rheumatism.info,
                            },
                            {
                              name: "Slaapwandelen",
                              hasCondition:
                                medicalInformation.sleepwalking.hasCondition,
                              info: medicalInformation.sleepwalking.info,
                            },
                            {
                              name: "Diabetes",
                              hasCondition:
                                medicalInformation.diabetes.hasCondition,
                              info: medicalInformation.diabetes.info,
                            },
                          ]}
                          type="conditions"
                        />
                      </div>
                      <div>
                        {/* Allergieën */}
                        <p className="font-semibold">Allergieën:</p>
                        <MedicalConditionsList
                          conditions={[
                            {
                              name: "Voedselallergieën",
                              hasCondition:
                                medicalInformation.foodAllergies !== null,
                              info: medicalInformation.foodAllergies,
                            },
                            {
                              name: "Stofallergieën",
                              hasCondition:
                                medicalInformation.substanceAllergies !== null,
                              info: medicalInformation.substanceAllergies,
                            },
                            {
                              name: "Medicatieallergieën",
                              hasCondition:
                                medicalInformation.medicationAllergies !== null,
                              info: medicalInformation.medicationAllergies,
                            },
                          ]}
                          type="allergies"
                        />
                      </div>
                      {/* Medicatie */}
                      <div>
                        <p className="font-semibold">Medicatie:</p>
                        <p>
                          {medicalInformation.medication ??
                            "Geen medicatie nodig."}
                        </p>
                      </div>
                      {/* Andere opmerkingen */}
                      <div>
                        <p className="font-semibold">Andere opmerkingen:</p>
                        <p>
                          {medicalInformation.otherRemarks ??
                            "Geen opmerkingen."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Huisarts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Syringe className="h-6 w-6 text-pink-500" />
                      Huisarts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {medicalInformation.doctor.name.firstName}{" "}
                      {medicalInformation.doctor.name.lastName}
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {medicalInformation.doctor.phoneNumber}
                    </p>
                  </CardContent>
                </Card>

                {/* Inschrijving */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-6 w-6 text-indigo-500" />
                      Inschrijving
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>
                      <span className="font-semibold">Betaling ontvangen:</span>
                      {yearlyMembership.paymentReceived ? (
                        <Check className="ml-2 inline h-5 w-5 text-green-500" />
                      ) : (
                        <X className="ml-2 inline h-5 w-5 text-red-500" />
                      )}
                    </p>
                    <p>
                      <span className="font-semibold">Betaalmethode:</span>{" "}
                      {yearlyMembership.paymentMethod === "CASH"
                        ? "Cash"
                        : yearlyMembership.paymentMethod === "BANK_TRANSFER"
                          ? "Overschrijving"
                          : yearlyMembership.paymentMethod === "PAYCONIQ"
                            ? "Payconiq"
                            : yearlyMembership.paymentMethod === "OTHER"
                              ? "Andere"
                              : "Nog niet betaald"}
                    </p>
                    {yearlyMembership.paymentDate && (
                      <p>
                        <span className="font-semibold">Datum betaling:</span>{" "}
                        {formatDate(yearlyMembership.paymentDate)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              "Je hebt geen toegang tot deze pagina."
            )}
          </div>
        </SignedIn>
      </div>
    );
  } catch (error) {
    return "Er is een fout opgetreden bij het ophalen van de gegevens.";
  }
}
