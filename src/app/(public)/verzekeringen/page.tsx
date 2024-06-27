import Header1 from "~/components/typography/header1";
import UnorderedList from "~/components/typography/unordered-list";
import Paragraph from "~/components/typography/paragraph";
import MutedText from "~/components/typography/muted-text";
import Header3 from "~/components/typography/header3";
import EmailAddress from "~/components/typography/email-address";
import Header2 from "~/components/typography/header2";
import OrderedList from "~/components/typography/ordered-list";
import Link from "~/components/typography/link";
import DownloadLink from "~/components/typography/download-link";

export default function PrivacyPolicy() {
  return (
    <div>
      <Header1>Verzekering</Header1>

      <Header2>Wanneer ben je verzekerd?</Header2>
      <Paragraph>
        Chiro Sint-Jan Houthulst verzekert via Chiro Nationaal alle leden,
        leiding en (tijdelijke) vrijwilligers. De verzekering dekt de kosten van
        een ongeval tijdens de Chiro-activiteiten. Ook als je op weg bent naar
        de activiteit of naar huis, ben je verzekerd. Dit geldt ook voor
        activiteiten die niet op zondag plaatsvinden, zoals weekends en kampen.
        Ook in het buitenland zijn we verzekerd.
      </Paragraph>
      <Header2>Wat moeten ouders doen bij een ongeval?</Header2>
      <OrderedList>
        <li>
          Print dit{" "}
          <DownloadLink
            href="/Geneeskundig Attest Chiro 2022.pdf"
            fileName="Geneeskundig Attest Chiro 2022"
          >
            geneeskundig getuigschrift
          </DownloadLink>{" "}
          af.
        </li>
        <li>Laat de dokter het geneeskundig getuigschrift invullen.</li>
        <li>
          Stuur een scan van het getuigschrift naar de hoofdleiding via{" "}
          <EmailAddress address="chirohouthulst@hotmail.com" /> met vermelding
          van de naam van het kind en wat er juist gebeurd is.
        </li>
      </OrderedList>
      <div>
        <Paragraph>
          Na ontvangst van het getuigschrift zal de hoofdleiding dit ingeven in
          het centraal administratiesysteem van Chirojeugd Vlaanderen. Zij
          zullen de kosten van het ongeval verder afhandelen en u op de hoogte
          houden van de verdere stappen.
        </Paragraph>
        <Paragraph>
          U kunt de hoofdleiding steeds vragen wat de status is van de
          afhandeling. Zij kunnen namelijk volgen of het geld al gestort is, er
          documenten ontbreken, etc.
        </Paragraph>
      </div>
      <Header2>Wat is verzekerd?</Header2>
      <Header3>Burgerlijke aansprakelijkheid</Header3>
      <Paragraph>
        Schade die een kind aan anderen toebrengt tijdens de Chiro-activiteiten
        (zoals het intrappen van een ruit) is verzekerd via uw eigen familiale
        verzekering. Als u geen familiale verzekering hebt, dan neemt de
        verzekering van Chirojeugd Vlaanderen dit over. Hierbij geldt wel (net
        zoals bij een normale familiale verzekering) een eigen bijdrage van
        307,17 euro die u zelf moet betalen.
      </Paragraph>
      <Header3>Ongevallen</Header3>
      <Paragraph>
        Medische kosten die ontstaan door een ongeval tijdens, op weg van, of op
        weg naar de Chiro-activiteiten worden terugbetaald door de verzekering
        van Chirojeugd Vlaanderen.
        <MutedText>
          Opgelet: de verzekering dekt enkel de kosten die niet door de
          ziekenkas worden terugbetaald.
        </MutedText>
      </Paragraph>
      <Header2>Wat is niet verzekerd?</Header2>
      <Header3>Materiële schade</Header3>
      <Paragraph>
        Persoonlijke bezittingen zoals een fiets, gsm of kledij zijn niet
        verzekerd door de Chiropolis. Ook schade aan auto&apos;s of andere
        voertuigen valt niet onder de verzekering. Maar als de schade
        veroorzaakt werd door een aanwijsbare fout van iemand anders, dan kan de
        schade wel verhaald worden op de familiale verzekering van die persoon.
        Als die persoon geen familiale verzekering heeft, dan komt de
        Chiroverzekering tussen.
      </Paragraph>
      <Header2>Meer informatie</Header2>
      <Paragraph>
        Chirojeugd Vlaanderen heeft een hele hoop goede en duidelijke informatie
        over hun verzekeringspolis op hun website staan:
      </Paragraph>
      <UnorderedList>
        <li>
          <Link href="https://chiro.be/verzekeringen">
            Alles over de Chiroverzekering
          </Link>
        </li>
        <li>
          <Link href="https://chiro.be/weet-je-het-verzekeringen">
            Wat wordt verzekerd?
          </Link>
        </li>
        <li>
          <Link href="https://chiro.be/faq-verzekeringen">
            Veelgestelde vragen over de verzekering
          </Link>
        </li>
      </UnorderedList>
    </div>
  );
}
