import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { generateMetadata } from "~/lib/generate-metadata";
import Image from "next/image";
import ribbelsImage from "./../../public/groepen/ribbels.png";
import speelclubImage from "./../../public/groepen/speelclub.png";
import kwiksImage from "./../../public/groepen/kwiks.png";
import rakkersImage from "./../../public/groepen/rakkers.png";
import titosImage from "./../../public/groepen/titos.png";
import kerelsImage from "./../../public/groepen/kerels.png";
import tiptiensImage from "./../../public/groepen/tip10s.png";
import aspisImage from "./../../public/groepen/aspis.png";
import mainImage from "./../../public/kampgroepsfoto.png";
import sponsor1 from "./../../public/sponsors/1.png";
import sponsor2 from "./../../public/sponsors/2.png";
import sponsor3 from "./../../public/sponsors/3.png";
import sponsor4 from "./../../public/sponsors/4.png";
import sponsor5 from "./../../public/sponsors/5.png";
import sponsor6 from "./../../public/sponsors/6.png";
import sponsor7 from "./../../public/sponsors/7.png";
import sponsor8 from "./../../public/sponsors/8.png";
import sponsor9 from "./../../public/sponsors/9.png";
import sponsor10 from "./../../public/sponsors/10.png";
import sponsor11 from "./../../public/sponsors/11.png";
import sponsor12 from "./../../public/sponsors/12.png";
import { InfiniteMovingCards } from "~/components/ui/infinite-moving-cards";
import EventCard from "./_components/event-card";
import NewsCard from "./_components/news-card";
import AgeGroupCard from "./_components/age-group-card";
import InstagramIcon from "./_components/icons/instagram";
import FacebookIcon from "./_components/icons/facebook";
import Link from "next/link";
import { Textarea } from "~/components/ui/textarea";
import MobileNavSheet from "./_components/mobile-nav-sheet";
import SearchBar from "./_components/search-bar";

export const metadata = generateMetadata({
  title: "Home",
});

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col gap-8">
      <header className="sticky top-0 z-50 w-full bg-card shadow-md">
        <div className="container flex flex-row items-center justify-between px-6 py-4 md:px-12 lg:px-24">
          <a href="/">
            <Image
              src="/logo-black.svg"
              alt="Chiro Houthulst Logo"
              className="h-12"
              width={64}
              height={64}
            />
          </a>
          <div className="flex flex-row gap-4">
            <SearchBar />
            <MobileNavSheet />
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-grow px-6 pb-8 md:px-12 lg:px-24">
        <section id="welkom" className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={mainImage}
              alt="Chiro kinderen spelen"
              className="h-full w-full rounded-3xl object-cover"
              placeholder="blur"
            />
            <div
              className="z-1 absolute left-0 top-0 h-full w-full rounded-3xl backdrop-brightness-50"
              aria-hidden="true"
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8 lg:py-48">
            <div className="grid max-w-3xl grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="z-10 lg:col-span-2">
                <h1 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl">
                  Welkom bij Chiro Houthulst!
                </h1>
                <p className="text-lg leading-relaxed text-primary-foreground">
                  De Chiro is de grootste jeugdbeweging van België. We brengen
                  kinderen en jongeren samen, zonder onderscheid, en laten hen
                  via spel ervaringen opdoen, samenleven en een kijk op zichzelf
                  en de wereld ontwikkelen.
                </p>
              </div>
              <div className="lg:col-span-1"></div>
            </div>
          </div>
        </section>

        <section id="praktisch" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Praktisch</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <h3 className="mb-2 text-xl font-bold">Zondag</h3>
              <p className="text-gray-800">
                {/* Zeer beknopte info over de Chirozondag */}
                Elke zondag is er Chiro van 14u tot 17u in ons Chiroheem
                (Jonkershovestraat 101S). Tijdens de Chironamiddag voorzien wij
                een vieruurtje voor €1. Als je liever je eigen drankje en koekje
                meebrengt, is dat ook geen probleem.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold">Kamp</h3>
              <p className="text-gray-800">
                {/* Zeer beknopte info over het kamp */}
                Elk jaar gaan we op kamp van 20 t.e.m. 30 juli. Als je mee wil
                op kamp, vragen we je om tijdens het jaar minstens vijf keer
                naar de Chiro te komen (en liefst zo vaak mogelijk). Zo kunnen
                de leiding en medeleden je beter leren kennen.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="mb-2 text-xl font-bold">Inschrijving</h3>
                <p className="text-gray-800">
                  {/* Zeer beknopte info over de inschrijvingen */}
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

        <section
          id="aankomende-evenementen"
          className="mb-8 flex flex-col gap-6"
        >
          <div>
            <h2 className="mb-4 text-2xl font-bold">Aankomende activiteiten</h2>
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
          </div>
          <Button asChild className="w-fit">
            <Link href="/kalender.jpg">Bekijk de volledige kalender</Link>
          </Button>
        </section>

        <section id="nieuws-updates" className="mb-8 flex flex-col gap-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">Nieuws en Updates</h2>
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
          </div>
          {/* <Button asChild className="w-fit">
            <Link href="/kalender">Lees al het nieuws</Link>
          </Button> */}
        </section>
        <section id="leeftijdsgroepen" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Leeftijdsgroepen</h2>
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

        <section id="sponsors" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Onze sponsors</h2>
          <p className="mb-4 text-gray-800">
            Wij zijn dankbaar voor de steun van onze sponsors. Dankzij hen
            kunnen we onze activiteiten organiseren en onze leden een
            onvergetelijke tijd bezorgen.
          </p>
          <InfiniteMovingCards
            speed="slow"
            items={[
              {
                url: "/sponsor/1",
                staticImage: sponsor1,
                alt: "Logo Sponsor 1",
              },
              {
                url: "/sponsor/2",
                staticImage: sponsor2,
                alt: "Logo Sponsor 2",
              },
              {
                url: "/sponsor/3",
                staticImage: sponsor3,
                alt: "Logo Sponsor 3",
              },
              {
                url: "/sponsor/4",
                staticImage: sponsor4,
                alt: "Logo Sponsor 4",
              },
              {
                url: "/sponsor/5",
                staticImage: sponsor5,
                alt: "Logo Sponsor 5",
              },
              {
                url: "/sponsor/6",
                staticImage: sponsor6,
                alt: "Logo Sponsor 6",
              },
              {
                url: "/sponsor/7",
                staticImage: sponsor7,
                alt: "Logo Sponsor 7",
              },
              {
                url: "/sponsor/8",
                staticImage: sponsor8,
                alt: "Logo Sponsor 8",
              },
              {
                url: "/sponsor/9",
                staticImage: sponsor9,
                alt: "Logo Sponsor 9",
              },
              {
                url: "/sponsor/10",
                staticImage: sponsor10,
                alt: "Logo Sponsor 10",
              },
              {
                url: "/sponsor/11",
                staticImage: sponsor11,
                alt: "Logo Sponsor 11",
              },
              {
                url: "/sponsor/12",
                staticImage: sponsor12,
                alt: "Logo Sponsor 12",
              },
            ]}
          />
        </section>
      </main>
      <footer
        className="w-full bg-card text-card-foreground"
        role="contentinfo"
      >
        <div className="container flex flex-col items-center gap-8 px-6 py-8 md:px-12 lg:px-24">
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4">
                <h4 className="mb-4 text-lg font-bold">Chiro Houthulst</h4>
                <p>
                  Jonkershovestraat 101S
                  <br />
                  8650 Houthulst
                </p>
                <p className="mt-4">
                  chirohouthulst@hotmail.com
                  <br />
                  +0468 30 06 64
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-lg font-bold">Volg ons</h4>
                <div className="flex space-x-6">
                  <Link href="https://www.facebook.com/chirohouthulst">
                    <FacebookIcon />
                  </Link>
                  <Link href="https://www.instagram.com/chirohouthulst">
                    <InstagramIcon />
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-bold" id="contacteer-ons">
                Contacteer ons
              </h4>
              <form action="#" method="POST">
                <div className="mb-4">
                  <label htmlFor="naam" className="mb-2 block">
                    Naam:
                  </label>
                  <Input type="text" id="naam" name="naam" />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="mb-2 block">
                    Email:
                  </label>
                  <Input type="email" id="email" name="email" />
                </div>
                <div className="mb-4">
                  <label htmlFor="bericht" className="mb-2 block">
                    Bericht:
                  </label>
                  <Textarea id="bericht" name="bericht" rows={4}></Textarea>
                </div>
                <Button type="submit" disabled>
                  Verzenden
                </Button>
                <p>
                  Dit contactformulier werkt nog niet. Contacteer ons via onze{" "}
                  <Link
                    href="https://facebook.com/chirohouthulst"
                    className="underline"
                  >
                    Facebookpagina
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
          <p className="text-sm text-gray-500">© 2024 Chiro Houthulst</p>
        </div>
      </footer>
    </div>
  );
}
