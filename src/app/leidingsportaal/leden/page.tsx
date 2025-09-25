import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardBody } from "@heroui/card";
import { Users, BarChart3, Tent, CheckCircle } from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import SignInAsLeiding from "../sign-in-as-leiding";
import { MEMBER_QUERIES } from "~/server/db/queries/member-queries";
import ChiroOverviewTabs from "~/features/leidingsportaal/ChiroOverviewTabs";
import { requireLeidingAuth } from "~/lib/auth";
import EndWorkYearButton from "~/components/work-years/EndWorkYearButton";
import StartWorkYearButton from "~/components/work-years/StartWorkYearButton";
import { currentUser } from "@clerk/nextjs/server";
import { getAllGroups } from "../admin/actions";

export default async function ChiroOverviewPage() {
  // Check if user has leiding role - this will redirect if not authorized
  await requireLeidingAuth();

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const workYear = await WORK_YEAR_QUERIES.getByDate();
  const allGroups = await getAllGroups();

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { label: "Ledenoverzicht" },
  ];

  if (!workYear) {
    return (
      <>
        <BreadcrumbsWrapper items={breadcrumbItems} />
        <BlogTextNoAnimation>
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-4">
                <Users className="h-16 w-16 text-blue-600" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="!mb-0 !mt-0 !pb-0 !pt-0 text-4xl font-bold leading-tight">
                  Ledenoverzicht
                </h1>
                <p className="!mb-0 mt-1 !pb-0 text-base text-gray-600">
                  Geen actief werkjaar
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-8 text-center">
              <h2 className="mb-4 text-2xl font-semibold text-orange-800">
                Geen actief werkjaar
              </h2>
              <p className="mb-6 text-orange-700">
                Er is momenteel geen actief werkjaar. Start eerst een nieuw
                werkjaar voordat je het ledenoverzicht kunt bekijken.
              </p>
              {isAdmin && <StartWorkYearButton groups={allGroups} />}
            </div>
          </div>
        </BlogTextNoAnimation>
      </>
    );
  }

  const members = await MEMBER_QUERIES.getMembersForWorkYear(workYear.id);

  // Calculate overall statistics
  const totalMembers = members.length;
  const boysCount = members.filter((m) => m.gender === "M").length;
  const girlsCount = members.filter((m) => m.gender === "F").length;
  const otherGenderCount = members.filter((m) => m.gender === "X").length;

  // Camp statistics
  const campSubscriptions = members.filter(
    (m) => m.yearlyMembership?.campSubscription,
  ).length;
  const campPaymentReceived = members.filter(
    (m) => m.yearlyMembership?.campPaymentReceived,
  ).length;
  const campPaymentPending = campSubscriptions - campPaymentReceived;

  // Payment statistics
  const paymentReceived = members.filter(
    (m) => m.yearlyMembership?.paymentReceived,
  ).length;
  const paymentPending = totalMembers - paymentReceived;

  // Group statistics
  const groupStats = members.reduce(
    (acc, member) => {
      const groupName = member.yearlyMembership?.group?.name ?? "Onbekend";
      acc[groupName] ??= {
        name: groupName,
        count: 0,
        color: member.yearlyMembership?.group?.color ?? "#3b82f6",
      };
      acc[groupName].count++;
      return acc;
    },
    {} as Record<string, { name: string; count: number; color: string }>,
  );

  const sortedGroups = Object.values(groupStats).sort(
    (a, b) => b.count - a.count,
  );

  // Calculate average age
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
    gdprPermissionToPublishPhotos: member.gdprPermissionToPublishPhotos,
    paymentReceived: member.yearlyMembership?.paymentReceived ?? false,
    paymentMethod: member.yearlyMembership?.paymentMethod ?? "",
    paymentDate: member.yearlyMembership?.paymentDate ?? undefined,
  }));

  // Get work year name (format: "2023-2024")
  const workYearName = `${workYear.startDate.getFullYear()}-${workYear.endDate?.getFullYear() ?? new Date().getFullYear()}`;

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <BlogTextNoAnimation>
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-4">
              <Users className="h-16 w-16 text-blue-600" />
            </div>
            <div className="flex flex-col justify-center">
              <h1
                className="!mb-0 !mt-0 !pb-0 !pt-0 text-4xl font-bold leading-tight"
                style={{ margin: 0, padding: 0 }}
              >
                Ledenoverzicht
              </h1>
              <p
                className="!mb-0 mt-1 !pb-0 text-base text-gray-600"
                style={{ marginBottom: 0, paddingBottom: 0 }}
              >
                Werkjaar {workYearName} • {totalMembers} leden
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-4">
          <SignedOut>
            <SignInAsLeiding />
          </SignedOut>
          <SignedIn>
            {isAdmin && workYear && (
              <EndWorkYearButton currentWorkYear={workYear} />
            )}
          </SignedIn>
        </div>
      </BlogTextNoAnimation>

      <SignedIn>
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Overview Statistics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Users className="h-8 w-8 text-blue-600" />
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
                  <div className="rounded-lg bg-green-100 p-3">
                    <BarChart3 className="h-8 w-8 text-green-600" />
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
                  <div className="rounded-lg bg-orange-100 p-3">
                    <Tent className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kampinschrijvingen</p>
                    <p className="text-2xl font-bold">{campSubscriptions}</p>
                    <p className="text-xs text-gray-500">
                      {campPaymentReceived} betaald, {campPaymentPending}{" "}
                      openstaand
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lidgeld betaald</p>
                    <p className="text-2xl font-bold">{paymentReceived}</p>
                    <p className="text-xs text-gray-500">
                      {paymentPending} nog openstaand
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <ChiroOverviewTabs
            members={members}
            memberTabularData={memberTabularData}
            totalMembers={totalMembers}
            boysCount={boysCount}
            girlsCount={girlsCount}
            otherGenderCount={otherGenderCount}
            campSubscriptions={campSubscriptions}
            campPaymentReceived={campPaymentReceived}
            campPaymentPending={campPaymentPending}
            paymentReceived={paymentReceived}
            paymentPending={paymentPending}
            averageAge={averageAge}
            medicalConditions={null} // Removed medicalConditions
            sortedGroups={sortedGroups}
            workYearName={workYearName}
          />
        </div>
      </SignedIn>
    </>
  );
}
