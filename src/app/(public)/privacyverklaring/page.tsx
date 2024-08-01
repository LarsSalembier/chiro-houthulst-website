import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MutedText, Paragraph } from "~/components/typography/text";
import { EmailAddress, PhoneNumber } from "~/components/typography/links";
import Address from "~/components/address";
import { UnorderedList } from "~/components/typography/lists";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
} from "~/components/page-header";
import {
  Section,
  SectionContent,
  SectionFooter,
  SectionTitle,
} from "~/components/section";
import {
  Subsection,
  SubsectionContent,
  SubsectionTitle,
} from "~/components/subsection";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: "De privacyverklaring van Chiro Houthulst",
};

export default function PrivacyPolicy() {
  return (
    <div className="container relative flex flex-col gap-6 pb-8 md:pb-12 lg:pb-12">
      <PageHeader>
        <PageHeaderHeading>Onze privacyverklaring</PageHeaderHeading>
        <PageHeaderDescription>
          Chiro Sint-Jan Houthulst hecht belang aan de bescherming van uw
          persoonsgegevens en respecteert uw privacy.
        </PageHeaderDescription>
      </PageHeader>
      <Section>
        <SectionTitle>Privacyverklaring</SectionTitle>
        <SectionContent>
          <MutedText>Laatst bijgewerkt op 19 juni 2024</MutedText>
          <div>
            <Paragraph>
              Chiro Sint-Jan Houthulst hecht belang aan de bescherming van uw
              persoonsgegevens en respecteert uw privacy.
            </Paragraph>

            <Paragraph>
              In deze privacyverklaring krijgt u heldere en transparante
              informatie over welke persoonsgegevens we verzamelen en hoe wij
              daarmee omgaan. We doen er alles aan om uw privacy te waarborgen
              en gaan daarom zorgvuldig om met persoonsgegevens. Chiro Sint-Jan
              Houthulst houdt zich in alle gevallen aan de toepasselijke wet- en
              regelgeving, waaronder de Algemene Verordening
              Gegevensbescherming.
            </Paragraph>
            <Paragraph>Dat brengt mee dat wij:</Paragraph>
            <UnorderedList>
              <li>
                de persoonsgegevens van onze leden en hun ouders verwerken in
                overeenstemming met het doel waarvoor we ze opgevraagd hebben.
              </li>
              <li>
                de verwerking beperken tot enkel die gegevens die minimaal nodig
                zijn.
              </li>
              <li>
                uw uitdrukkelijke toestemming vragen als we die nodig hebben
                voor de verwerking van persoonsgegevens van leden of hun ouders.
              </li>
              <li>
                passende technische en organisatorische maatregelen genomen
                hebben om de beveiliging van de persoonsgegevens van onze leden
                en hun ouders te waarborgen.
              </li>
              <li>
                geen persoonsgegevens doorgeven aan andere partijen, tenzij dat
                nodig is voor de uitvoering van onze doeleinden (bv.
                verzekeringen, subsidies).
              </li>
              <li>
                op de hoogte zijn van uw rechten wat uw persoonsgegevens
                betreft, dat we u daarop willen wijzen en dat we die
                respecteren.
              </li>
            </UnorderedList>
            <Paragraph>
              Als Chiro Sint-Jan Houthulst zijn wij verantwoordelijk voor de
              verwerking van uw persoonsgegevens. Daarnaast treden wij op als
              verwerkers voor Chirojeugd Vlaanderen. Zij zijn op hun beurt
              verantwoordelijk voor de verwerking van de gegevens die aan ons
              gevraagd worden.
            </Paragraph>
            <Paragraph>
              Als u vragen hebt over de verwerking van uw gegevens, dan kunt u
              contact opnemen via de onderstaande contactgegevens:
            </Paragraph>
          </div>
        </SectionContent>
        <SectionFooter className="mx-auto flex justify-around sm:flex-row">
          <Card>
            <CardHeader>
              <CardTitle>Chiro Sint-Jan Houthulst</CardTitle>
            </CardHeader>
            <CardContent>
              <Address
                streetAddress="Jonkershovestraat 101s"
                city="Houthulst"
                postalCode="8650"
              />
              <Paragraph>
                <EmailAddress address="chirohouthulst@hotmail.com" />
                <br />
                <PhoneNumber number="0468 30 06 64" />
              </Paragraph>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Chirojeugd Vlaanderen</CardTitle>
            </CardHeader>
            <CardContent>
              <Address
                streetAddress="Kipdorp 30"
                city="Antwerpen"
                postalCode="2000"
              />
              <Paragraph>
                <EmailAddress address="privacy@chiro.be" />
                <br />
                <PhoneNumber number="03-231 07 95" />
              </Paragraph>
            </CardContent>
          </Card>
        </SectionFooter>
      </Section>
      <Section>
        <SectionTitle>Verwerking van persoonsgegevens</SectionTitle>
        <SectionContent>
          <Subsection>
            <SubsectionTitle>Chiro Sint-Jan Houthulst</SubsectionTitle>
            <SubsectionContent>
              <Paragraph>
                Chiro Sint-Jan Houthulst verwerkt persoonsgegevens van leden en
                hun ouders en/of voogden voor de volgende doeleinden en op basis
                van de volgende rechtsgronden.
              </Paragraph>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doeleinde</TableHead>
                    <TableHead>Rechtsgrond</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Om te kunnen deelnemen aan de activiteiten van Chiro
                      Sint-Jan Houthulst
                    </TableCell>
                    <TableCell>Uitvoering overeenkomst</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Om u via nieuwsbrieven en uitnodigingen te informeren over
                      onze werking
                    </TableCell>
                    <TableCell>Uitvoering overeenkomst</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Om zo goed mogelijk zorg te kunnen dragen voor de
                      gezondheid van de leden
                    </TableCell>
                    <TableCell>Uitvoering overeenkomst</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Om subsidies te kunnen verkrijgen van de overheid
                    </TableCell>
                    <TableCell>Wettelijke verplichting</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Voor archiefdoeleinden
                    </TableCell>
                    <TableCell>Gerechtvaardigd belang</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Paragraph>
                Voor de bovenstaande doelstellingen kunnen wij de volgende
                persoonsgegevens opvragen en opslaan:
              </Paragraph>
              <UnorderedList>
                <li>Persoonlijke identiteitsgegevens: naam, voornaam</li>
                <li>
                  Contactgegevens: adres(sen), telefoonnummer(s), mailadres(sen)
                </li>
                <li>
                  Persoonlijke kenmerken: geslacht/gender, geboortedatum,
                  dieetvereisten
                </li>
                <li>
                  Kenmerken eigen aan de Chirowerking: AD-nummer, afdeling,
                  deelname aan de werking, betaling lidgeld, betaling
                  kampinschrijving, functies binnen de groep
                </li>
                <li>
                  Gezondheidsgegevens: aandoeningen of allergieën waar we
                  tijdens de werking rekening mee moeten houden, toestemming om
                  vrij verkrijgbare medicatie toe te dienen
                </li>
                <li>
                  Foto&apos;s: om te informeren over onze activiteiten en voor
                  archiefdoeleinden
                </li>
              </UnorderedList>
              <Paragraph>
                Door uw kind in te schrijven in de Chiro geeft u als ouder en/of
                als wettelijk vertegenwoordiger van minderjarige leden
                toestemming voor de verwerking van de gegevens van het kind.
              </Paragraph>
            </SubsectionContent>
          </Subsection>
          <Subsection>
            <SubsectionTitle>Chirojeugd Vlaanderen</SubsectionTitle>
            <SubsectionContent>
              <Paragraph>
                Chirojeugd Vlaanderen verwerkt persoonsgegevens van leden en hun
                ouders voor de volgende doeleinden en op basis van de volgende
                rechtsgronden.
              </Paragraph>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doeleinde</TableHead>
                    <TableHead>Rechtsgrond</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      16+: om het gratis ledentijdschrift op te sturen
                    </TableCell>
                    <TableCell>Uitvoering overeenkomst</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Om subsidies te kunnen verkrijgen van de overheid
                    </TableCell>
                    <TableCell>Wettelijke verplichting</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Voor archiefdoeleinden
                    </TableCell>
                    <TableCell>Gerechtvaardigd belang</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Om zo goed mogelijk zorg te kunnen dragen voor de
                      gezondheid van de leden tijdens de werking
                    </TableCell>
                    <TableCell>Uitvoering overeenkomst</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Als dienstverlening voor de lokale groepen, zodat zij hun
                      ledenadministratie op een veilige en correcte manier
                      kunnen opvolgen
                    </TableCell>
                    <TableCell>Uitvoering overeenkomst</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Om de leden te kunnen laten verzekeren
                    </TableCell>
                    <TableCell>Uitvoering overeenkomst</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </SubsectionContent>
          </Subsection>
        </SectionContent>
      </Section>
      <Section>
        <SectionTitle>Verstrekking aan derden</SectionTitle>
        <SectionContent>
          <Paragraph>
            De gegevens die u aan ons bezorgt, kunnen wij aan derde partijen
            verstrekken als dat noodzakelijk is voor de uitvoering van de
            hierboven beschreven doeleinden. Zo maken wij gebruik van een derde
            partij voor:
          </Paragraph>
          <div>
            <UnorderedList>
              <li>
                Het opslaan van gegevens die we nodig hebben voor onze werking:
                Google Drive en Google Forms.
              </li>
              <li>
                Het opmaken en verspreiden van nieuwsbrieven en uitnodigingen:
                Resend, Facebook en Hotmail.
              </li>
              <li>De hosting van onze website: Vercel.</li>
              <li>Het plaatsen van foto&apos;s: Google Photos, Facebook.</li>
            </UnorderedList>
            <Paragraph>
              Daarnaast kan een lokale overheid gegevens opvragen binnen het
              kader van een subsidie- en/of veiligheidsreglement.
            </Paragraph>
            <Paragraph>
              Wij laten nooit persoonsgegevens verwerken door derden als we geen
              verwerkersovereenkomst met hen afgesloten hebben. Met die partijen
              maken we uiteraard de nodige afspraken om de beveiliging van uw
              persoonsgegevens te waarborgen.
            </Paragraph>
            <Paragraph>
              We verstrekken geen persoonsgegevens aan partijen die buiten de EU
              gevestigd zijn.
            </Paragraph>
          </div>
        </SectionContent>
      </Section>
    </div>
  );
}
