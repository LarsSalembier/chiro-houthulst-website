import { MutedText, Paragraph } from "~/components/typography/text";
import {
  DownloadLink,
  EmailAddress,
  FormattedLink,
} from "~/components/typography/links";
import { OrderedList, UnorderedList } from "~/components/typography/lists";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { Section, SectionContent, SectionTitle } from "~/components/section";
import {
  Subsection,
  SubsectionContent,
  SubsectionTitle,
} from "~/components/subsection";

export default function PrivacyPolicy() {
  return (
    <div className="container relative flex flex-col gap-6 pb-8 md:pb-12 lg:pb-12">
      <PageHeader>
        <PageHeaderHeading>Verzekeringen</PageHeaderHeading>
        <PageHeaderDescription>
          Hier vind je alle informatie over de verzekeringen van Chiro Sint-Jan
          Houthulst. Als je vragen hebt, aarzel dan niet om de hoofdleiding te
          contacteren.
        </PageHeaderDescription>
      </PageHeader>

      <Section>
        <SectionTitle>Wanneer ben je verzekerd?</SectionTitle>
        <SectionContent>
          <Paragraph>
            Chiro Sint-Jan Houthulst verzekert via Chiro Nationaal alle leden,
            leiding en (tijdelijke) vrijwilligers. De verzekering dekt de kosten
            van een ongeval tijdens de Chiro-activiteiten. Ook als je op weg
            bent naar de activiteit of naar huis, ben je verzekerd. Dit geldt
            ook voor activiteiten die niet op zondag plaatsvinden, zoals
            weekends en kampen. Ook in het buitenland zijn we verzekerd.
          </Paragraph>
        </SectionContent>
      </Section>
      <Section>
        <SectionTitle>Wat moeten ouders doen bij een ongeval?</SectionTitle>
        <SectionContent>
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
              <EmailAddress address="chirohouthulst@hotmail.com" /> met
              vermelding van de naam van het kind en wat er juist gebeurd is.
            </li>
          </OrderedList>
        </SectionContent>
      </Section>
      <Section>
        <SectionTitle>Wat is verzekerd?</SectionTitle>
        <SectionContent>
          <Subsection>
            <SubsectionTitle>Burgerlijke aansprakelijkheid</SubsectionTitle>
            <SubsectionContent>
              <Paragraph>
                Schade die een kind aan anderen toebrengt tijdens de
                Chiro-activiteiten (zoals het intrappen van een ruit) is
                verzekerd via uw eigen familiale verzekering. Als u geen
                familiale verzekering hebt, dan neemt de verzekering van
                Chirojeugd Vlaanderen dit over. Hierbij geldt wel (net zoals bij
                een normale familiale verzekering) een eigen bijdrage van 307,17
                euro die u zelf moet betalen.
              </Paragraph>
            </SubsectionContent>
          </Subsection>
          <Subsection>
            <SubsectionTitle>Ongevallen</SubsectionTitle>
            <SubsectionContent>
              <Paragraph>
                Medische kosten die ontstaan door een ongeval tijdens, op weg
                van, of op weg naar de Chiro-activiteiten worden terugbetaald
                door de verzekering van Chirojeugd Vlaanderen.
              </Paragraph>
              <MutedText>
                Opgelet: de verzekering dekt enkel de kosten die niet door de
                ziekenkas worden terugbetaald.
              </MutedText>
            </SubsectionContent>
          </Subsection>
        </SectionContent>
      </Section>
      <Section>
        <SectionTitle>Wat is niet verzekerd?</SectionTitle>
        <SectionContent>
          <Subsection>
            <SubsectionTitle>Materiële schade</SubsectionTitle>
            <SubsectionContent>
              <Paragraph>
                Persoonlijke bezittingen zoals een fiets, gsm of kledij zijn
                niet verzekerd door de Chiropolis. Ook schade aan auto&apos;s of
                andere voertuigen valt niet onder de verzekering. Maar als de
                schade veroorzaakt werd door een aanwijsbare fout van iemand
                anders, dan kan de schade wel verhaald worden op de familiale
                verzekering van die persoon. Als die persoon geen familiale
                verzekering heeft, dan komt de Chiroverzekering tussen.
              </Paragraph>
            </SubsectionContent>
          </Subsection>
        </SectionContent>
      </Section>
      <Section>
        <SectionTitle>Meer informatie</SectionTitle>
        <SectionContent>
          <Paragraph>
            Chirojeugd Vlaanderen heeft een hele hoop goede en duidelijke
            informatie over hun verzekeringspolis op hun website staan:
          </Paragraph>
          <UnorderedList>
            <li>
              <FormattedLink href="https://chiro.be/verzekeringen">
                Alles over de Chiroverzekering
              </FormattedLink>
            </li>
            <li>
              <FormattedLink href="https://chiro.be/weet-je-het-verzekeringen">
                Wat wordt verzekerd?
              </FormattedLink>
            </li>
            <li>
              <FormattedLink href="https://chiro.be/faq-verzekeringen">
                Veelgestelde vragen over de verzekering
              </FormattedLink>
            </li>
          </UnorderedList>
        </SectionContent>
      </Section>
    </div>
  );
}
