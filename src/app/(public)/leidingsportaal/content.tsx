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
import { getGroups, getMembersForGroup } from "./actions";
import { type Group } from "~/domain/entities/group";
import Link from "next/link";
import { Section, SectionContent, SectionTitle } from "~/components/section";

export default async function LeidingsportaalContent() {
  const groups = await getGroups();

  if ("error" in groups) {
    return <div>{groups.error}</div>;
  }

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

async function GroupCard({ group }: { group: Group }) {
  const members = await getMembersForGroup(group.id);

  console.log(members);

  if ("error" in members) {
    return <div>{members.error}</div>;
  }

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
              <TableHead>Email</TableHead>
              <TableHead>Geboortedatum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  {member.name.firstName} {member.name.lastName}
                </TableCell>
                <TableCell>{member.emailAddress ?? "Geen"}</TableCell>
                <TableCell>
                  {new Date(member.dateOfBirth).toLocaleDateString("nl-BE")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
