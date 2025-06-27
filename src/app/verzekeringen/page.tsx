import { Link } from "@heroui/link";
import { type Metadata } from "next";
import DownloadIcon from "~/components/icons/download-icon";
import MailIcon from "~/components/icons/mail-icon";
import BlogText from "~/components/ui/blog-text";

export const metadata: Metadata = {
  title: "Verzekeringen",
  description:
    "Lees hier alles over hoe u verzekerd bent als lid of leiding van Chiro Sint-Jan Houthulst.",
};

export default function Verzekeringen() {
  return (
    <BlogText className="mx-auto pt-16">
      <h1>Verzekeringen</h1>

      <p>
        Hier vind je alle informatie over de verzekeringen van Chiro Sint-Jan
        Houthulst. Als je vragen hebt, aarzel dan niet om de hoofdleiding te
        contacteren.
      </p>

      <h2>Wanneer ben je verzekerd?</h2>

      <p>
        Chiro Sint-Jan Houthulst verzekert via Chirojeugd Vlaanderen alle leden,
        leiding en (tijdelijke) vrijwilligers. De verzekering dekt de kosten van
        een ongeval tijdens de Chiro-activiteiten. Ook onderweg van en naar elke
        chiro-activiteit ben je verzekerd. Dit geldt ook voor activiteiten die
        niet op zondag plaatsvinden, zoals weekends en kampen. Ook in het
        buitenland zijn we verzekerd.
      </p>

      <h2>Wat moeten ouders doen bij een ongeval?</h2>

      <ol>
        <li>
          Download dit{" "}
          <Link
            href="/Geneeskundig Attest Chiro 2022.pdf"
            className="inline-flex gap-1 text-base md:text-lg"
          >
            geneeskundig getuigschrift
            <DownloadIcon size={20} />
          </Link>{" "}
          en print het af.
        </li>

        <li>Laat de dokter het geneeskundig getuigschrift invullen.</li>

        <li>
          Geef het geneeskundig getuigschrift af aan de leiding, of stuur een
          scan van het getuigschrift naar{" "}
          <Link
            href="mailto:chirohouthulst@hotmail.com"
            className="inline-flex gap-1 text-base md:text-lg"
          >
            chirohouthulst@hotmail.com
            <MailIcon size={20} />
          </Link>{" "}
          met vermelding van de naam van het kind en wat er juist gebeurd is.
        </li>
      </ol>

      <h2>Wat is verzekerd?</h2>

      <h3>Ongevallen</h3>

      <p>
        Medische kosten die ontstaan door een ongeval tijdens, op weg van, of op
        weg naar de Chiro-activiteiten worden terugbetaald door de verzekering
        van Chirojeugd Vlaanderen.
      </p>

      <p>
        Opgelet: de verzekering dekt enkel de kosten die niet door de ziekenkas
        worden terugbetaald.
      </p>

      <h3>Burgerlijke aansprakelijkheid</h3>

      <p>
        Schade die een kind aan anderen toebrengt tijdens de Chiro-activiteiten
        (zoals het intrappen van een ruit) is verzekerd via uw eigen familiale
        verzekering. Als u geen familiale verzekering hebt, dan neemt de
        verzekering van Chirojeugd Vlaanderen dit over. Hierbij geldt wel (net
        zoals bij een normale familiale verzekering) een eigen bijdrage van
        307,17 euro die u zelf moet betalen.
      </p>

      <h2>Wat is niet verzekerd?</h2>

      <h3>Materiële schade</h3>

      <p>
        Persoonlijke bezittingen zoals een fiets, gsm of kledij zijn niet
        verzekerd door de Chiropolis. Ook schade aan auto&apos;s of andere
        voertuigen valt niet onder de verzekering. Maar als de schade
        veroorzaakt werd door een aanwijsbare fout van iemand anders, dan kan de
        schade wel verhaald worden op de familiale verzekering van die persoon.
        Als die persoon geen familiale verzekering heeft, dan komt de
        Chiroverzekering tussen.
      </p>

      <h2>Meer informatie</h2>

      <p>
        Chirojeugd Vlaanderen heeft een hele hoop goede en duidelijke informatie
        over hun verzekeringspolis op hun website staan:
      </p>

      <ul>
        <li>
          <Link
            href="https://chiro.be/verzekeringen"
            isExternal
            showAnchorIcon
            className="text-base md:text-lg"
          >
            Alles over de Chiroverzekering
          </Link>
        </li>
        <li>
          <Link
            href="https://chiro.be/weet-je-het-verzekeringen"
            isExternal
            showAnchorIcon
            className="text-base md:text-lg"
          >
            Wat is verzekerd?
          </Link>
        </li>
        <li>
          <Link
            href="https://chiro.be/faq-verzekeringen"
            isExternal
            showAnchorIcon
            className="text-base md:text-lg"
          >
            Veelgestelde vragen over de verzekering
          </Link>
        </li>
      </ul>
    </BlogText>
  );
}
