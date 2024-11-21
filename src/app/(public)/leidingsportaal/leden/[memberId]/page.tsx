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
  Info,
  Activity,
} from "lucide-react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { isLeiding } from "~/lib/auth";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import {
  getCurrentYearlyMembership,
  getMemberById,
} from "~/app/services/members";

function formatDate(date: Date) {
  return Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatPhoneNumber(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/[^0-9+]/g, "");

  const startsWithPlus = cleaned.startsWith("+");
  if (startsWithPlus) {
    console.log("starts with plus");
    console.log(cleaned);

    if (cleaned.length === 12) {
      // format to format +32 123 45 67 89
      return cleaned.replace(
        /(\d{2})(\d{3})(\d{2})(\d{2})(\d{2})/,
        "$1 $2 $3 $4 $5",
      );
    } else if (cleaned.length === 11) {
      // format to format +32 12 34 56 78
      return cleaned.replace(
        /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
        "$1 $2 $3 $4 $5",
      );
    }
  }

  if (cleaned.length === 10) {
    // format to format 0495 12 34 56
    return cleaned.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  } else if (cleaned.length === 9) {
    // format to format 012 34 56 78
    return cleaned.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }

  return phoneNumber;
}

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

export default async function MemberDetailPage({
  params,
}: {
  params: { memberId: string };
}) {
  if (!params.memberId || isNaN(parseInt(params.memberId))) {
    return "Geen lid gevonden.";
  }

  const member = await getMemberById(parseInt(params.memberId));

  if (!member) {
    return "Geen lid gevonden.";
  }

  const currentYearlyMembership = getCurrentYearlyMembership(member);

  if (!currentYearlyMembership) {
    return "Dit lid is niet ingeschreven voor het huidige werkjaar.";
  }

  return (
    <div className="container relative flex flex-col gap-6">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <PageHeader>
          <PageHeaderHeading>
            {member.firstName} {member.lastName}
          </PageHeaderHeading>
          <PageHeaderDescription>
            Inschrijving van {member.firstName} {member.lastName} voor het
            werkjaar 2024-2025
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
                    <p>{currentYearlyMembership.group.name}</p>
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
                      <p className="font-semibold">Telefoonnummer lid zelf:</p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {formatPhoneNumber(member.phoneNumber)}
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
                  {member.parents.map((parent) => (
                    <div
                      key={parent.id}
                      className="border-t pt-4 first:border-t-0 first:pt-0"
                    >
                      <h3 className="mb-2 font-semibold">
                        {parent.relationship === "MOTHER"
                          ? "Mama"
                          : parent.relationship === "FATHER"
                            ? "Papa"
                            : parent.relationship === "PLUSMOTHER"
                              ? "Plusmama"
                              : parent.relationship === "PLUSFATHER"
                                ? "Pluspapa"
                                : "Voogd"}
                        : {parent.firstName} {parent.lastName}
                      </h3>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <p className="flex items-center gap-2 font-semibold">
                          <Phone className="h-4 w-4 text-gray-500" />
                          {formatPhoneNumber(parent.phoneNumber)}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {parent.emailAddress}
                        </p>
                        <p className="col-span-full flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {parent.address.street} {parent.address.houseNumber}
                          {parent.address.box &&
                            `, bus ${parent.address.box}`},{" "}
                          {parent.address.postalCode}{" "}
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
                  {member.emergencyContact ? (
                    <>
                      <p>
                        {member.emergencyContact.firstName}{" "}
                        {member.emergencyContact.lastName}
                        {member.emergencyContact.relationship &&
                          ` (${member.emergencyContact.relationship.toLowerCase()})`}
                      </p>
                      <p className="flex items-center gap-2 font-semibold">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {formatPhoneNumber(member.emergencyContact.phoneNumber)}
                      </p>
                    </>
                  ) : (
                    "Geen noodcontact bekend."
                  )}
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
                  {member.medicalInformation ? (
                    <>
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="font-semibold">
                            Medische voorgeschiedenis:
                          </p>
                          <p>
                            {member.medicalInformation.pastMedicalHistory ??
                              "Geen voorgeschiedenis"}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <p className="font-semibold">
                            Toestemming toedienen medicatie:
                          </p>
                          <p>
                            {member.medicalInformation.permissionMedication ? (
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
                            {member.medicalInformation.tetanusVaccination ? (
                              <span className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                {member.medicalInformation
                                  .tetanusVaccinationYear ? (
                                  <span>
                                    in het jaar{" "}
                                    {
                                      member.medicalInformation
                                        .tetanusVaccinationYear
                                    }
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
                            {!member.medicalInformation.getsTiredQuickly ? (
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
                            {member.medicalInformation.canParticipateSports ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <p className="font-semibold">Kan zwemmen:</p>
                          <p>
                            {member.medicalInformation.canSwim ? (
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
                                hasCondition: member.medicalInformation.asthma,
                                info: member.medicalInformation
                                  .asthmaInformation,
                              },
                              {
                                name: "Bedplassen",
                                hasCondition:
                                  member.medicalInformation.bedwetting,
                                info: member.medicalInformation
                                  .bedwettingInformation,
                              },
                              {
                                name: "Epilepsie",
                                hasCondition:
                                  member.medicalInformation.epilepsy,
                                info: member.medicalInformation
                                  .epilepsyInformation,
                              },
                              {
                                name: "Hartaandoening",
                                hasCondition:
                                  member.medicalInformation.heartCondition,
                                info: member.medicalInformation
                                  .heartConditionInformation,
                              },
                              {
                                name: "Hooikoorts",
                                hasCondition:
                                  member.medicalInformation.hayFever,
                                info: member.medicalInformation
                                  .hayFeverInformation,
                              },
                              {
                                name: "Huidaandoening",
                                hasCondition:
                                  member.medicalInformation.skinCondition,
                                info: member.medicalInformation
                                  .skinConditionInformation,
                              },
                              {
                                name: "Reuma",
                                hasCondition:
                                  member.medicalInformation.rheumatism,
                                info: member.medicalInformation
                                  .rheumatismInformation,
                              },
                              {
                                name: "Slaapwandelen",
                                hasCondition:
                                  member.medicalInformation.sleepwalking,
                                info: member.medicalInformation
                                  .sleepwalkingInformation,
                              },
                              {
                                name: "Diabetes",
                                hasCondition:
                                  member.medicalInformation.diabetes,
                                info: member.medicalInformation
                                  .diabetesInformation,
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
                                  member.medicalInformation.foodAllergies !==
                                  null,
                                info: member.medicalInformation.foodAllergies,
                              },
                              {
                                name: "Stofallergieën",
                                hasCondition:
                                  member.medicalInformation
                                    .substanceAllergies !== null,
                                info: member.medicalInformation
                                  .substanceAllergies,
                              },
                              {
                                name: "Medicatieallergieën",
                                hasCondition:
                                  member.medicalInformation
                                    .medicationAllergies !== null,
                                info: member.medicalInformation
                                  .medicationAllergies,
                              },
                            ]}
                            type="allergies"
                          />
                        </div>
                        {/* Medicatie */}
                        <div>
                          <p className="font-semibold">Medicatie:</p>
                          <p>
                            {member.medicalInformation.medication ??
                              "Geen medicatie nodig."}
                          </p>
                        </div>
                        {/* Andere opmerkingen */}
                        <div>
                          <p className="font-semibold">Andere opmerkingen:</p>
                          <p>
                            {member.medicalInformation.otherRemarks ??
                              "Geen opmerkingen."}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>Geen medische fiche bekend.</p>
                  )}
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
                  {member.medicalInformation ? (
                    <>
                      <p>
                        {member.medicalInformation.doctorFirstName}{" "}
                        {member.medicalInformation.doctorLastName}
                      </p>
                      <p className="flex items-center gap-2 font-semibold">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {formatPhoneNumber(
                          member.medicalInformation.doctorPhoneNumber,
                        )}
                      </p>
                    </>
                  ) : (
                    "Geen huisarts bekend."
                  )}
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
                    {currentYearlyMembership.paymentReceived ? (
                      <Check className="ml-2 inline h-5 w-5 text-green-500" />
                    ) : (
                      <X className="ml-2 inline h-5 w-5 text-red-500" />
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">Betaalmethode:</span>{" "}
                    {currentYearlyMembership.paymentMethod === "CASH"
                      ? "Cash"
                      : currentYearlyMembership.paymentMethod ===
                          "BANK_TRANSFER"
                        ? "Overschrijving"
                        : currentYearlyMembership.paymentMethod === "PAYCONIQ"
                          ? "Payconiq"
                          : currentYearlyMembership.paymentMethod === "OTHER"
                            ? "Andere"
                            : "Nog niet betaald"}
                  </p>
                  {currentYearlyMembership.paymentDate && (
                    <p>
                      <span className="font-semibold">Datum betaling:</span>{" "}
                      {formatDate(currentYearlyMembership.paymentDate)}
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
}
