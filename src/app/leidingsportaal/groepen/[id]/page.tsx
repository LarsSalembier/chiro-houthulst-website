import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Users } from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import SignInAsLeiding from "../../sign-in-as-leiding";
import { GROUP_QUERIES } from "~/server/db/queries/group-queries";
import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import { MEMBER_QUERIES } from "~/server/db/queries/member-queries";
import { notFound } from "next/navigation";
import GroupTabs from "~/features/leidingsportaal/GroupTabs";
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

  // Fetch both datasets
  const [workYearMembers, campMembers] = await Promise.all([
    MEMBER_QUERIES.getMembersForWorkYear(workYear.id, groupId),
    MEMBER_QUERIES.getCampMembersForWorkYear(workYear.id, groupId),
  ]);

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

  // Helper function to calculate statistics for a given member list
  const calculateStatistics = (members: typeof workYearMembers) => {
    const totalMembers = members.length;
    const boysCount = members.filter((m) => m.gender === "M").length;
    const girlsCount = members.filter((m) => m.gender === "F").length;
    const otherGenderCount = members.filter((m) => m.gender === "X").length;

    // Calculate camp statistics (only relevant for camp view)
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

    return {
      totalMembers,
      boysCount,
      girlsCount,
      otherGenderCount,
      campSubscriptions,
      campPaymentReceived,
      campPaymentPending,
      averageAge,
    };
  };

  const workYearStats = calculateStatistics(workYearMembers);
  const campStats = calculateStatistics(campMembers);

  // Helper function to prepare member data for the table
  const prepareMemberData = (members: typeof workYearMembers) => {
    return members.map((member) => ({
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
      tetanusVaccination:
        member.medicalInformation?.tetanusVaccination ?? false,
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
  };

  const workYearMemberData = prepareMemberData(workYearMembers);
  const campMemberData = prepareMemberData(campMembers);

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
          <GroupTabs
            group={group}
            workYearMembers={workYearMembers}
            campMembers={campMembers}
            workYearMemberData={workYearMemberData}
            campMemberData={campMemberData}
            workYearStats={workYearStats}
            campStats={campStats}
            minAge={minAge}
            displayMaxAge={displayMaxAge}
            genderText={genderText}
          />
        </div>
      </SignedIn>
    </>
  );
}
