import AddDepartmentDialog from "./add-department-dialog";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Paragraph } from "~/components/typography/text";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import {
  Section,
  SectionContent,
  SectionFooter,
  SectionTitle,
} from "~/components/section";
import { Grid } from "~/components/grid";
import { type Metadata } from "next";
import { isLeiding } from "~/lib/auth";
import { getAllDepartments } from "~/server/queries/department-queries";

export const metadata: Metadata = {
  title: "Afdelingen",
  description: "Beheer de afdelingen op deze pagina.",
};

export default async function LeidingDashboardPage() {
  const departments = await getAllDepartments();

  if (!isLeiding()) {
    return (
      <>
        <SignedIn>
          <div className="container relative flex flex-col gap-6 pb-8 md:pb-12 lg:pb-12">
            <PageHeader>
              <PageHeaderHeading>Leidingsportaal</PageHeaderHeading>
              <PageHeaderDescription>
                Je hebt geen toegang tot deze pagina. Wacht tot je account is
                goedgekeurd.
              </PageHeaderDescription>
            </PageHeader>
          </div>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    );
  }

  return (
    <div className="container relative flex flex-col gap-6 pb-8 md:pb-12 lg:pb-12">
      <SignedIn>
        <PageHeader>
          <PageHeaderHeading>Leidingsportaal</PageHeaderHeading>
          <PageHeaderDescription>
            Welkom op het leidingsportaal. Hier kan je alle informatie vinden
            die je nodig hebt als leiding.
          </PageHeaderDescription>
        </PageHeader>
        <Section>
          <SectionTitle>Afdelingen</SectionTitle>
          <SectionContent>
            <Grid>
              {departments.map((department) => (
                <Card key={department.id}>
                  <CardHeader>
                    <CardTitle>{department.name}</CardTitle>
                    <Paragraph>{department.description}</Paragraph>
                  </CardHeader>
                  <CardContent></CardContent>
                </Card>
              ))}
            </Grid>
          </SectionContent>
          <SectionFooter>
            <AddDepartmentDialog />
          </SectionFooter>
        </Section>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
