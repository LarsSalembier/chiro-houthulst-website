import { generateMetadata } from "~/lib/generate-metadata";
import { Navbar } from "./_components/navbar";
import Image from "next/image";

export const metadata = generateMetadata({
  title: "Home",
});

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar
        imageUrl="/kampgroepsfoto.jpg"
        imageAlt="Groepsfoto Kamp"
        title="Chiro Houthulst"
      />
      <main className="sm: flex max-w-7xl flex-grow flex-col justify-center gap-8 p-8 pt-16 sm:gap-16 sm:p-16 sm:pt-24 md:p-24">
        <h1 className="w-full bg-clip-text font-sans text-5xl font-bold md:text-6xl">
          Welkom bij Chiro Houthulst!
        </h1>
        <section className="flex w-full max-w-4xl flex-col gap-4 sm:gap-8 ">
          <article className="mb-8">
            <h2 className="mb-4 font-sans text-3xl font-bold">Wie zijn wij?</h2>
            <p className="text-lg">
              De Chiro is de grootste jeugdbeweging van België. We brengen
              kinderen en jongeren samen, zonder onderscheid, en laten hen via
              spel ervaringen opdoen, samenleven en een kijk op zichzelf en de
              wereld ontwikkelen. We zijn een leerschool voor het leven en
              streven naar een Chirodroom: een wereld waarin waarden zoals graag
              zien, rechtvaardigheid en innerlijkheid centraal staan.
            </p>
          </article>
          <article className="mb-8">
            <h2 className="mb-4 font-sans text-3xl font-bold">Wat doen wij?</h2>
            <p className="text-lg">
              Elke zondag organiseren wij een Chironamiddag. We spelen dan
              spelletjes en doen activiteiten met de kinderen. Zo leren ze
              nieuwe vrienden kennen en kunnen ze zich uitleven. In de zomer
              gaan we ook op kamp. Dan trekken we met alle leden en leiding tien
              dagen weg. We slapen in tenten, koken ons eigen potje en spelen de
              hele dag door spelletjes. Kortom, het is een week vol plezier en
              avontuur!
            </p>
          </article>
          <article className="mb-8">
            <h2 className="mb-4 font-sans text-3xl font-bold">
              Praktische info
            </h2>
            <section className="mb-8">
              <h3 className="mb-2 font-sans text-2xl">Leeftijdsgroepen</h3>
              <ul className="list-disc pl-4">
                <li>Ribbels: 3de kleuter, 1ste en 2de leerjaar</li>
                <li>Speelclub: 3de en 4de leerjaar</li>
                <li>Kwiks: meisjes 5de en 6de leerjaar</li>
                <li>Rakkers: jongens 5de en 6de leerjaar</li>
                <li>Tito&apos;s: 1ste en 2e middelbaar</li>
                <li>Kerels: jongens 3e en 4e middelbaar</li>
                <li>Tip-10&apos;s: meisjes 3e en 4e middelbaar</li>
                <li>Aspi&apos;s: 5e middelbaar</li>
              </ul>
            </section>
            <section className="mb-8">
              <h3 className="mb-2 font-sans text-2xl">Zondag</h3>
              <p className="text-lg">
                Elke zondag is er Chiro van 14u tot 17u in ons Chiroheem
                (Jonkershovestraat 101S). De keti&apos;s en aspi&apos;s hebben
                een uurtje langer Chiro, tot 18u. Tijdens de Chironamiddag
                voorzien wij een vieruurtje voor €1. Als je liever je eigen
                drankje en koekje meebrengt, is dat ook geen probleem.
              </p>
            </section>
            <section className="mb-8">
              <h3 className="mb-2 font-sans text-2xl">Kamp</h3>
              <p className="text-lg">
                Elk jaar gaan we op kamp van 20 t.e.m. 30 juli. De aspi&apos;s
                gaan mee op nawacht tot 31 juli. Als je mee wil op kamp, vragen
                we je om tijdens het jaar minstens vijf keer naar de Chiro te
                komen (en liefst zo vaak mogelijk). Zo kunnen de leiding en
                medeleden je beter leren kennen.
              </p>
            </section>
            <section className="mb-8">
              <h3 className="mb-2 font-sans text-2xl">Inschrijving</h3>
              <p className="text-lg">
                Inschrijven in de Chiro kost €30 en kan elke zondag bij de
                leiding. Zo zijn jullie kinderen ook verzekerd.
              </p>
            </section>
          </article>
          <article className="mb-8 w-full">
            <h2 className="mb-4 font-sans text-3xl font-bold" id="kalender">
              Kalender
            </h2>
            <Image
              src="/kalender.jpg"
              alt="Kalender"
              width={1000}
              height={400}
            />
          </article>
        </section>
      </main>
    </div>
  );
}
