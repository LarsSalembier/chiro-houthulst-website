import Header1 from "~/components/typography/header1";
import Header2 from "~/components/typography/header2";
import Paragraph from "~/components/typography/paragraph";
import AddDepartmentDialog from "./_components/departments/add-department-dialog";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { db } from "~/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default async function LeidingDashboardPage() {
  const departments = await db.query.departments.findMany();

  return (
    <div>
      <SignedIn>
        <Header1>Leidingportaal</Header1>
        <Paragraph>
          Welkom op het leidingportaal. Hier kan je alle informatie vinden die
          je nodig hebt als leiding.
        </Paragraph>
        <Header2>Ledenlijsten</Header2>
        {departments.map((department) => (
          <Card key={department.id}>
            <CardHeader>
              <CardTitle>{department.name}</CardTitle>
              <Paragraph>{department.description}</Paragraph>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
        <AddDepartmentDialog />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
