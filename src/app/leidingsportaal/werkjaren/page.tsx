import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import { requireLeidingAuth } from "~/lib/auth";

export default async function Werkjaren() {
  // Check if user has leiding role - this will redirect if not authorized
  await requireLeidingAuth();

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { label: "Werkjaren" },
  ];

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <BreadcrumbsWrapper items={breadcrumbItems} />

      <BlogTextNoAnimation>
        <h1>Werkjaren beheren</h1>
        <p>
          Hier kun je een nieuw werkjaar starten, het huidige werkjaar
          beeindigen en de prijs voor inschrijven bekijken.
        </p>
      </BlogTextNoAnimation>
      <SignedIn></SignedIn>
    </>
  );
}
