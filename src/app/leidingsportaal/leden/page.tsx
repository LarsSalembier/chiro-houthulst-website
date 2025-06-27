import { SignedIn, SignedOut } from "@clerk/nextjs";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import SignInAsLeiding from "../sign-in-as-leiding";
import { MEMBER_QUERIES } from "~/server/db/queries/member-queries";
import MembersTable from "~/features/leidingsportaal/members-table";

export default async function LedenPage() {
  const workyear = await WORK_YEAR_QUERIES.getByDate();

  if (!workyear) {
    return <BlogTextNoAnimation>Geen werkjaar gevonden</BlogTextNoAnimation>;
  }

  const members = await MEMBER_QUERIES.getMembersForWorkYear(workyear?.id);

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
    { label: "Leden" },
  ];

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <BlogTextNoAnimation>
        <div className="flex items-center justify-between">
          <div>
            <h1>Volledige ledenlijst</h1>
            <p className="text-gray-600">
              Bekijk en beheer alle geregistreerde leden voor het huidige
              werkjaar.
            </p>
          </div>
          <div className="flex gap-2">
            <SignedOut>
              <SignInAsLeiding />
            </SignedOut>
          </div>
        </div>
      </BlogTextNoAnimation>

      <SignedIn>
        <MembersTable members={memberTabularData} />
      </SignedIn>
    </>
  );
}
