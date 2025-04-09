import { SignedIn, SignedOut } from "@clerk/nextjs";
import BlogText from "~/components/ui/blog-text";
import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import SignInAsLeiding from "./sign-in-as-leiding";
import { MEMBER_QUERIES } from "~/server/db/queries/member-queries";
import MembersTable from "~/features/leidingsportaal/members-table";

export default async function Leidingsportaal() {
  const workyear = await WORK_YEAR_QUERIES.getByDate();

  if (!workyear) {
    return <BlogText>Geen werkjaar gevonden</BlogText>;
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

  return (
    <>
      <BlogText className="pt-16">
        <h1>Leidingsportaal</h1>
        <p>
          Welkom op het leidingsportaal van Chiro Sint-Jan Houthulst. Hier vind
          je alle informatie die je nodig hebt als leiding.
        </p>
        <div className="flex gap-4">
          <SignedOut>
            <SignInAsLeiding />
          </SignedOut>
        </div>
      </BlogText>
      <SignedIn>
        <MembersTable members={memberTabularData} />
      </SignedIn>
    </>
  );
}
