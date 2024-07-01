import { Suspense } from "react";
import SponsorRow from "./sponsor-row";
import { SignedIn } from "@clerk/nextjs";
import AddSponsorButton from "./add-sponsor-button";
import { checkRole } from "~/utils/roles";
import Header2 from "~/components/typography/header2";
import Paragraph from "~/components/typography/paragraph";

export default function SponsorsSection() {
  return (
    <section className="flex flex-col gap-4">
      <Header2 id="sponsors">Onze sponsors</Header2>
      <Paragraph>
        Wij zijn dankbaar voor de steun van onze sponsors. Dankzij hen kunnen we
        onze activiteiten organiseren en onze leden een onvergetelijke tijd
        bezorgen. Zelf sponsor worden? Neem gerust contact op met onze
        hoofdleiding.
      </Paragraph>
      <div className="flex flex-col gap-6">
        <SignedIn>{checkRole("admin") && <AddSponsorButton />}</SignedIn>
        <Suspense fallback={<div>Sponsors laden...</div>}>
          <div className="flex flex-col gap-2">
            <SponsorRow
              direction="right"
              minimumAmount={101}
              maximumAmount={10000}
            />
            <SponsorRow
              direction="left"
              minimumAmount={51}
              maximumAmount={100}
            />
            <SponsorRow
              direction="right"
              minimumAmount={0}
              maximumAmount={50}
            />
          </div>
        </Suspense>
      </div>
    </section>
  );
}
