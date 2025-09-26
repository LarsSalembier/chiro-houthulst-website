import { type Metadata } from "next";
import BlogText from "~/components/ui/blog-text";
import SplitSection from "~/components/ui/split-section";
import {
  getAllMainLeaders,
  getAllTentRentals,
  getAllTentRentalTerms,
} from "./actions";
import PhoneNumber from "~/components/ui/phone-number";
import { Image } from "@heroui/image";

export const metadata: Metadata = {
  title: "Tentenverhuur",
  description:
    "Huur een tent bij Chiro Sint-Jan Houthulst. Bekijk ons aanbod en contacteer de hoofdleiding voor meer informatie.",
};

export default async function Tentverhuur() {
  const [mainLeaders, tentRentals, tentRentalTerms] = await Promise.all([
    getAllMainLeaders(),
    getAllTentRentals(),
    getAllTentRentalTerms(),
  ]);

  return (
    <>
      <BlogText className="pt-16" maxWidth={false}>
        <h1>Tentenverhuur</h1>
        <p>
          Chiro Sint-Jan Houthulst verhuurt verschillende soorten tenten voor uw
          evenementen, kampen of andere activiteiten. Onze tenten zijn van goede
          kwaliteit en worden regelmatig onderhouden.
        </p>
      </BlogText>

      {tentRentals.length > 0 ? (
        tentRentals.map((tent, index) => (
          <SplitSection key={tent.id}>
            <div className="flex w-[400px] items-center justify-center xl:w-[500px]">
              {tent.imageUrl ? (
                <div className="h-[300px] w-[400px] overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={tent.imageUrl}
                    alt={tent.name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[300px] w-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="mb-2 text-4xl text-gray-400">🏕️</div>
                  <p className="text-sm font-medium text-gray-500">
                    Foto volgt binnenkort
                  </p>
                </div>
              )}
            </div>
            <BlogText maxWidth={false}>
              <h2>{tent.name}</h2>
              {tent.description && <p>{tent.description}</p>}
              <p className="text-lg font-bold text-primary">
                €{tent.price.toFixed(2)}
              </p>
            </BlogText>
          </SplitSection>
        ))
      ) : (
        <BlogText className="mx-auto" maxWidth={false}>
          <p className="text-gray-600">
            Momenteel zijn er geen tenten beschikbaar voor verhuur. Neem contact
            op met de hoofdleiding voor meer informatie.
          </p>
        </BlogText>
      )}

      <BlogText className="mx-auto" maxWidth={false}>
        <h2>Contact</h2>
        <p>
          Voor meer informatie over onze tentverhuur of om een tent te
          reserveren, kunt u contact opnemen met de hoofdleiding:
        </p>

        {mainLeaders.length > 0 ? (
          <div className="mt-4 space-y-2">
            {mainLeaders.map((leader) => (
              <div key={leader.id} className="flex items-center gap-2">
                <span className="font-medium">{leader.name}:</span>
                <PhoneNumber number={leader.phone} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            Contactgegevens van de hoofdleiding zijn momenteel niet beschikbaar.
          </p>
        )}

        <h2>Algemene voorwaarden</h2>

        {tentRentalTerms.length > 0 ? (
          <ul>
            {tentRentalTerms.map((term) => (
              <li key={term.id}>{term.text}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            Algemene voorwaarden zijn momenteel niet beschikbaar.
          </p>
        )}

        <p className="mt-4 text-sm text-gray-600">
          Voor specifieke vragen over beschikbaarheid of speciale voorwaarden,
          neem contact op met de hoofdleiding.
        </p>
      </BlogText>
    </>
  );
}
