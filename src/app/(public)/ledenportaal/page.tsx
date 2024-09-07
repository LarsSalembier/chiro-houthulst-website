import { type Metadata } from "next";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
} from "~/components/page-header";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import {
  Section,
  SectionContent,
  SectionFooter,
  SectionTitle,
} from "~/components/section";
import { Paragraph } from "~/components/typography/text";
import { Grid } from "~/components/grid";
import { getMembersForLoggedInUser } from "~/server/queries/member-queries";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ledenportaal",
  description: "Hier kan je jouw gegevens raadplegen en wijzigen.",
};

export default async function SignUpPage() {
  const members = await getMembersForLoggedInUser();

  return (
    <div className="container relative flex flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>Ledenportaal</PageHeaderHeading>
        <PageHeaderDescription>
          <SignedOut>
            Log in om jouw gegevens te wijzigen, documenten te raadplegen of in
            te schrijven.
          </SignedOut>
          <SignedIn>
            Welkom op het ledenportaal! Hier kan je jouw gegevens raadplegen en
            wijzigen, documenten downloaden en inschrijven voor activiteiten.
          </SignedIn>
        </PageHeaderDescription>
      </PageHeader>
      <div className="px-4 pb-8 md:pb-12 lg:pb-12">
        <SignedOut>
          <div className="flex flex-row gap-4">
            <SignInButton>
              <Button size="lg">Inloggen</Button>
            </SignInButton>
            <SignUpButton>
              <Button size="lg" variant="secondary">
                Account aanmaken
              </Button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <Section id="algemeen">
            <SectionTitle>Inschrijvingen</SectionTitle>
            <SectionContent>
              {members.length === 0 && (
                <Paragraph>
                  Je hebt nog geen kinderen ingeschreven. Schrijf een nieuw lid
                  in om te beginnen.
                </Paragraph>
              )}
              <Grid>
                {members.map((member) => (
                  <Card key={member.id}>
                    <CardHeader>
                      <CardTitle>
                        {member.firstName} {member.lastName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Paragraph>
                        Geboortedatum: {member.dateOfBirth.toString()}
                      </Paragraph>
                      <Paragraph>Geslacht: {member.gender}</Paragraph>
                      <Paragraph>
                        Toestemming foto&apos;s: {member.permissionPhotos}
                      </Paragraph>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </SectionContent>
            <SectionFooter>
              <Button size="lg" asChild className="w-fit">
                <Link href="/ledenportaal/nieuw-lid-inschrijven">
                  Nieuw lid inschrijven
                </Link>
              </Button>
            </SectionFooter>
          </Section>
        </SignedIn>
      </div>
    </div>
  );
}
