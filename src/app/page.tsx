import { Button } from "~/components/ui/button";
import { generateMetadata } from "~/lib/generate-metadata";
import ribbelsImage from "./../../public/groepen/ribbels.png";
import speelclubImage from "./../../public/groepen/speelclub.png";
import kwiksImage from "./../../public/groepen/kwiks.png";
import rakkersImage from "./../../public/groepen/rakkers.png";
import titosImage from "./../../public/groepen/titos.png";
import kerelsImage from "./../../public/groepen/kerels.png";
import tiptiensImage from "./../../public/groepen/tip10s.png";
import aspisImage from "./../../public/groepen/aspis.png";
import EventCard from "./_components/page/event-card";
import NewsCard from "./_components/page/news-card";
import AgeGroupCard from "./_components/page/age-group-card";
import Link from "next/link";
import SponsorsSection from "./_components/page/sponsors/sponsors-section";
import WelcomeSection from "./_components/page/welcome-section";

export const dynamic = "force-dynamic";

export const metadata = generateMetadata({
  title: "Home",
});

export default function HomePage() {
  return (
    <>
      <WelcomeSection />

      <section id="praktisch">
        <h2 className="mb-4 text-2xl font-bold">Praktisch</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-xl font-bold">Zondag</h3>
            <p className="text-gray-800">
              Elke zondag is er Chiro van 14u tot 17u in ons Chiroheem
              (Jonkershovestraat 101S). Tijdens de Chironamiddag voorzien wij
              een vieruurtje voor €1. Als je liever je eigen drankje en koekje
              meebrengt, is dat ook geen probleem.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold">Kamp</h3>
            <p className="text-gray-800">
              Elk jaar gaan we op kamp van 20 t.e.m. 30 juli. Als je mee wil op
              kamp, vragen we je om tijdens het jaar minstens vijf keer naar de
              Chiro te komen (en liefst zo vaak mogelijk). Zo kunnen de leiding
              en medeleden je beter leren kennen.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="mb-2 text-xl font-bold">Inschrijving</h3>
              <p className="text-gray-800">
                Inschrijven in de Chiro kost €30 en kan elke zondag bij de
                leiding. Zo zijn jullie ook verzekerd. Je kan altijd eens de
                Chiro komen uittesten, inschrijven is niet verplicht vanaf de
                eerste zondag!
              </p>
            </div>
            {/* <Button asChild className="w-fit">
                <Link href="/praktisch">Inschrijven</Link>
              </Button> */}
          </div>
        </div>
      </section>

      <section id="aankomende-evenementen" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Aankomende activiteiten</h2>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <EventCard
              title="Chiro"
              date="Zondag 9 juni 2024"
              time="14:00 tot 17:00"
              description="Er is zondag weer chiro! Voor de keti's en aspi's zoals gebruikelijk tot 18u."
            />
            <EventCard
              title="Chiro"
              date="Zondag 16 juni 2024"
              time="14:00 tot 17:00"
              description="Er is zondag weer chiro! Voor de keti's en aspi's zoals gebruikelijk tot 18u."
            />
            <EventCard
              title="Chiro"
              date="Zondag 23 juni 2024"
              time="14:00 tot 17:00"
              description="Er is zondag weer chiro! Voor de keti's en aspi's zoals gebruikelijk tot 18u."
            />
          </div>
          <Button asChild className="w-fit">
            <Link href="/kalender.jpg">Bekijk de volledige kalender</Link>
          </Button>
        </div>
      </section>

      <section id="nieuws-updates" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Nieuws en Updates</h2>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <NewsCard
              title="Inschrijven groepsuitstap"
              date="23 mei 2024"
              description="Zondag 30 juni gaan we met de voltallige groep naar Plopsaland De Panne. Schrijf je snel in!"
              link="https://forms.gle/k7WxEpTYWiTXS2Zv9"
              linkText="Inschrijven"
            />
            <NewsCard
              title="Foto's voetbalcompetitie"
              date="11 mei 2024"
              description="De foto's van voetbalcompetite staan online! Bekijk ze snel."
              link="https://www.facebook.com/media/set/?set=a.846689867485055&type=3"
              linkText="Bekijk de foto's op Facebook"
            />
            <NewsCard
              title="Kaarten Chirocafé uitverkocht"
              date="6 mei 2024"
              description="De kaarten voor de kip en friet zijn uitverkocht, dankuwel voor jullie steun en tot donderdag!"
            />
          </div>
          {/* <Button asChild className="w-fit">
            <Link href="/kalender">Lees al het nieuws</Link>
          </Button> */}
        </div>
      </section>
      <section id="leeftijdsgroepen" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Leeftijdsgroepen</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AgeGroupCard
            image={ribbelsImage}
            title="Ribbels"
            description="De Ribbels zijn onze jongste leden (3de kleuter, 1ste en 2de leerjaar). Ze beleven elke week plezier aan spelletjes, knutselen en andere leuke activiteiten."
            link="/leeftijdsgroepen/ribbels"
          />
          <AgeGroupCard
            image={speelclubImage}
            title="Speelclub"
            description="De Speelclub is er voor kinderen van het 3de en 4de leerjaar. Ze spelen graag buiten, maken nieuwe vriendjes en beleven dolle avonturen."
            link="/leeftijdsgroepen/speelclub"
          />
          <AgeGroupCard
            image={kwiksImage}
            title="Kwiks"
            description="De Kwiks zijn onze stoere meiden van het 5de en 6de leerjaar. Ze houden van actie, avontuur en creativiteit."
            link="/leeftijdsgroepen/kwiks"
          />
          <AgeGroupCard
            image={rakkersImage}
            title="Rakkers"
            description="De Rakkers zijn onze coole jongens van het 5de en 6de leerjaar. Ze zijn altijd in voor een uitdaging en maken er graag een dolle boel van."
            link="/leeftijdsgroepen/rakkers"
          />
          <AgeGroupCard
            image={titosImage}
            title="Tito's"
            description="De Tito's zijn onze tieners van het 1ste en 2de middelbaar. Ze zijn op zoek naar avontuur, plezier en nieuwe ervaringen."
            link="/leeftijdsgroepen/titos"
          />
          <AgeGroupCard
            image={kerelsImage}
            title="Kerels"
            description="De Kerels zijn onze stoere kerels van het 3de en 4de middelbaar. Ze houden van uitdagingen, avontuur en kameraadschap."
            link="/leeftijdsgroepen/kerels"
          />
          <AgeGroupCard
            image={tiptiensImage}
            title="Tip-10's"
            description="De Tip-10's zijn onze fantastische meiden van het 3de en 4de middelbaar. Ze zijn creatief, sociaal en staan open voor nieuwe dingen."
            link="/leeftijdsgroepen/tiptiens"
          />
          <AgeGroupCard
            image={aspisImage}
            title="Aspi's"
            description="De Aspi's zijn onze oudste leden (5de middelbaar). Ze zijn verantwoordelijk, behulpzaam en zetten zich graag in voor de Chiro."
            link="/leeftijdsgroepen/aspis"
          />
        </div>
      </section>

      <SponsorsSection />
    </>
  );
}
