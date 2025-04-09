import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import BlogText from "~/components/ui/blog-text";

export default async function Werkjaren() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <BlogText className="pt-16">
        <h1>Werkjaren beheren</h1>
        <p>
          Hier kun je een nieuw werkjaar starten, het huidige werkjaar
          beeindigen en de prijs voor inschrijven bekijken.
        </p>
      </BlogText>
      <SignedIn></SignedIn>
    </>
  );
}
