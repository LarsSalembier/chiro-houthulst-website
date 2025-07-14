import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardBody } from "@heroui/card";
import { Tent, Users, Euro, CheckCircle, Clock, BarChart3 } from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import SignInAsLeiding from "../sign-in-as-leiding";
import { requireLeidingAuth } from "~/lib/auth";
import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import { MEMBER_QUERIES } from "~/server/db/queries/member-queries";
import { GROUP_QUERIES } from "~/server/db/queries/group-queries";
import KampTabs from "~/features/leidingsportaal/KampTabs";

export default async function KampPage() {
  // Check if user has leiding role - this will redirect if not authorized
  await requireLeidingAuth();

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

  // Get all camp members for the current work year
  const campMembers = await MEMBER_QUERIES.getCampMembersForWorkYear(
    workYear.id,
  );

  // Get all groups for reference
  const groups = await GROUP_QUERIES.getAll({ activeOnly: true });

  // Calculate overall statistics
  const totalSubscriptions = campMembers.length;
  const paidSubscriptions = campMembers.filter(
    (m) => m.yearlyMembership?.campPaymentReceived,
  ).length;
  const pendingPayments = totalSubscriptions - paidSubscriptions;
  const paymentPercentage =
    totalSubscriptions > 0
      ? Math.round((paidSubscriptions / totalSubscriptions) * 100)
      : 0;

  // Calculate payment method statistics
  const paymentMethods = campMembers.reduce(
    (acc, member) => {
      if (member.yearlyMembership?.campPaymentMethod) {
        acc[member.yearlyMembership.campPaymentMethod] =
          (acc[member.yearlyMembership.campPaymentMethod] ?? 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Group subscriptions by group
  const subscriptionsByGroup = groups.reduce(
    (acc, group) => {
      const groupMembers = campMembers.filter(
        (m) => m.yearlyMembership?.group?.id === group.id,
      );
      if (groupMembers.length > 0) {
        acc[group.id] = {
          group,
          subscriptions: groupMembers,
          total: groupMembers.length,
          paid: groupMembers.filter(
            (m) => m.yearlyMembership?.campPaymentReceived,
          ).length,
        };
      }
      return acc;
    },
    {} as Record<
      number,
      {
        group: any;
        subscriptions: any[];
        total: number;
        paid: number;
      }
    >,
  );

  // Calculate revenue
  const totalRevenue = paidSubscriptions * (workYear.campPrice ?? 175);
  const pendingRevenue = pendingPayments * (workYear.campPrice ?? 175);

  // Prepare member data for the table
  const campMemberData = campMembers.map((member) => ({
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

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { label: "Kamp" },
  ];

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <BlogTextNoAnimation>
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-orange-100 p-4">
              <Tent className="h-16 w-16 text-orange-600" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="!mb-0 !mt-0 !pb-0 !pt-0 text-4xl font-bold leading-tight">
                Kamp {workYear.startDate.getFullYear()}
              </h1>
              <p className="!mb-0 mt-1 !pb-0 text-base text-gray-600">
                Kampoverzicht • {totalSubscriptions} deelnemers
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-4">
          <SignedOut>
            <SignInAsLeiding />
          </SignedOut>
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
                    <p className="text-sm text-gray-600">Totaal ingeschreven</p>
                    <p className="text-2xl font-bold">{totalSubscriptions}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Betaald</p>
                    <p className="text-2xl font-bold">{paidSubscriptions}</p>
                    <p className="text-xs text-gray-500">
                      {paymentPercentage}%
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-yellow-100 p-3">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Openstaand</p>
                    <p className="text-2xl font-bold">{pendingPayments}</p>
                    <p className="text-xs text-gray-500">
                      {totalSubscriptions > 0
                        ? Math.round(
                            (pendingPayments / totalSubscriptions) * 100,
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Euro className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Omzet</p>
                    <p className="text-2xl font-bold">€{totalRevenue}</p>
                    <p className="text-xs text-gray-500">
                      €{pendingRevenue} openstaand
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <KampTabs
            campMembers={campMembers}
            campMemberData={campMemberData}
            totalSubscriptions={totalSubscriptions}
            paidSubscriptions={paidSubscriptions}
            pendingPayments={pendingPayments}
            paymentPercentage={paymentPercentage}
            totalRevenue={totalRevenue}
            pendingRevenue={pendingRevenue}
            paymentMethods={paymentMethods}
            subscriptionsByGroup={subscriptionsByGroup}
            workYear={workYear}
          />
        </div>
      </SignedIn>
    </>
  );
}
