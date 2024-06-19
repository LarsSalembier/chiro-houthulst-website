import { Button } from "~/components/ui/button";
import { generateMetadata } from "~/lib/generate-metadata";
import ribbelsImage from "~/../public/groepen/ribbels.png";
import speelclubImage from "~/../public/groepen/speelclub.png";
import kwiksImage from "~/../public/groepen/kwiks.png";
import rakkersImage from "~/../public/groepen/rakkers.png";
import titosImage from "~/../public/groepen/titos.png";
import kerelsImage from "~/../public/groepen/kerels.png";
import tiptiensImage from "~/../public/groepen/tip10s.png";
import aspisImage from "~/../public/groepen/aspis.png";
import EventCard from "./_components/page/event-card";
import NewsCard from "./_components/page/news-card";
import AgeGroupCard from "./_components/page/age-group-card";
import Link from "next/link";
import WelcomeSection from "./_components/page/welcome-section";
import GridSection from "./_components/page/grid-section";
import Paragraph from "./_components/page/paragraph";
import SponsorsSection from "./_components/page/sponsors/sponsors-section";

export const dynamic = "force-dynamic";

export const metadata = generateMetadata({
  title: "Home",
});

const upcomingEvents = [
  {
    key: "1",
    title: "Chiro",
    startDate: new Date("2024-06-09T14:00:00"),
    endDate: new Date("2024-06-09T17:00:00"),
    description:
      "Er is zondag weer chiro! Voor de keti's en aspi's zoals gebruikelijk tot 18u.",
  },
  {
    key: "2",
    title: "Chiro",
    startDate: new Date("2024-06-16T14:00:00"),
    endDate: new Date("2024-06-16T17:00:00"),
    description:
      "Er is zondag weer chiro! Voor de keti's en aspi's zoals gebruikelijk tot 18u.",
  },
  {
    key: "3",
    title: "Chiro",
    startDate: new Date("2024-06-23T14:00:00"),
    endDate: new Date("2024-06-23T17:00:00"),
    description:
      "Er is zondag weer chiro! Voor de keti's en aspi's zoals gebruikelijk tot 18u.",
  },
];

const recentNews = [
  {
    key: "1",
    title: "Inschrijven groepsuitstap",
    date: new Date("2024-05-23"),
    description:
      "Zondag 30 juni gaan we met de voltallige groep naar Plopsaland De Panne. Schrijf je snel in!",
    link: "https://forms.gle/k7WxEpTYWiTXS2Zv9",
    linkText: "Inschrijven",
  },
  {
    key: "2",
    title: "Foto's voetbalcompetitie",
    date: new Date("2024-05-11"),
    description: "De foto's van voetbalcompetite staan online! Bekijk ze snel.",
    link: "https://www.facebook.com/media/set/?set=a.846689867485055&type=3",
    linkText: "Bekijk de foto's op Facebook",
  },
  {
    key: "3",
    title: "Kaarten Chirocafé uitverkocht",
    date: new Date("2024-05-06"),
    description:
      "De kaarten voor de kip en friet zijn uitverkocht, dankuwel voor jullie steun en tot donderdag!",
  },
];

const ageGroups = [
  {
    key: "ribbels",
    image: ribbelsImage,
    title: "Ribbels",
    description:
      "De Ribbels zijn onze jongste leden (3de kleuter, 1ste en 2de leerjaar). Ze beleven elke week plezier aan spelletjes, knutselen en andere leuke activiteiten.",
    link: "/groepen/ribbels",
  },
  {
    key: "speelclub",
    image: speelclubImage,
    title: "Speelclub",
    description:
      "De Speelclub is er voor kinderen van het 3de en 4de leerjaar. Ze spelen graag buiten, maken nieuwe vriendjes en beleven dolle avonturen.",
    link: "/groepen/speelclub",
  },
  {
    key: "kwiks",
    image: kwiksImage,
    title: "Kwiks",
    description:
      "De Kwiks zijn onze stoere meiden van het 5de en 6de leerjaar. Ze houden van actie, avontuur en creativiteit.",
    link: "/groepen/kwiks",
  },
  {
    key: "rakkers",
    image: rakkersImage,
    title: "Rakkers",
    description:
      "De Rakkers zijn onze coole jongens van het 5de en 6de leerjaar. Ze zijn altijd in voor een uitdaging en maken er graag een dolle boel van.",
    link: "/groepen/rakkers",
  },
  {
    key: "titos",
    image: titosImage,
    title: "Tito's",
    description:
      "De Tito's zijn onze tieners van het 1ste en 2de middelbaar. Ze zijn op zoek naar avontuur, plezier en nieuwe ervaringen.",
    link: "/groepen/titos",
  },
  {
    key: "kerels",
    image: kerelsImage,
    title: "Kerels",
    description:
      "De Kerels zijn onze stoere kerels van het 3de en 4de middelbaar. Ze houden van uitdagingen, avontuur en kameraadschap.",
    link: "/groepen/kerels",
  },
  {
    key: "tiptiens",
    image: tiptiensImage,
    title: "Tip-10's",
    description:
      "De Tip-10's zijn onze fantastische meiden van het 3de en 4de middelbaar. Ze zijn creatief, sociaal en staan open voor nieuwe dingen.",
    link: "/groepen/tiptiens",
  },
  {
    key: "aspis",
    image: aspisImage,
    title: "Aspi's",
    description:
      "De Aspi's zijn onze oudste leden (5de middelbaar). Ze zijn verantwoordelijk, behulpzaam en zetten zich graag in voor de Chiro.",
    link: "/groepen/aspis",
  },
];

export default function HomePage() {
  return (
    <>
      <WelcomeSection />

      <GridSection id="praktisch" title="Praktisch">
        <Paragraph key="zondag" title="Zondag">
          <p>
            Elke zondag is er Chiro van 14u tot 17u in ons Chiroheem
            (Jonkershovestraat 101S). Tijdens de Chironamiddag voorzien wij een
            vieruurtje voor €1. Als je liever je eigen drankje en koekje
            meebrengt, is dat ook geen probleem.
          </p>
        </Paragraph>
        <Paragraph key="kamp" title="Kamp">
          <p>
            Elk jaar gaan we op kamp van 20 t.e.m. 30 juli. Als je mee wil op
            kamp, vragen we je om tijdens het jaar minstens vijf keer naar de
            Chiro te komen (en liefst zo vaak mogelijk). Zo kunnen de leiding en
            medeleden je beter leren kennen.
          </p>
        </Paragraph>
        <Paragraph key="inschrijving" title="Inschrijving">
          <p>
            Inschrijven in de Chiro kost €30 en kan elke zondag bij de leiding.
            Zo zijn jullie ook verzekerd. Je kan altijd eens de Chiro komen
            uittesten, inschrijven is niet verplicht vanaf de eerste zondag!
          </p>
        </Paragraph>
        <Paragraph key="uniform" title="Uniform">
          <p>
            Het Chiro-uniform is te koop in{" "}
            <Link
              href="https://www.debanier.be/"
              className="text-primary underline"
            >
              de Banier
            </Link>{" "}
            (dichtste verstiging: Roeselare). Vanaf de Rakwi&apos;s is het
            dragen van het uniform verplicht op groepsuitstap en op kamp. Naast
            het officiële uniform verkopen wij ook onze eigen Chiro
            Houthulst-T-shirts. Deze zijn elke zondag te koop bij de leiding
            voor €10.
          </p>
        </Paragraph>
      </GridSection>

      <GridSection
        id="aankomende-evenementen"
        title="Aankomende activiteiten"
        footer={
          <Button asChild className="w-fit">
            <Link href="/kalender">Bekijk de volledige kalender</Link>
          </Button>
        }
      >
        {upcomingEvents.map((event) => (
          <EventCard
            key={event.key}
            title={event.title}
            startDate={event.startDate}
            endDate={event.endDate}
            description={event.description}
          />
        ))}
      </GridSection>

      <GridSection id="nieuws-updates" title="Nieuws en Updates">
        {recentNews.map((newsItem) => (
          <NewsCard
            key={newsItem.key}
            title={newsItem.title}
            date={newsItem.date}
            description={newsItem.description}
            link={newsItem.link}
            linkText={newsItem.linkText}
          />
        ))}
      </GridSection>

      <GridSection id="leeftijdsgroepen" title="Leeftijdsgroepen">
        {ageGroups.map((group) => (
          <AgeGroupCard
            key={group.key}
            image={group.image}
            title={group.title}
            description={group.description}
            link={group.link}
          />
        ))}
      </GridSection>
      <SponsorsSection />
    </>
  );
}
