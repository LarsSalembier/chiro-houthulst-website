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
import { Button, Link } from "@heroui/react";

const MEMBER_COUNT = 150;
const LEADER_COUNT = 26;

const events: Event[] = [
  {
    title: "Chironamiddag",
    date: new Date("2025-03-23"),
    location: "Chiroheem",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxWcz6EUKtCqYzi3O4MHg1EXoT5U9vkldDnSej",
  },
  {
    title: "Chironamiddag",
    date: new Date("2025-03-30"),
    location: "Chiroheem",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxtWwOaA4pCQiSz4dKhcN86bWYIM7Fn2Au9lvD",
  },
  {
    title: "Chironamiddag",
    date: new Date("2025-04-06"),
    location: "Chiroheem",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxRHsihiRMwjXNhILV7B2sObk6Qv8MtegdHZxm",
  },
  {
    title: "Chironamiddag",
    date: new Date("2025-04-27"),
    location: "Chiroheem",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxV99l7dZRdA0O8vCVJBplHYafngu5DrWQjSq6",
  },
  {
    title: "Voetbalcompetitie",
    date: new Date("2025-05-01"),
    location: "Vrijetijdscampus Houthulst",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxkma0GmeG3xVfnFN2ULq8KbrpuCIhaBwX5v6t",
  },
  {
    title: "Chironamiddag",
    date: new Date("2025-05-04"),
    location: "Chiroheem",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxeZW8o6STBf9tzw1Y8AXr75mbV0Olok3EcGxd",
  },
  {
    title: "Chironamiddag",
    date: new Date("2025-05-18"),
    location: "Chiroheem",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxJg8MIXEVk2XoiFmSbQ9WCwBvZfs6YH4hPl3R",
  },
  {
    title: "Chironamiddag",
    date: new Date("2025-05-25"),
    location: "Chiroheem",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOx6pLe0TfYEVRTYsWdzytQDUr1jawq7mnNLI2C",
  },
  {
    title: "Chirocafé en kip met frietjes",
    date: new Date("2025-05-29"),
    location: "Markt Houthulst",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxkma0GmeG3xVfnFN2ULq8KbrpuCIhaBwX5v6t",
  },
  {
    title: "Chironamiddag",
    date: new Date("2025-06-15"),
    location: "Chiroheem",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOx6pf3r8PYEVRTYsWdzytQDUr1jawq7mnNLI2C",
  },
  {
    title: "Chironamiddag",
    date: new Date("2025-06-22"),
    location: "Chiroheem",
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxRFAwh7MwjXNhILV7B2sObk6Qv8MtegdHZxmR",
  },
  {
    title: "Groepsuitstap",
    date: new Date("2025-06-29"),
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxZV0BvNWcs7NMztbL2UP6yoa8wfTeguH3lmCn",
  },
  {
    title: "Vertrek KAMP!",
    date: new Date("2025-07-20"),
    src: "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxxYCc1kwdCYVMAq9142X6cluvFs7kPGpI8jDZ",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection
        id="welkom"
        title="Welkom bij Chiro Houthulst"
        subtitle="De Chiro is een jeugdbeweging voor jongens en meisjes van 6 tot 18 jaar. Elke zondag van 14u tot 17u is er Chiro in Houthulst. Kom zeker eens langs!"
        stats={{
          leden: MEMBER_COUNT,
          leiding: LEADER_COUNT,
        }}
      />
      <Section title="Kalender" id="kalender">
        <Carousel
          items={events}
          renderItem={(event, index) => (
            <EventCard event={event} index={index} />
          )}
          cardWidth={320}
          cardGap={16}
        />
      </Section>
      <SplitSection>
        <AsideImage
          src="https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxaBH6J4oXDhskiH8OxmF37l2ceQIw5LuRqYWZ"
          alt="Openingsformatie van de Chiro"
          width={480}
          height={250}
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
          <p id="kamp">
            Ben je nieuwsgierig en wil je eens proeven van de Chiro? Kom gerust
            een kijkje nemen op zondag. Iedereen is welkom, of je nu voor de
            eerste keer komt of al jaren meedraait!
          </p>
        </BlogText>
      </SplitSection>
      <SplitSection>
        <BlogText>
          <h2>Kamp</h2>
          <p id="inschrijven">
            Elk jaar gaan we op kamp van 20 t.e.m. 30 juli. Als je mee wil op
            kamp, vragen we je om tijdens het jaar minstens vijf keer naar de
            Chiro te komen (en liefst zo vaak mogelijk). Zo kunnen de leiding en
            medeleden je beter leren kennen.
          </p>
        </BlogText>
        <AsideImage
          src="https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxgePVg0rqKXTNnk8OeDP5t9HQuFpmAbJi6vla"
          alt="Een optreden van de leden bij het kampvuur"
          width={480}
          height={250}
          className="w-[400px] xl:w-[500px]"
          side="right"
        />
      </SplitSection>
      <SplitSection>
        <AsideImage
          src="https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxfzT7N1nsk5mUnuYoVwLhe9EtXTpIW3KqxRFi"
          alt="Groepfoto van de leidingsploeg"
          width={480}
          height={250}
          className="w-[400px] xl:w-[500px]"
          side="left"
        />
        <BlogText>
          <h2>Inschrijven</h2>
          <p id="uniform">
            Inschrijven in de Chiro kost €40 en kan elke zondag bij de leiding.
            Zo zijn jullie ook verzekerd. Je kan altijd eens de Chiro komen
            uittesten, inschrijven is niet verplicht vanaf de eerste zondag!
          </p>
        </BlogText>
      </SplitSection>
      <SplitSection>
        <BlogText>
          <h2>Uniform</h2>
          <p>
            Het Chiro-uniform is te koop via{" "}
            <Link
              className="text-base lg:text-xl"
              href="https://www.debanier.be/"
              isExternal
              showAnchorIcon
            >
              de Banier
            </Link>
            (dichtste winkel: Roeselare). Vanaf de Rakwi&apos;s is een uniform
            verplicht. Naast het officiële uniform verkopen wij ook onze eigen
            t-shirts. Deze zijn elke zondag te koop bij de leiding voor €20.
          </p>
        </BlogText>
        <AsideImage
          src="https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxtyWF1i4pCQiSz4dKhcN86bWYIM7Fn2Au9lvD"
          alt="De leiding schept eten uit op ons spaghettifestijn Al Denté"
          width={480}
          height={250}
          className="w-[400px] xl:w-[500px]"
          side="right"
        />
      </SplitSection>
      <SplitSection>
        <AsideImage
          src="https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOx1OomRMbaMohK9l85AX37ruCBUmRDENkbQaYO"
          alt="Openingsformatie van de Chiro"
          width={480}
          height={250}
          className="w-[400px] xl:w-[500px]"
          side="left"
        />
        <BlogText>
          <h2>Verzekering</h2>
          <p>
            Iedereen die is ingeschreven in de Chiro is verzekerd. De
            verzekering dekt de kosten van een ongeval tijdens de
            Chiro-activiteiten. Ook als je op weg bent naar de Chiro of naar
            huis, ben je verzekerd.
          </p>
          <Button
            as={Link}
            variant="solid"
            showAnchorIcon
            className="not-prose"
            size="lg"
          >
            Lees meer over de Chiroverzekering
          </Button>
        </BlogText>
      </SplitSection>
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
