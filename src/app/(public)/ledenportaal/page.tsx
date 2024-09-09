import { type Metadata } from "next";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
} from "~/components/page-header";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import SubscriptionDisplay from "./subscription-display";

export const metadata: Metadata = {
  title: "Ledenportaal",
  description: "Hier kan je jouw gegevens raadplegen en wijzigen.",
};

export default async function SignUpPage() {
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
          <SubscriptionDisplay />
        </div>
      </SignedIn>
    </div>
  );
}
