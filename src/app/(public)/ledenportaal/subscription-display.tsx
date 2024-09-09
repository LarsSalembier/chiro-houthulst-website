import { PencilIcon } from "lucide-react";
import Link from "next/link";
import {
  Section,
  SectionContent,
  SectionFooter,
  SectionTitle,
} from "~/components/section";
import {
  Subsection,
  SubsectionContent,
  SubsectionTitle,
} from "~/components/subsection";
import { MutedText } from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getMembersForLoggedInUser } from "~/server/queries/registration-queries";

export default async function SubscriptionDisplay() {
  const members = await getMembersForLoggedInUser();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("nl-BE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const parentTypeToString = (type: string) => {
    switch (type) {
      case "MOTHER":
        return "mama";
      case "FATHER":
        return "papa";
      case "GUARDIAN":
        return "voogd";
      case "PLUSMOTHER":
        return "plusmama";
      case "PLUSFATHER":
        return "pluspapa";
      default:
        return "Onbekend";
    }
  };

  return (
    <Section id="algemeen">
      <SectionTitle>Inschrijvingen</SectionTitle>
      <SectionContent>
        {members.length === 0 && (
          <p>
            Je hebt nog geen kinderen ingeschreven. Schrijf een nieuw lid in om
            te beginnen.
          </p>
        )}
        <Tabs>
          <TabsList>
            {members.map((member) => (
              <TabsTrigger key={member.id} value={member.id.toString()}>
                {member.firstName} {member.lastName}
              </TabsTrigger>
            ))}
          </TabsList>
          {members.map((member) => (
            <TabsContent key={member.id} value={member.id.toString()}>
              <div className="flex flex-wrap gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {member.firstName} {member.lastName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Geboortedatum: {formatDate(member.dateOfBirth)}</p>
                    <p>
                      Geslacht:{" "}
                      {member.gender === "M"
                        ? "man"
                        : member.gender === "F"
                          ? "vrouw"
                          : "X"}
                    </p>
                    {member.emailAddress && (
                      <p>E-mail: {member.emailAddress}</p>
                    )}
                    {member.phoneNumber && (
                      <p>Telefoon: {member.phoneNumber}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link
                        href={`/ledenportaal/lid-bewerken/${member.id}/persoonlijk`}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Bewerken
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ouders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {member.membersParents?.map((memberParent, index) => (
                      <div key={index}>
                        <p>
                          {memberParent.parent.firstName}{" "}
                          {memberParent.parent.lastName} (
                          {parentTypeToString(memberParent.parent.type)})
                        </p>
                        <p>Telefoon: {memberParent.parent.phoneNumber}</p>
                        <p>E-mail: {memberParent.parent.emailAddress}</p>
                        {memberParent.parent.parentAddresses?.map(
                          (parentAddress, addressIndex) => (
                            <p key={addressIndex}>
                              Adres: {parentAddress.address.street}{" "}
                              {parentAddress.address.houseNumber},
                              {parentAddress.address.postalCode}{" "}
                              {parentAddress.address.municipality}
                            </p>
                          ),
                        )}
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link
                        href={`/ledenportaal/lid-bewerken/${member.id}/ouders`}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Bewerken
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Extra contactpersoon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {member.memberExtraContactPersons?.map(
                      (extraContact, index) => (
                        <div key={index}>
                          <p>
                            {extraContact.extraContactPerson.firstName}{" "}
                            {extraContact.extraContactPerson.lastName} (
                            {extraContact.extraContactPerson.relationship})
                          </p>
                          <p>
                            Telefoon:{" "}
                            {extraContact.extraContactPerson.phoneNumber}
                          </p>
                        </div>
                      ),
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link
                        href={`/ledenportaal/lid-bewerken/${member.id}/extra-contacten`}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Bewerken
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Tijdens de activiteiten maken we soms foto&apos;s die we
                      publiceren op de website en sociale media.
                    </p>
                    <p>
                      Toestemming foto&apos;s:{" "}
                      {member.permissionPhotos ? "ja" : "nee"}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link
                        href={`/ledenportaal/lid-bewerken/${member.id}/toestemmingen`}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Bewerken
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Subsection>
                  <SubsectionTitle>Medische steekkaart</SubsectionTitle>
                  <SubsectionContent className="flex flex-wrap gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Huisarts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Naam: Dr. {member.medicalInformation?.doctorFirstName}{" "}
                          {member.medicalInformation?.doctorLastName}
                        </p>
                        <p>
                          Telefoonnummer:{" "}
                          {member.medicalInformation?.doctorPhoneNumber}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link
                            href={`/ledenportaal/lid-bewerken/${member.id}/huisarts`}
                          >
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Bewerken
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Toedienen van medicatie</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Het is verboden om als begeleid(st)er, behalve EHBO,
                          op eigen initiatief medische handelingen uit te
                          voeren. Ook het verstrekken van lichte pijnstillende
                          en koortswerende medicatie zoals Perdolan, Dafalgan of
                          Aspirine is, zonder toelating van de ouders,
                          voorbehouden aan een arts. Daarom is het noodzakelijk
                          om via deze steekkaart vooraf toestemming van ouders
                          te hebben voor het eventueel toedienen van dergelijke
                          hulp.
                        </p>
                        <p>
                          Wij geven toestemming aan begeleiders om bij
                          hoogdringendheid aan onze zoon of dochter een dosis
                          via de apotheek vrij verkrijgbare pijnstillende en
                          koortswerende medicatie toe te dienen:{" "}
                          {member.medicalInformation?.permissionMedication
                            ? "ja"
                            : "nee"}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link
                            href={`/ledenportaal/lid-bewerken/${member.id}/toestemmingen`}
                          >
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Bewerken
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Allergieën</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!member.medicalInformation?.foodAllergies &&
                          !member.medicalInformation?.medicationAllergies &&
                          !member.medicalInformation?.substanceAllergies &&
                          !member.medicalInformation?.hayFever && (
                            <p>Geen allergieën opgegeven</p>
                          )}

                        {member.medicalInformation?.foodAllergies && (
                          <p>
                            Allergisch voor bepaalde voeding:{" "}
                            {member.medicalInformation.foodAllergies}
                          </p>
                        )}
                        {member.medicalInformation?.medicationAllergies && (
                          <p>
                            Allergisch voor bepaalde medicatie:{" "}
                            {member.medicalInformation.medicationAllergies}
                          </p>
                        )}
                        {member.medicalInformation?.substanceAllergies && (
                          <p>
                            Allergisch voor bepaalde zaken:{" "}
                            {member.medicalInformation.substanceAllergies}
                          </p>
                        )}
                        {member.medicalInformation?.hayFever && (
                          <p>
                            Hooikoorts: {member.medicalInformation.hayFeverInfo}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link
                            href={`/ledenportaal/lid-bewerken/${member.id}/allergieen`}
                          >
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Bewerken
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Medische aandoeningen</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!member.medicalInformation?.asthma &&
                          !member.medicalInformation?.bedwetting &&
                          !member.medicalInformation?.epilepsy &&
                          !member.medicalInformation?.heartCondition &&
                          !member.medicalInformation?.skinCondition &&
                          !member.medicalInformation?.rheumatism &&
                          !member.medicalInformation?.sleepwalking &&
                          !member.medicalInformation?.diabetes &&
                          !member.medicalInformation
                            ?.otherMedicalConditions && (
                            <p>Geen medische aandoeningen opgegeven</p>
                          )}

                        {member.medicalInformation?.asthma && (
                          <p>Astma: {member.medicalInformation.asthmaInfo}</p>
                        )}
                        {member.medicalInformation?.bedwetting && (
                          <p>
                            Bedplassen:{" "}
                            {member.medicalInformation.bedwettingInfo}
                          </p>
                        )}
                        {member.medicalInformation?.epilepsy && (
                          <p>
                            Epilepsie: {member.medicalInformation.epilepsyInfo}
                          </p>
                        )}
                        {member.medicalInformation?.heartCondition && (
                          <p>
                            Hartaandoening:{" "}
                            {member.medicalInformation.heartConditionInfo}
                          </p>
                        )}
                        {member.medicalInformation?.skinCondition && (
                          <p>
                            Huidaandoening:{" "}
                            {member.medicalInformation.skinConditionInfo}
                          </p>
                        )}
                        {member.medicalInformation?.rheumatism && (
                          <p>
                            Reuma: {member.medicalInformation.rheumatismInfo}
                          </p>
                        )}
                        {member.medicalInformation?.sleepwalking && (
                          <p>
                            Slaapwandelen:{" "}
                            {member.medicalInformation.sleepwalkingInfo}
                          </p>
                        )}
                        {member.medicalInformation?.diabetes && (
                          <p>
                            Diabetes: {member.medicalInformation.diabetesInfo}
                          </p>
                        )}
                        {member.medicalInformation?.otherMedicalConditions && (
                          <p>
                            Andere medische aandoeningen:{" "}
                            {member.medicalInformation.otherMedicalConditions}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link
                            href={`/ledenportaal/lid-bewerken/${member.id}/medisch-specifiek`}
                          >
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Bewerken
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Medische informatie</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {member.medicalInformation?.pastMedicalHistory && (
                          <p>
                            Medische voorgeschiedenis:{" "}
                            {member.medicalInformation.pastMedicalHistory}
                          </p>
                        )}
                        {member.medicalInformation?.medication && (
                          <p>
                            Medicatie: {member.medicalInformation.medication}
                          </p>
                        )}
                        <p>
                          Tetanusvaccinatie:{" "}
                          {member.medicalInformation?.tetanusVaccination
                            ? member.medicalInformation.tetanusVaccinationYear
                              ? "ja, in het jaar: " +
                                member.medicalInformation.tetanusVaccinationYear
                              : "ja"
                            : "nee"}
                        </p>
                        {member.medicalInformation?.otherRemarks && (
                          <p>
                            Andere opmerkingen:{" "}
                            {member.medicalInformation.otherRemarks}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link
                            href={`/ledenportaal/lid-bewerken/${member.id}/medisch`}
                          >
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Bewerken
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Sport en spel</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Kan zwemmen:{" "}
                          {member.medicalInformation?.canSwim ? "ja" : "nee"}
                        </p>
                        <p>
                          Kan deelnemen aan sport:{" "}
                          {member.medicalInformation?.canParticipateSports
                            ? "ja"
                            : "nee"}
                        </p>
                        <p>
                          Wordt snel moe:{" "}
                          {member.medicalInformation?.getsTiredQuickly
                            ? "ja"
                            : "nee"}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link
                            href={`/ledenportaal/lid-bewerken/${member.id}/sport-en-spel`}
                          >
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Bewerken
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </SubsectionContent>
                </Subsection>
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Afdelingen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {member.memberDepartments?.map(
                      (memberDepartment, index) => (
                        <p key={index}>
                          {memberDepartment.department.name} (
                          {memberDepartment.workYear.name})
                        </p>
                      ),
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link
                        href={`/ledenportaal/lid-bewerken/${member.id}/afdelingen`}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Bewerken
                      </Link>
                    </Button>
                  </CardFooter>
                </Card> */}

                {/* <Card>
                  <CardHeader>
                    <CardTitle>Inschrijvingen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {member.subscriptions?.map((subscription, index) => (
                      <p key={index}>
                        {subscription.activity.name}: {subscription.status}
                      </p>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link
                        href={`/ledenportaal/lid-bewerken/${member.id}/inschrijvingen`}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Bewerken
                      </Link>
                    </Button>
                  </CardFooter>
                </Card> */}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </SectionContent>
      <SectionFooter>
        <Button size="lg" className="w-fit" disabled>
          <Link href="#">Nieuw lid inschrijven</Link>
        </Button>
        <MutedText>
          De inschrijvingen voor dit werkjaar zijn nog niet geopend.
        </MutedText>
      </SectionFooter>
    </Section>
  );
}
