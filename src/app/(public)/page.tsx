import { Button } from "~/components/ui/button";
import ribbelsImage from "~/../public/groepen/ribbels.png";
import speelclubImage from "~/../public/groepen/speelclub.png";
import kwiksImage from "~/../public/groepen/kwiks.png";
import rakkersImage from "~/../public/groepen/rakkers.png";
import titosImage from "~/../public/groepen/titos.png";
import kerelsImage from "~/../public/groepen/kerels.png";
import tiptiensImage from "~/../public/groepen/tip10s.png";
import aspisImage from "~/../public/groepen/aspis.png";
import { Grid } from "~/components/grid";
import { FormattedLink } from "~/components/typography/links";
import {
  HeroSection,
  HeroSectionDescription,
  HeroSectionTitle,
} from "./hero-section";
import mainImage from "~/../public/kampgroepsfoto.png";
import { Section, SectionContent, SectionTitle } from "~/components/section";
import {
  Subsection,
  SubsectionContent,
  SubsectionFooter,
  SubsectionTitle,
} from "~/components/subsection";
import { SignedIn } from "@clerk/nextjs";
import { Suspense } from "react";
import SponsorRow from "./_sponsors/sponsor-row";
import Link from "next/link";
import NewsCard from "./news-card";
import AgeGroupCard from "./age-group-card";
import AddSponsorButton from "./_sponsors/add-sponsor-button";
import { Paragraph } from "~/components/typography/text";
import { isLeiding } from "~/lib/auth";
import UpcomingEvents from "./_upcoming-events/upcoming-events";
import LoadingUpcomingEvents from "./_upcoming-events/loading-upcoming-events";

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
    <div className="container relative flex flex-col gap-12">
      <HeroSection src={mainImage} alt="Groepsfoto Chiro Houthulst">
        <HeroSectionTitle>Welkom bij Chiro Houthulst!</HeroSectionTitle>
        <HeroSectionDescription>
          De Chiro is de grootste jeugdbeweging van België. We brengen kinderen
          en jongeren samen, zonder onderscheid, en laten hen via spel
          ervaringen opdoen, samenleven en een kijk op zichzelf en de wereld
          ontwikkelen.
        </HeroSectionDescription>
      </HeroSection>

      <Section id="praktisch">
        <SectionTitle>Praktisch</SectionTitle>
        <SectionContent>
          <Grid>
            <Subsection id="zondag">
              <SubsectionTitle>Zondag</SubsectionTitle>
              <SubsectionContent>
                <Paragraph>
                  Elke zondag is er Chiro van 14u tot 17u in ons Chiroheem
                  (Jonkershovestraat 101S). Tijdens de Chironamiddag voorzien
                  wij een vieruurtje voor €1. Als je liever je eigen drankje en
                  koekje meebrengt, is dat ook geen probleem.
                </Paragraph>
              </SubsectionContent>
            </Subsection>
            <Subsection id="kamp">
              <SubsectionTitle>Kamp</SubsectionTitle>
              <SubsectionContent>
                <Paragraph>
                  Elk jaar gaan we op kamp van 20 t.e.m. 30 juli. Als je mee wil
                  op kamp, vragen we je om tijdens het jaar minstens vijf keer
                  naar de Chiro te komen (en liefst zo vaak mogelijk). Zo kunnen
                  de leiding en medeleden je beter leren kennen.
                </Paragraph>
              </SubsectionContent>
            </Subsection>
            <Subsection id="inschrijving">
              <SubsectionTitle>Inschrijving</SubsectionTitle>
              <SubsectionContent>
                <Paragraph>
                  Inschrijven in de Chiro kost €30 en kan elke zondag bij de
                  leiding. Zo zijn jullie ook verzekerd. Je kan altijd eens de
                  Chiro komen uittesten, inschrijven is niet verplicht vanaf de
                  eerste zondag!
                </Paragraph>
              </SubsectionContent>
            </Subsection>
            <Subsection id="uniform">
              <SubsectionTitle>Uniform</SubsectionTitle>
              <SubsectionContent>
                <Paragraph>
                  Het Chiro-uniform is te koop in{" "}
                  <FormattedLink href="https://www.debanier.be/">
                    de Banier
                  </FormattedLink>{" "}
                  (dichtste vestiging: Roeselare). Vanaf de Rakwi&apos;s is een
                  uniform verplicht. Naast het officiële uniform verkopen wij
                  ook onze eigen Chiro Houthulst-T-shirts. Deze zijn elke zondag
                  te koop bij de leiding voor €10.
                </Paragraph>
              </SubsectionContent>
            </Subsection>
            <Subsection id="verzekering">
              <SubsectionTitle>Verzekering</SubsectionTitle>
              <SubsectionContent>
                <Paragraph>
                  Iedereen die is ingeschreven in de Chiro is verzekerd. De
                  verzekering dekt de kosten van een ongeval tijdens de
                  Chiro-activiteiten. Ook als je op weg bent naar de Chiro of
                  naar huis, ben je verzekerd.
                </Paragraph>
              </SubsectionContent>
              <SubsectionFooter>
                <Button asChild className="w-fit">
                  <Link href="/verzekeringen">
                    Wat moet je doen bij een ongeval?
                  </Link>
                </Button>
              </SubsectionFooter>
            </Subsection>
          </Grid>
        </SectionContent>
      </Section>

      <Suspense fallback={<LoadingUpcomingEvents />}>
        <UpcomingEvents />
      </Suspense>

      <Section id="nieuws-updates">
        <SectionTitle>Nieuws en Updates</SectionTitle>
        <SectionContent>
          <Grid>
            {recentNews.map((newsItem) => (
              <NewsCard {...newsItem} key={newsItem.key} />
            ))}
          </Grid>
        </SectionContent>
      </Section>

      <Section id="afdelingen">
        <SectionTitle>Afdelingen</SectionTitle>
        <SectionContent>
          <Grid>
            {ageGroups.map((group) => (
              <AgeGroupCard {...group} key={group.key} />
            ))}
          </Grid>
        </SectionContent>
      </Section>

      <Section id="sponsors">
        <SectionTitle>Sponsors</SectionTitle>
        <SectionContent>
          <Paragraph>
            Wij zijn dankbaar voor de steun van onze sponsors. Dankzij hen
            kunnen we onze activiteiten organiseren en onze leden een
            onvergetelijke tijd bezorgen. Zelf sponsor worden? Neem gerust
            contact op met onze hoofdleiding.
          </Paragraph>
          <Suspense fallback={null}>
            <SignedIn>{isLeiding() && <AddSponsorButton />}</SignedIn>
          </Suspense>

          <Suspense fallback={<div>Sponsors laden...</div>}>
            <div className="flex flex-col">
              <SponsorRow direction="right" minAmount={101} maxAmount={10000} />
              <SponsorRow direction="left" minAmount={51} maxAmount={100} />
              <SponsorRow direction="right" minAmount={0} maxAmount={50} />
            </div>
          </Suspense>
        </SectionContent>
      </Section>
    </div>
  );
}
