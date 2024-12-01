import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import Link from "next/link";
import { Section, SectionContent, SectionTitle } from "~/components/section";
import { getGroupsWithMembers } from "~/services/groups";

export default async function LeidingsportaalContent() {
  const groups = await getGroupsWithMembers();

  return (
    <div className="space-y-6">
      <Button asChild size="lg">
        <Link href="leidingsportaal/nieuw-lid-inschrijven">
          Nieuw lid inschrijven
        </Link>
      </Button>
      <Section>
        <SectionTitle>Ledenlijst</SectionTitle>
        <SectionContent>
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </SectionContent>
      </Section>
    </div>
  );
}

async function GroupCard({
  group,
}: {
  group: Awaited<ReturnType<typeof getGroupsWithMembers>>[number];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naam</TableHead>
              <TableHead>Geboortedatum</TableHead>
              <TableHead>Naam ouder</TableHead>
              <TableHead>Telefoonnummer ouder</TableHead>
              <TableHead>Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.yearlyMemberships.map((yearlyMembership) => (
              <TableRow key={yearlyMembership.member.id}>
                <TableCell>
                  {yearlyMembership.member.firstName}{" "}
                  {yearlyMembership.member.lastName}
                </TableCell>
                <TableCell>
                  {new Date(
                    yearlyMembership.member.dateOfBirth,
                  ).toLocaleDateString("nl-BE")}
                </TableCell>
                <TableCell>
                  {yearlyMembership.member.membersParents[0]?.parent.firstName}{" "}
                  {yearlyMembership.member.membersParents[0]?.parent.lastName}
                </TableCell>
                <TableCell>
                  {
                    yearlyMembership.member.membersParents[0]?.parent
                      .phoneNumber
                  }
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/leidingsportaal/leden/${yearlyMembership.member.id}`}
                    >
                      Gegevens inzien
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
