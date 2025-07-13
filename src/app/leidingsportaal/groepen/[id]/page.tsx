import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import {
  Users,
  Calendar,
  UserCheck,
  Heart,
  Activity,
  Shield,
  Baby,
  Clock,
  ShieldCheck,
  FileText,
  UserPlus,
  GraduationCap,
  Target,
  Users2,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import SignInAsLeiding from "../../sign-in-as-leiding";
import { GROUP_QUERIES } from "~/server/db/queries/group-queries";
import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import { MEMBER_QUERIES } from "~/server/db/queries/member-queries";
import { notFound } from "next/navigation";
import MembersTable from "~/features/leidingsportaal/members-table";
import TableLink from "~/components/ui/table-link";
import { requireLeidingAuth } from "~/lib/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GroupDetailPage({ params }: PageProps) {
  // Check if user has leiding role - this will redirect if not authorized
  await requireLeidingAuth();

  const { id } = await params;
  const groupId = parseInt(id);

  if (isNaN(groupId)) {
    notFound();
  }

  const group = await GROUP_QUERIES.getById(groupId);

  if (!group?.active) {
    notFound();
  }

  const workYear = await WORK_YEAR_QUERIES.getByDate();

  if (!workYear) {
    return (
      <BlogTextNoAnimation>
        <div className="py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Geen actief werkjaar</h1>
          <p className="text-gray-600">
            Er is momenteel geen actief werkjaar gevonden.
          </p>
        </div>
      </BlogTextNoAnimation>
    );
  }

  const members = await MEMBER_QUERIES.getMembersForWorkYear(
    workYear.id,
    groupId,
  );

  // Calculate ages in years (rounded)
  const minAge = Math.round(group.minimumAgeInDays / 365.25);
  const maxAge = group.maximumAgeInDays
    ? Math.round(group.maximumAgeInDays / 365.25)
    : null;

  // Special case for Aspis - show infinity instead of calculated max age
  const displayMaxAge = group.name.toLowerCase() === "aspis" ? null : maxAge;

  // Get gender display text
  const genderText =
    group.gender === "M" ? "Jongens" : group.gender === "F" ? "Meisjes" : null;

  // Calculate group statistics
  const totalMembers = members.length;
  const boysCount = members.filter((m) => m.gender === "M").length;
  const girlsCount = members.filter((m) => m.gender === "F").length;
  const otherGenderCount = members.filter((m) => m.gender === "X").length;

  // Calculate camp statistics
  const campSubscriptions = members.filter(
    (m) => m.yearlyMembership?.campSubscription,
  ).length;
  const campPaymentReceived = members.filter(
    (m) => m.yearlyMembership?.campPaymentReceived,
  ).length;
  const campPaymentPending = campSubscriptions - campPaymentReceived;

  const averageAge =
    totalMembers > 0
      ? Math.round(
          members.reduce((sum, m) => {
            const age = Math.floor(
              (Date.now() - m.dateOfBirth.getTime()) /
                (1000 * 60 * 60 * 24 * 365.25),
            );
            return sum + age;
          }, 0) / totalMembers,
        )
      : 0;

  // Prepare member data for the table
  const memberTabularData = members.map((member) => ({
    ...member,
    name: `${member.firstName} ${member.lastName}`,
    group: member.yearlyMembership?.group ?? null,
    parentNames: Array.from(
      new Set(
        member.parents.map(
          (parent) => `${parent.firstName} ${parent.lastName}`,
        ),
      ),
    ).join(", "),
    parentPhoneNumbers: Array.from(
      new Set(member.parents.map((parent) => parent.phoneNumber)),
    ).join(", "),
    parentEmailAddresses: Array.from(
      new Set(member.parents.map((parent) => parent.emailAddress)),
    ).join(", "),
    emergencyContactName: member.emergencyContact
      ? `${member.emergencyContact.firstName} ${member.emergencyContact.lastName}`
      : "",
    emergencyContactPhoneNumber: member.emergencyContact?.phoneNumber ?? "",
    doctorName: `${member.medicalInformation?.doctorFirstName ?? ""} ${member.medicalInformation?.doctorLastName ?? ""}`,
    doctorPhoneNumber: member.medicalInformation?.doctorPhoneNumber ?? "",
    tetanusVaccination: member.medicalInformation?.tetanusVaccination ?? false,
    asthma: member.medicalInformation?.asthma ?? false,
    bedwetting: member.medicalInformation?.bedwetting ?? false,
    epilepsy: member.medicalInformation?.epilepsy ?? false,
    heartCondition: member.medicalInformation?.heartCondition ?? false,
    hayFever: member.medicalInformation?.hayFever ?? false,
    skinCondition: member.medicalInformation?.skinCondition ?? false,
    rheumatism: member.medicalInformation?.rheumatism ?? false,
    sleepwalking: member.medicalInformation?.sleepwalking ?? false,
    diabetes: member.medicalInformation?.diabetes ?? false,
    foodAllergies: member.medicalInformation?.foodAllergies ?? "",
    substanceAllergies: member.medicalInformation?.substanceAllergies ?? "",
    medicationAllergies: member.medicalInformation?.medicationAllergies ?? "",
    medication: member.medicalInformation?.medication ?? "",
    otherMedicalConditions:
      member.medicalInformation?.otherMedicalConditions ?? "",
    getsTiredQuickly: member.medicalInformation?.getsTiredQuickly ?? false,
    canParticipateSports:
      member.medicalInformation?.canParticipateSports ?? true,
    canSwim: member.medicalInformation?.canSwim ?? false,
    otherRemarks: member.medicalInformation?.otherRemarks ?? "",
    permissionMedication:
      member.medicalInformation?.permissionMedication ?? false,
    emailAddress: member.emailAddress ?? "",
    phoneNumber: member.phoneNumber ?? "",
    paymentReceived: member.yearlyMembership?.paymentReceived ?? false,
    paymentMethod: member.yearlyMembership?.paymentMethod ?? "",
    paymentDate: member.yearlyMembership?.paymentDate ?? undefined,
  }));

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { href: "/leidingsportaal/groepen", label: "Groepen" },
    { label: group.name },
  ];

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <BlogTextNoAnimation>
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: group.color ? `${group.color}20` : "#3b82f620",
              }}
            >
              <Users
                className="h-16 w-16"
                style={{
                  color: group.color ?? "#3b82f6",
                }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1
                className="!mb-0 !mt-0 !pb-0 !pt-0 text-4xl font-bold leading-tight"
                style={{ margin: 0, padding: 0 }}
              >
                {group.name}
              </h1>
              <p
                className="!mb-0 mt-1 !pb-0 text-base text-gray-600"
                style={{ marginBottom: 0, paddingBottom: 0 }}
              >
                {minAge} - {displayMaxAge ?? "∞"} jaar
                {genderText && ` • ${genderText}`}
              </p>
            </div>
          </div>

          {group.description && (
            <p className="mb-6 text-lg text-gray-700">{group.description}</p>
          )}
        </div>

        <div className="mb-8 flex gap-4">
          <SignedOut>
            <SignInAsLeiding />
          </SignedOut>
        </div>
      </BlogTextNoAnimation>

      <SignedIn>
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Group Statistics Overview */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: group.color
                        ? `${group.color}20`
                        : "#3b82f620",
                    }}
                  >
                    <Users
                      className="h-8 w-8"
                      style={{ color: group.color ?? "#3b82f6" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Totaal leden</p>
                    <p className="text-2xl font-bold">{totalMembers}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gemiddelde leeftijd</p>
                    <p className="text-2xl font-bold">{averageAge} jaar</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Leeftijdsbereik</p>
                    <p className="text-2xl font-bold">
                      {minAge}-{displayMaxAge ?? "∞"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kamp inschrijvingen</p>
                    <p className="text-2xl font-bold">{campSubscriptions}</p>
                    <p className="text-xs text-gray-500">
                      {campPaymentReceived} betaald, {campPaymentPending}{" "}
                      openstaand
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Group Information */}
            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <FileText className="h-5 w-5" />
                  Groep informatie
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <Target className="h-5 w-5 text-blue-600" />
                      Doelgroep
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Leeftijdsbereik:</strong> {minAge} -{" "}
                        {displayMaxAge ?? "∞"} jaar
                      </p>
                      <p>
                        <strong>Gemiddelde leeftijd:</strong> {averageAge} jaar
                      </p>
                      {genderText && (
                        <p>
                          <strong>Geslacht:</strong> {genderText}
                        </p>
                      )}
                    </div>
                  </div>

                  {group.description && (
                    <>
                      <Divider />
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                          <FileText className="h-5 w-5 text-purple-600" />
                          Beschrijving
                        </h3>
                        <p className="text-sm text-gray-700">
                          {group.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Member Demographics */}
            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Users2 className="h-5 w-5" />
                  Ledendemografie
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <UserPlus className="h-5 w-5 text-blue-600" />
                      Geslachtverdeling
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Jongens:</span>
                        <Badge color="primary" variant="flat">
                          {boysCount}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Meisjes:</span>
                        <Badge color="secondary" variant="flat">
                          {girlsCount}
                        </Badge>
                      </div>
                      {otherGenderCount > 0 && (
                        <div className="flex items-center justify-between">
                          <span>Anders:</span>
                          <Badge color="default" variant="flat">
                            {otherGenderCount}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                      Groepsgrootte
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Huidige grootte:</span>
                        <Badge
                          color={totalMembers > 0 ? "success" : "default"}
                          variant="flat"
                        >
                          {totalMembers} leden
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Capaciteit:</span>
                        <span className="text-sm text-gray-600">Onbeperkt</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Camp Statistics */}
          <Card>
            <CardHeader className="px-6 py-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Calendar className="h-5 w-5 text-orange-600" />
                Kamp statistieken
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="rounded-lg bg-orange-100 p-3">
                      <Calendar className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Totaal ingeschreven</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {campSubscriptions}
                  </p>
                  <p className="text-xs text-gray-500">
                    {totalMembers > 0
                      ? Math.round((campSubscriptions / totalMembers) * 100)
                      : 0}
                    % van de groep
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="rounded-lg bg-green-100 p-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Betaald</p>
                  <p className="text-3xl font-bold text-green-600">
                    {campPaymentReceived}
                  </p>
                  <p className="text-xs text-gray-500">
                    {campSubscriptions > 0
                      ? Math.round(
                          (campPaymentReceived / campSubscriptions) * 100,
                        )
                      : 0}
                    % van inschrijvingen
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="rounded-lg bg-yellow-100 p-3">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Openstaand</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {campPaymentPending}
                  </p>
                  <p className="text-xs text-gray-500">
                    {campSubscriptions > 0
                      ? Math.round(
                          (campPaymentPending / campSubscriptions) * 100,
                        )
                      : 0}
                    % van inschrijvingen
                  </p>
                </div>
              </div>

              {campSubscriptions > 0 && (
                <>
                  <Divider className="my-6" />
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <Users className="h-5 w-5 text-blue-600" />
                      Leden ingeschreven voor kamp
                    </h3>
                    <div className="space-y-2">
                      {members
                        .filter((m) => m.yearlyMembership?.campSubscription)
                        .map((member) => (
                          <div
                            key={member.id}
                            className={`flex items-center justify-between rounded-lg p-3 ${
                              member.yearlyMembership?.campPaymentReceived
                                ? "border border-green-200 bg-green-50"
                                : "border border-yellow-200 bg-yellow-50"
                            }`}
                          >
                            <TableLink
                              href={`/leidingsportaal/leden/${member.id}`}
                            >
                              {member.firstName} {member.lastName}
                            </TableLink>
                            <Badge
                              color={
                                member.yearlyMembership?.campPaymentReceived
                                  ? "success"
                                  : "warning"
                              }
                              variant="flat"
                            >
                              {member.yearlyMembership?.campPaymentReceived
                                ? "Betaald"
                                : "Openstaand"}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {/* Medical and Important Information Breakdown */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Heart className="h-6 w-6 text-red-500" />
              Medische en belangrijke informatie
            </h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Critical Medical Conditions */}
              <Card>
                <CardHeader className="px-6 py-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Kritieke medische aandoeningen
                  </h3>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {(() => {
                      const epilepsyMembers = members.filter(
                        (m) => m.medicalInformation?.epilepsy,
                      );
                      const heartMembers = members.filter(
                        (m) => m.medicalInformation?.heartCondition,
                      );
                      const asthmaMembers = members.filter(
                        (m) => m.medicalInformation?.asthma,
                      );
                      const diabetesMembers = members.filter(
                        (m) => m.medicalInformation?.diabetes,
                      );

                      const hasCriticalConditions =
                        epilepsyMembers.length > 0 ||
                        heartMembers.length > 0 ||
                        asthmaMembers.length > 0 ||
                        diabetesMembers.length > 0;

                      if (!hasCriticalConditions) {
                        return (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span>Geen kritieke medische aandoeningen</span>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          {epilepsyMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-red-700">
                                Epilepsie:
                              </h4>
                              {epilepsyMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                  {member.medicalInformation
                                    ?.epilepsyInformation && (
                                    <p className="mt-1 text-sm text-gray-700">
                                      {
                                        member.medicalInformation
                                          .epilepsyInformation
                                      }
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {heartMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-red-700">
                                Hartaandoening:
                              </h4>
                              {heartMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                  {member.medicalInformation
                                    ?.heartConditionInformation && (
                                    <p className="mt-1 text-sm text-gray-700">
                                      {
                                        member.medicalInformation
                                          .heartConditionInformation
                                      }
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {asthmaMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-red-700">
                                Astma:
                              </h4>
                              {asthmaMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                  {member.medicalInformation
                                    ?.asthmaInformation && (
                                    <p className="mt-1 text-sm text-gray-700">
                                      {
                                        member.medicalInformation
                                          .asthmaInformation
                                      }
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {diabetesMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-red-700">
                                Diabetes:
                              </h4>
                              {diabetesMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                  {member.medicalInformation
                                    ?.diabetesInformation && (
                                    <p className="mt-1 text-sm text-gray-700">
                                      {
                                        member.medicalInformation
                                          .diabetesInformation
                                      }
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Other Medical Conditions */}
                          {(() => {
                            const bedwettingMembers = members.filter(
                              (m) => m.medicalInformation?.bedwetting,
                            );
                            const skinMembers = members.filter(
                              (m) => m.medicalInformation?.skinCondition,
                            );
                            const rheumatismMembers = members.filter(
                              (m) => m.medicalInformation?.rheumatism,
                            );
                            const sleepwalkingMembers = members.filter(
                              (m) => m.medicalInformation?.sleepwalking,
                            );
                            const otherConditionsMembers = members.filter(
                              (m) =>
                                m.medicalInformation?.otherMedicalConditions,
                            );

                            const hasOtherConditions =
                              bedwettingMembers.length > 0 ||
                              skinMembers.length > 0 ||
                              rheumatismMembers.length > 0 ||
                              sleepwalkingMembers.length > 0 ||
                              otherConditionsMembers.length > 0;

                            if (!hasOtherConditions) {
                              return null;
                            }

                            return (
                              <div className="mt-6 space-y-4">
                                <h4 className="font-medium text-red-700">
                                  Andere medische aandoeningen:
                                </h4>

                                {bedwettingMembers.length > 0 && (
                                  <div>
                                    <h5 className="mb-2 text-sm font-medium text-red-600">
                                      Bedwateren:
                                    </h5>
                                    {bedwettingMembers.map((member) => (
                                      <div
                                        key={member.id}
                                        className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                      >
                                        <TableLink
                                          href={`/leidingsportaal/leden/${member.id}`}
                                        >
                                          {member.firstName} {member.lastName}
                                        </TableLink>
                                        {member.medicalInformation
                                          ?.bedwettingInformation && (
                                          <p className="mt-1 text-sm text-gray-700">
                                            {
                                              member.medicalInformation
                                                .bedwettingInformation
                                            }
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {skinMembers.length > 0 && (
                                  <div>
                                    <h5 className="mb-2 text-sm font-medium text-red-600">
                                      Huidaandoening:
                                    </h5>
                                    {skinMembers.map((member) => (
                                      <div
                                        key={member.id}
                                        className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                      >
                                        <TableLink
                                          href={`/leidingsportaal/leden/${member.id}`}
                                        >
                                          {member.firstName} {member.lastName}
                                        </TableLink>
                                        {member.medicalInformation
                                          ?.skinConditionInformation && (
                                          <p className="mt-1 text-sm text-gray-700">
                                            {
                                              member.medicalInformation
                                                .skinConditionInformation
                                            }
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {rheumatismMembers.length > 0 && (
                                  <div>
                                    <h5 className="mb-2 text-sm font-medium text-red-600">
                                      Reuma:
                                    </h5>
                                    {rheumatismMembers.map((member) => (
                                      <div
                                        key={member.id}
                                        className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                      >
                                        <TableLink
                                          href={`/leidingsportaal/leden/${member.id}`}
                                        >
                                          {member.firstName} {member.lastName}
                                        </TableLink>
                                        {member.medicalInformation
                                          ?.rheumatismInformation && (
                                          <p className="mt-1 text-sm text-gray-700">
                                            {
                                              member.medicalInformation
                                                .rheumatismInformation
                                            }
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {sleepwalkingMembers.length > 0 && (
                                  <div>
                                    <h5 className="mb-2 text-sm font-medium text-red-600">
                                      Slaapwandelen:
                                    </h5>
                                    {sleepwalkingMembers.map((member) => (
                                      <div
                                        key={member.id}
                                        className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                      >
                                        <TableLink
                                          href={`/leidingsportaal/leden/${member.id}`}
                                        >
                                          {member.firstName} {member.lastName}
                                        </TableLink>
                                        {member.medicalInformation
                                          ?.sleepwalkingInformation && (
                                          <p className="mt-1 text-sm text-gray-700">
                                            {
                                              member.medicalInformation
                                                .sleepwalkingInformation
                                            }
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {otherConditionsMembers.length > 0 && (
                                  <div>
                                    <h5 className="mb-2 text-sm font-medium text-red-600">
                                      Andere aandoeningen:
                                    </h5>
                                    {otherConditionsMembers.map((member) => (
                                      <div
                                        key={member.id}
                                        className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                      >
                                        <TableLink
                                          href={`/leidingsportaal/leden/${member.id}`}
                                        >
                                          {member.firstName} {member.lastName}
                                        </TableLink>
                                        <p className="mt-1 text-sm text-gray-700">
                                          {
                                            member.medicalInformation
                                              ?.otherMedicalConditions
                                          }
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })()}
                  </div>
                </CardBody>
              </Card>

              {/* Allergies and Sensitivities */}
              <Card>
                <CardHeader className="px-6 py-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-600">
                    <Shield className="h-5 w-5" />
                    Allergieën en overgevoeligheden
                  </h3>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {(() => {
                      const foodAllergyMembers = members.filter(
                        (m) => m.medicalInformation?.foodAllergies,
                      );
                      const substanceAllergyMembers = members.filter(
                        (m) => m.medicalInformation?.substanceAllergies,
                      );
                      const medicationAllergyMembers = members.filter(
                        (m) => m.medicalInformation?.medicationAllergies,
                      );
                      const hayFeverMembers = members.filter(
                        (m) => m.medicalInformation?.hayFever,
                      );

                      const hasAllergies =
                        foodAllergyMembers.length > 0 ||
                        substanceAllergyMembers.length > 0 ||
                        medicationAllergyMembers.length > 0 ||
                        hayFeverMembers.length > 0;

                      if (!hasAllergies) {
                        return (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span>Geen allergieën geregistreerd</span>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          {foodAllergyMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-orange-700">
                                Voedselallergieën:
                              </h4>
                              {foodAllergyMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-orange-200 bg-orange-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                  <p className="mt-1 text-sm text-gray-700">
                                    {member.medicalInformation?.foodAllergies}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {substanceAllergyMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-orange-700">
                                Stofallergieën:
                              </h4>
                              {substanceAllergyMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-orange-200 bg-orange-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                  <p className="mt-1 text-sm text-gray-700">
                                    {
                                      member.medicalInformation
                                        ?.substanceAllergies
                                    }
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {medicationAllergyMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-orange-700">
                                Medicatieallergieën:
                              </h4>
                              {medicationAllergyMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-orange-200 bg-orange-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                  <p className="mt-1 text-sm text-gray-700">
                                    {
                                      member.medicalInformation
                                        ?.medicationAllergies
                                    }
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {hayFeverMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-orange-700">
                                Hooikoorts:
                              </h4>
                              {hayFeverMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-orange-200 bg-orange-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                  {member.medicalInformation
                                    ?.hayFeverInformation && (
                                    <p className="mt-1 text-sm text-gray-700">
                                      {
                                        member.medicalInformation
                                          .hayFeverInformation
                                      }
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Physical Abilities, Vaccinations, Medication, and Permissions */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Physical Abilities and Limitations */}
              <Card>
                <CardHeader className="px-6 py-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                    <Activity className="h-5 w-5" />
                    Fysieke vaardigheden en beperkingen
                  </h3>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {(() => {
                      const cannotSwimMembers = members.filter(
                        (m) => !m.medicalInformation?.canSwim,
                      );
                      const cannotSportsMembers = members.filter(
                        (m) => !m.medicalInformation?.canParticipateSports,
                      );
                      const tiredMembers = members.filter(
                        (m) => m.medicalInformation?.getsTiredQuickly,
                      );

                      const hasLimitations =
                        cannotSwimMembers.length > 0 ||
                        cannotSportsMembers.length > 0 ||
                        tiredMembers.length > 0;

                      if (!hasLimitations) {
                        return (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span>Geen fysieke beperkingen</span>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          {cannotSwimMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-blue-700">
                                Kan niet zwemmen:
                              </h4>
                              {cannotSwimMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-blue-200 bg-blue-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                </div>
                              ))}
                            </div>
                          )}

                          {cannotSportsMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-blue-700">
                                Kan niet sporten:
                              </h4>
                              {cannotSportsMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-blue-200 bg-blue-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                </div>
                              ))}
                            </div>
                          )}

                          {tiredMembers.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-medium text-blue-700">
                                Wordt snel moe:
                              </h4>
                              {tiredMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="mb-2 rounded-lg border border-blue-200 bg-blue-50 p-3"
                                >
                                  <TableLink
                                    href={`/leidingsportaal/leden/${member.id}`}
                                  >
                                    {member.firstName} {member.lastName}
                                  </TableLink>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </CardBody>
              </Card>

              {/* Vaccinations, Medication, and Permissions */}
              <Card>
                <CardHeader className="px-6 py-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-green-600">
                    <ShieldCheck className="h-5 w-5" />
                    Vaccinaties, medicatie en toestemmingen
                  </h3>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-6">
                    {/* Vaccinations */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-medium text-blue-600">
                        <Baby className="h-4 w-4" />
                        Vaccinaties
                      </h4>
                      {(() => {
                        const notVaccinatedMembers = members.filter(
                          (m) => !m.medicalInformation?.tetanusVaccination,
                        );

                        if (notVaccinatedMembers.length === 0) {
                          return (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">
                                Alle leden gevaccineerd
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div>
                            <h5 className="mb-2 text-sm font-medium text-red-700">
                              Niet gevaccineerd tegen tetanus:
                            </h5>
                            {notVaccinatedMembers.map((member) => (
                              <div
                                key={member.id}
                                className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                              >
                                <TableLink
                                  href={`/leidingsportaal/leden/${member.id}`}
                                >
                                  {member.firstName} {member.lastName}
                                </TableLink>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Medication */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-medium text-orange-600">
                        <Clock className="h-4 w-4" />
                        Medicatie
                      </h4>
                      {(() => {
                        const medicationMembers = members.filter(
                          (m) => m.medicalInformation?.medication,
                        );
                        const noPermissionMembers = members.filter(
                          (m) => !m.medicalInformation?.permissionMedication,
                        );

                        const hasMedicationIssues =
                          medicationMembers.length > 0 ||
                          noPermissionMembers.length > 0;

                        if (!hasMedicationIssues) {
                          return (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">
                                Geen medicatie-gerelateerde problemen
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            {medicationMembers.length > 0 && (
                              <div>
                                <h5 className="mb-2 text-sm font-medium text-orange-700">
                                  Regelmatige medicatie:
                                </h5>
                                {medicationMembers.map((member) => (
                                  <div
                                    key={member.id}
                                    className="mb-2 rounded-lg border border-orange-200 bg-orange-50 p-3"
                                  >
                                    <TableLink
                                      href={`/leidingsportaal/leden/${member.id}`}
                                    >
                                      {member.firstName} {member.lastName}
                                    </TableLink>
                                    <p className="mt-1 text-sm text-gray-700">
                                      {member.medicalInformation?.medication}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {noPermissionMembers.length > 0 && (
                              <div>
                                <h5 className="mb-2 text-sm font-medium text-red-700">
                                  Geen toestemming medicatie:
                                </h5>
                                {noPermissionMembers.map((member) => (
                                  <div
                                    key={member.id}
                                    className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                                  >
                                    <TableLink
                                      href={`/leidingsportaal/leden/${member.id}`}
                                    >
                                      {member.firstName} {member.lastName}
                                    </TableLink>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Photo Permissions */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-medium text-green-600">
                        <UserCheck className="h-4 w-4" />
                        Foto toestemmingen
                      </h4>
                      {(() => {
                        const noPhotoPermissionMembers = members.filter(
                          (m) => !m.gdprPermissionToPublishPhotos,
                        );

                        if (noPhotoPermissionMembers.length === 0) {
                          return (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">
                                Alle leden geven toestemming voor foto&apos;s
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div>
                            <h5 className="mb-2 text-sm font-medium text-red-700">
                              Geen toestemming voor foto&apos;s:
                            </h5>
                            {noPhotoPermissionMembers.map((member) => (
                              <div
                                key={member.id}
                                className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3"
                              >
                                <TableLink
                                  href={`/leidingsportaal/leden/${member.id}`}
                                >
                                  {member.firstName} {member.lastName}
                                </TableLink>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Members Table */}
          <MembersTable members={memberTabularData} hideGroupColumn={true} />
        </div>
      </SignedIn>
    </>
  );
}
