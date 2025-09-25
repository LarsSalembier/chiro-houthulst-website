import AsideImage from "~/components/ui/aside-image";
import BlogText from "~/components/ui/blog-text";
import SplitSection from "~/components/ui/split-section";
import HeroSection from "~/features/home/hero-section";
import Aside from "~/components/ui/aside";
import GoogleMapsMap from "~/features/home/google-maps-map";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { getUpcomingEvents } from "./actions";
import { getCurrentMembershipFee, getSetting } from "./settings/actions";
// Define the database event type for the homepage
type DbEvent = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  coverImageUrl: string | null;
  facebookEventUrl: string | null;
  price: number | null;
  canSignUp: boolean;
  signUpDeadline: Date | null;
};
import type { Event } from "~/features/calendar/event";
import CalendarSection from "~/components/calendar/calendar-section";

const MEMBER_COUNT = 150;
const LEADER_COUNT = 25;

// Helper function to convert database event to display event
function convertDbEventToDisplayEvent(dbEvent: DbEvent): Event {
  return {
    title: dbEvent.title,
    date: dbEvent.startDate,
    location: dbEvent.location ?? undefined,
    price: dbEvent.price ?? undefined,
    canSignUp: dbEvent.canSignUp ?? undefined,
    facebookEventUrl: dbEvent.facebookEventUrl ?? undefined,
    src:
      dbEvent.coverImageUrl ??
      "https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxWcz6EUKtCqYzi3O4MHg1EXoT5U9vkldDnSej", // Default image
  };
}

export default async function Home() {
  const dbEvents = await getUpcomingEvents();
  const events: Event[] = dbEvents.map((dbEvent) =>
    convertDbEventToDisplayEvent(dbEvent as DbEvent),
  );
  const membershipFee = await getCurrentMembershipFee();
  const tshirtPrice = await getSetting("tshirt_price");
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
      <CalendarSection events={events} />
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
            Inschrijven in de Chiro kost €{membershipFee} en kan elke zondag bij
            de leiding. Zo zijn jullie ook verzekerd. Je kan altijd eens de
            Chiro komen uittesten, inschrijven is niet verplicht vanaf de eerste
            zondag!
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
            t-shirts. Deze zijn elke zondag te koop bij de leiding voor €
            {tshirtPrice ?? "20"}.
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
