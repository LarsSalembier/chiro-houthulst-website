import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="mt-6 text-3xl font-bold">
          Privacyverklaring Chiro Sint-Jan Houthulst
        </h1>
        <p className="text-sm text-gray-500">
          Laatst bijgewerkt op 19 juni 2024
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <p>
          Chiro Sint-Jan Houthulst hecht belang aan de bescherming van uw
          persoonsgegevens en respecteert uw privacy.
        </p>
        <p>
          In deze privacyverklaring krijgt u heldere en transparante informatie
          over welke persoonsgegevens we verzamelen en hoe wij daarmee omgaan.
          We doen er alles aan om uw privacy te waarborgen en gaan daarom
          zorgvuldig om met persoonsgegevens. Chiro Sint-Jan Houthulst houdt
          zich in alle gevallen aan de toepasselijke wet- en regelgeving,
          waaronder de Algemene Verordening Gegevensbescherming.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <p>Dat brengt mee dat wij:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            de persoonsgegevens van onze leden en hun ouders verwerken in
            overeenstemming met het doel waarvoor we ze opgevraagd hebben.
          </li>
          <li>
            de verwerking beperken tot enkel die gegevens die minimaal nodig
            zijn.
          </li>
          <li>
            uw uitdrukkelijke toestemming vragen als we die nodig hebben voor de
            verwerking van persoonsgegevens van leden of hun ouders.
          </li>
          <li>
            passende technische en organisatorische maatregelen genomen hebben
            om de beveiliging van de persoonsgegevens van onze leden en hun
            ouders te waarborgen.
          </li>
          <li>
            geen persoonsgegevens doorgeven aan andere partijen, tenzij dat
            nodig is voor de uitvoering van onze doeleinden (bv. verzekeringen,
            subsidies).
          </li>
          <li>
            op de hoogte zijn van uw rechten wat uw persoonsgegevens betreft,
            dat we u daarop willen wijzen en dat we die respecteren.
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <p>
          Als Chiro Sint-Jan Houthulst zijn wij verantwoordelijk voor de
          verwerking van uw persoonsgegevens. Daarnaast treden wij op als
          verwerkers voor Chirojeugd Vlaanderen. Zij zijn op hun beurt
          verantwoordelijk voor de verwerking van de gegevens die aan ons
          gevraagd worden.
        </p>
        <p>
          Als u vragen hebt over de verwerking van uw gegevens, dan kunt u
          contact opnemen via de onderstaande contactgegevens.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <strong>Chiro Sint-Jan Houthulst</strong>
          <address>
            <p>Jonkershovestraat 101s</p>
            <p>8650 Houthulst</p>
          </address>
          <Link href="mailto:chirohouthulst@hotmail.com">
            chirohouthulst@hotmail.com
          </Link>
        </div>
        <div>
          <strong>Chirojeugd Vlaanderen</strong>
          <address>
            <p>Kipdorp 30</p>
            <p>2000 Antwerpen</p>
          </address>
          <p>03-231 07 95</p>
          <Link href="mailto:privacy@chiro.be">privacy@chiro.be</Link>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Verwerking van persoonsgegevens</h2>
        <h3 className="text-xl font-bold">Chiro Sint-Jan Houthulst</h3>
        <p>
          Chiro Sint-Jan Houthulst verwerkt persoonsgegevens van leden en hun
          ouders en/of voogden voor de volgende doeleinden en op basis van de
          volgende rechtsgronden.
        </p>
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
                Om te kunnen deelnemen aan de activiteiten van Chiro Sint-Jan
                Houthulst
              </TableCell>
              <TableCell>Uitvoering overeenkomst</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Om u via nieuwsbrieven en uitnodigingen te informeren over onze
                werking
              </TableCell>
              <TableCell>Uitvoering overeenkomst</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Om zo goed mogelijk zorg te kunnen dragen voor de gezondheid van
                de leden
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
        <p>
          Voor de bovenstaande doelstellingen kunnen wij de volgende
          persoonsgegevens opvragen en opslaan.
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>Persoonlijke identiteitsgegevens: naam, voornaam</li>
          <li>
            Contactgegevens: adres(sen), telefoonnummer(s), mailadres(sen)
          </li>
          <li>
            Persoonlijke kenmerken: geslacht/gender, geboortedatum,
            dieetvereisten
          </li>
          <li>
            Kenmerken eigen aan de Chirowerking: AD-nummer, afdeling, deelname
            aan de werking, betaling lidgeld, betaling kampinschrijving,
            functies binnen de groep
          </li>
          <li>
            Gezondheidsgegevens: aandoeningen of allergieën waar we tijdens de
            werking rekening mee moeten houden, toestemming om vrij verkrijgbare
            medicatie toe te dienen
          </li>
          <li>
            Foto’s: om te informeren over onze activiteiten en voor
            archiefdoeleinden
          </li>
        </ul>
        <p>
          Door uw kind in te schrijven in de Chiro geeft u als ouder en/of als
          wettelijk vertegenwoordiger van minderjarige leden toestemming voor de
          verwerking van de gegevens van het kind.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">Chirojeugd Vlaanderen</h3>
        <p>
          Chirojeugd Vlaanderen verwerkt persoonsgegevens van leden en hun
          ouders voor de volgende doeleinden en op basis van de volgende
          rechtsgronden.
        </p>
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
                Om zo goed mogelijk zorg te kunnen dragen voor de gezondheid van
                de leden tijdens de werking
              </TableCell>
              <TableCell>Uitvoering overeenkomst</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Als dienstverlening voor de lokale groepen, zodat zij hun
                ledenadministratie op een veilige en correcte manier kunnen
                opvolgen
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
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Verstrekking aan derden</h2>
        <p>
          De gegevens die u aan ons bezorgt, kunnen wij aan derde partijen
          verstrekken als dat noodzakelijk is voor de uitvoering van de
          hierboven beschreven doeleinden.
        </p>
        <p>Zo maken wij gebruik van een derde partij voor:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            Het opslaan van gegevens die we nodig hebben voor onze werking:
            Google Drive en Google Forms.
          </li>
          <li>
            Het opmaken en verspreiden van nieuwsbrieven en uitnodigingen:
            Resend, Facebook en Hotmail.
          </li>
          <li>De hosting van onze website: Vercel.</li>
          <li>Het plaatsen van foto’s: Google Photos, Facebook.</li>
        </ul>
        <p>
          Daarnaast kan een lokale overheid gegevens opvragen binnen het kader
          van een subsidie- en/of veiligheidsreglement.
        </p>
        <p>
          Wij laten nooit persoonsgegevens verwerken door derden als we geen
          verwerkersovereenkomst met hen afgesloten hebben. Met die partijen
          maken we uiteraard de nodige afspraken om de beveiliging van uw
          persoonsgegevens te waarborgen.
        </p>
        <p>
          We verstrekken geen persoonsgegevens aan partijen die buiten de EU
          gevestigd zijn.
        </p>
      </div>
    </>
  );
}
