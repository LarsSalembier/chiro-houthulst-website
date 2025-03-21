"use client";

import AsideImage from "~/components/ui/aside-image";
import BlogText from "~/components/ui/blog-text";
import SplitSection from "~/components/ui/split-section";
import HeroSection from "~/features/home/hero-section";
import type { Event } from "~/features/calendar/event";
import { Section } from "~/components/ui/section";
import { Carousel } from "~/components/ui/carousel";
import { EventCard } from "~/features/calendar/event-card";
import Aside from "~/components/ui/aside";
import GoogleMapsMap from "~/features/home/google-maps-map";

const MEMBER_COUNT = 150;
const LEADER_COUNT = 26;

const events: Event[] = [
  {
    title: "Afdelingsweekend Speelclub",
    date: new Date("2024-02-16"),
    location: "Jeugdverblijf De Karmel, Brugge",
    src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80",
  },
  {
    title: "Startdag Chiro",
    date: new Date("2024-09-15"),
    location: "Chirolokaal & Speelplein",
    src: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&q=80",
  },
  {
    title: "Spaghettiavond",
    date: new Date("2024-03-23"),
    location: "Parochiezaal",
    src: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&q=80",
  },
  {
    title: "Chirokamp 2024",
    date: new Date("2024-07-21"),
    location: "Kampplaats Westouter",
    src: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80",
  },
  {
    title: "Leidingsweekend",
    date: new Date("2024-04-19"),
    location: "De Hoge Rielen, Kasterlee",
    src: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?auto=format&fit=crop&q=80",
  },
  {
    title: "Groepsfeest",
    date: new Date("2024-05-25"),
    location: "Sporthal",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
  },
  {
    title: "Aspiweekend",
    date: new Date("2024-03-08"),
    location: "Jeugdverblijf Hoogstade",
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80",
  },
  {
    title: "Dia-avond Kamp",
    date: new Date("2024-09-28"),
    location: "Chirolokaal",
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection
        title="Welkom bij Chiro Houthulst"
        subtitle="De Chiro is een jeugdbeweging voor jongens en meisjes van 6 tot 18 jaar. Elke zondag van 14u tot 17u is er Chiro in Houthulst. Kom zeker eens langs!"
        stats={{
          leden: MEMBER_COUNT,
          leiding: LEADER_COUNT,
        }}
      />
      <SplitSection>
        <AsideImage
          src="https://utfs.io/f/9igZHUjyeBOxaBH6J4oXDhskiH8OxmF37l2ceQIw5LuRqYWZ"
          alt="Openingsformatie van de Chiro"
          width={490}
          height={259}
          className="w-[400px] xl:w-[500px]"
          side="left"
        />
        <BlogText>
          <h2>Chirozondagen</h2>
          <p>
            Elke zondag van 14u tot 17u komen we samen in de Chiro voor een
            middag vol spel, creativiteit en plezier. Onze enthousiaste leiding
            staat altijd klaar om de leukste activiteiten te organiseren,
            aangepast aan de verschillende leeftijden.
          </p>
          <p>
            Ben je nieuwsgierig en wil je eens proeven van de Chiro? Kom gerust
            een kijkje nemen op zondag. Iedereen is welkom, of je nu voor de
            eerste keer komt of al jaren meedraait!
          </p>
        </BlogText>
      </SplitSection>
      <Section title="Komende evenementen">
        <Carousel
          items={events}
          renderItem={(event, index) => (
            <EventCard event={event} index={index} />
          )}
          cardWidth={320}
          cardGap={16}
        />
      </Section>
      <SplitSection className="lg:pt-8">
        <BlogText>
          <h2>Waar vind je ons?</h2>
          <p>
            Ons Chiroheem bevindt zich in de Jonkershovestraat 101S in
            Houthulst. De ingang bevindt zich rechts van de Carrefour.
          </p>
        </BlogText>
        <Aside>
          <GoogleMapsMap searchQuery="Chiro Houthulst" />
        </Aside>
      </SplitSection>
    </>
  );
}
