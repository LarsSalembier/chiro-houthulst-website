import { type Metadata } from "next";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
} from "~/components/page-header";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Section } from "~/components/section";
import AddWorkyearForm from "./add-workyear-form";
import AddGroupForm from "./add-group-form";

export const metadata: Metadata = {
  title: "Ledenportaal",
  description: "Hier kan je jouw gegevens raadplegen en wijzigen.",
};

export default async function SignUpPage() {
  return (
    <div className="container relative flex flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>Leidingsportaal</PageHeaderHeading>
        <PageHeaderDescription>
          <SignedOut>
            Log in om leden in te schrijven en inschrijvingen te beheren.
          </SignedOut>
          <SignedIn>
            Welkom op het leidingsportaal! Hier kan je leden inschrijven, hun
            gegevens raadplegen en inschrijvingen beheren.
          </SignedIn>
        </PageHeaderDescription>
        <SignedOut>
          <div className="flex flex-wrap gap-4 pt-4">
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
      </PageHeader>
      <SignedIn>
        <div className="pb-8 md:pb-12 lg:pb-12">
          <Section>
            <AddWorkyearForm />
            <AddGroupForm />
          </Section>
        </div>
      </SignedIn>
    </div>
  );
}
