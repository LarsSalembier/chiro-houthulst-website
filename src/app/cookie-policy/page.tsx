import { type Metadata } from "next";
import BlogText from "~/components/ui/blog-text";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Lees hier hoe Chiro Houthulst omgaat met cookies op de website.",
};

export default function CookiePolicy() {
  return (
    <BlogText className="mx-auto pt-16">
      <h1>Cookie Policy</h1>
      <p>Laatst bijgewerkt op 21 maart 2025</p>
      <p>
        Deze cookie policy legt uit hoe Chiro Sint-Jan Houthulst cookies
        gebruikt op deze website. We gebruiken cookies om uw ervaring op onze
        website te verbeteren en om bepaalde functionaliteiten mogelijk te
        maken.
      </p>

      <h2>Wat zijn cookies?</h2>
      <p>
        Cookies zijn kleine tekstbestanden die op uw computer of mobiele
        apparaat worden opgeslagen wanneer u onze website bezoekt. Deze
        bestanden helpen ons om uw voorkeuren te onthouden en de website te
        verbeteren.
      </p>

      <h2>Welke cookies gebruiken wij?</h2>
      <h3>Noodzakelijke cookies</h3>
      <p>
        Deze cookies zijn essentieel voor het functioneren van de website. Ze
        onthouden bijvoorbeeld uw thema-instellingen en zorgen ervoor dat de
        website correct werkt. Deze cookies verzamelen geen persoonlijke
        informatie.
      </p>

      <h3>Analytische cookies</h3>
      <p>
        We gebruiken Posthog om te begrijpen hoe bezoekers onze website
        gebruiken. Deze cookies verzamelen anonieme informatie over het aantal
        bezoekers, welke pagina&apos;s het meest worden bekeken en hoe lang
        bezoekers op de website blijven.
      </p>

      <h3>Functionele cookies</h3>
      <p>
        Deze cookies onthouden uw voorkeuren en instellingen, zoals uw
        thema-instellingen. Ze maken het mogelijk om de website persoonlijker te
        maken.
      </p>

      <h2>Hoe kunt u cookies beheren?</h2>
      <p>
        U kunt uw browserinstellingen aanpassen om cookies te verwijderen of te
        blokkeren. Let wel op dat het blokkeren van bepaalde cookies kan
        betekenen dat sommige functionaliteiten van onze website niet meer
        beschikbaar zijn.
      </p>

      <h2>Updates van deze cookie policy</h2>
      <p>
        We behouden ons het recht voor om deze cookie policy aan te passen. We
        raden u aan om deze pagina regelmatig te bezoeken om op de hoogte te
        blijven van eventuele wijzigingen.
      </p>

      <h2>Contact</h2>
      <p>
        Heeft u vragen over ons gebruik van cookies? Neem dan contact met ons op
        via de contactgegevens onderaan deze pagina.
      </p>
    </BlogText>
  );
}
