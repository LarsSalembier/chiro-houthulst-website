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
import { type Group } from "~/domain/entities/group";
import Link from "next/link";
import { Section, SectionContent, SectionTitle } from "~/components/section";
import { getMembersForGroupUseCase } from "~/application/use-cases/members/get-members-for-group";
import { getGroupsUseCase } from "~/application/use-cases/groups/get-groups.use-case";

export default async function LeidingsportaalContent() {
  const groups = await getGroupsUseCase();

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
  const members = await getMembersForGroupUseCase(group.id);

  console.log(members);

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
              <TableRow key={member.member.id}>
                <TableCell>
                  {member.member.name.firstName} {member.member.name.lastName}
                </TableCell>
                <TableCell>{member.member.emailAddress ?? "Geen"}</TableCell>
                <TableCell>
                  {new Date(member.member.dateOfBirth).toLocaleDateString(
                    "nl-BE",
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
