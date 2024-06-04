import { Suspense } from "react";
import SponsorRow from "./sponsor-row";
import { SignedIn } from "@clerk/nextjs";
import AddSponsorButton from "./add-sponsor-button";

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Onze sponsors</h2>
      <div className="flex flex-col gap-6">
        <p className="text-gray-800">
          Wij zijn dankbaar voor de steun van onze sponsors. Dankzij hen kunnen
          we onze activiteiten organiseren en onze leden een onvergetelijke tijd
          bezorgen.
        </p>
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
