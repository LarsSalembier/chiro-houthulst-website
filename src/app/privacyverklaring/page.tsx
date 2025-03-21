import { type Metadata } from "next";
import Address from "~/components/ui/address";
import BlogText from "~/components/ui/blog-text";
import EmailAddress from "~/components/ui/email-address";
import PhoneNumber from "~/components/ui/phone-number";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: "Lees hier de Privacyverklaring van Chiro Sint-Jan Houthulst",
};

export default function Privacyverklaring() {
  return (
    <BlogText className="mx-auto pt-16">
      <h1>Privacyverklaring</h1>
      <p>Laatst bijgewerkt op 21 maart 2025</p>
      <p>
        Chiro Sint-Jan Houthulst hecht belang aan de bescherming van uw
        persoonsgegevens en respecteert uw privacy.
      </p>
      <h2>Overzicht</h2>
      <p>
        In deze privacyverklaring krijgt u heldere en transparante informatie
        over welke persoonsgegevens we verzamelen en hoe wij daarmee omgaan. We
        doen er alles aan om uw privacy te waarborgen en gaan daarom zorgvuldig
        om met persoonsgegevens. Chiro Sint-Jan Houthulst houdt zich in alle
        gevallen aan de toepasselijke wet- en regelgeving, waaronder de Algemene
        Verordening Gegevensbescherming.
      </p>
      <p>Dat brengt mee dat wij:</p>
      <ul>
        <li>
          de persoonsgegevens van onze leden en hun ouders verwerken in
          overeenstemming met het doel waarvoor we ze opgevraagd hebben.
        </li>
        <li>
          de verwerking beperken tot enkel die gegevens die minimaal nodig zijn.
        </li>
        <li>
          uw uitdrukkelijke toestemming vragen als we die nodig hebben voor de
          verwerking van persoonsgegevens van leden of hun ouders.
        </li>
        <li>
          passende technische en organisatorische maatregelen genomen hebben om
          de beveiliging van de persoonsgegevens van onze leden en hun ouders te
          waarborgen.
        </li>
        <li>
          geen persoonsgegevens doorgeven aan andere partijen, tenzij dat nodig
          is voor de uitvoering van onze doeleinden (bv. verzekeringen,
          subsidies).
        </li>
        <li>
          op de hoogte zijn van uw rechten wat uw persoonsgegevens betreft, dat
          we u daarop willen wijzen en dat we die respecteren.
        </li>
      </ul>
      <p>
        Als Chiro Sint-Jan Houthulst zijn wij verantwoordelijk voor de
        verwerking van uw persoonsgegevens. Daarnaast treden wij op als
        verwerkers voor Chirojeugd Vlaanderen. Zij zijn op hun beurt
        verantwoordelijk voor de verwerking van de gegevens die aan ons gevraagd
        worden.
      </p>
      <p>
        Als u vragen hebt over de verwerking van uw gegevens, dan kunt u contact
        opnemen via de onderstaande contactgegevens:
      </p>
      <div className="flex flex-col gap-4 md:flex-row md:gap-16">
        <div>
          <h3>Chiro Sint-Jan Houthulst</h3>
          <Address
            addressLine1="Jonkershovestraat 101S"
            postalCode="8650"
            city="Houthulst"
          />
          <div className="flex flex-col gap-3 lg:gap-4">
            <EmailAddress address="chirohouthulst@hotmail.com" />
            <PhoneNumber number="0468 30 06 64" />
          </div>
        </div>
        <div>
          <h3>Chirojeugd Vlaanderen</h3>
          <Address
            addressLine1="Kipdorp 30"
            postalCode="2000"
            city="Antwerpen"
          />
          <div className="flex flex-col gap-3 lg:gap-4">
            <EmailAddress
              address="privacy@chiro.be
"
            />
            <PhoneNumber number="03-231 07 95" />
          </div>
        </div>
      </div>
      <h2>Verwerking van persoonsgegevens</h2>
      <h3>Chiro Sint-Jan Houthulst</h3>
      <p>
        Chiro Sint-Jan Houthulst verwerkt persoonsgegevens van leden en hun
        ouders en/of voogden voor de volgende doeleinden en op basis van de
        volgende rechtsgronden.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Doeleinde</th>
            <th scope="col">Rechtsgrond</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Om te kunnen deelnemen aan activiteiten</td>
            <td>Uitvoering overeenkomst</td>
          </tr>
          <tr>
            <td>
              Om u via nieuwsbrieven en uitnodigingen te informeren over onze
              werking
            </td>
            <td>Uitvoering overeenkomst</td>
          </tr>
          <tr>
            <td>
              Om zo goed mogelijk zorg te kunnen dragen voor de gezondheid van
              de leden
            </td>
            <td>Uitvoering overeenkomst</td>
          </tr>
          <tr>
            <td>Om subsidies te kunnen verkrijgen van de overheid</td>
            <td>Wettelijke verplichting</td>
          </tr>
          <tr>
            <td>Voor archiefdoeleinden</td>
            <td>Gerechtvaardigd belang</td>
          </tr>
        </tbody>
      </table>
      <p>
        Voor de volgende doelstellingen kunnen wij de volgende persoonsgegevens
        opvragen en opslaan:
      </p>
      <ul>
        <li>Persoonlijke identiteitsgegevens: naam, voornaam</li>
        <li>Contactgegevens: adres(sen), telefoonnummer(s), mailadres(sen)</li>
        <li>
          Persoonlijke kenmerken: geslacht/gender, geboortedatum, dieetvereisten
        </li>
        <li>
          Kenmerken eigen aan de Chirowerking: AD-nummer, afdeling, deelname aan
          de werking, betaling lidgeld, betaling kampinschrijving, functies
          binnen de groep
        </li>
        <li>
          Gezondheidsgegevens: aandoeningen of allergieën waar we tijdens de
          werking rekening mee moeten houden, toestemming om vrij verkrijgbare
          medicatie toe te dienen
        </li>
        <li>
          Foto&apos;s: om te informeren over onze activiteiten en voor
          archiefdoeleinden
        </li>
      </ul>
      <p>
        Door uw kind in te schrijven in de Chiro geeft u als ouder en/of als
        wettelijk vertegenwoordiger van minderjarige leden toestemming voor de
        verwerking van de gegevens van het kind.
      </p>
      <h3>Chirojeugd Vlaanderen</h3>
      <p>
        Chirojeugd Vlaanderen verwerkt persoonsgegevens van leden en hun ouders
        voor de volgende doeleinden en op basis van de volgende rechtsgronden.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Doeleinde</th>
            <th scope="col">Rechtsgrond</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>16+: om het gratis ledentijdschrift op te sturen </td>
            <td>Uitvoering overeenkomst</td>
          </tr>
          <tr>
            <td>Om subsidies te kunnen verkrijgen van de overheid</td>
            <td>Wettelijke verplichting</td>
          </tr>
          <tr>
            <td>Voor archiefdoeleinden</td>
            <td>Gerechtvaardigd belang</td>
          </tr>
          <tr>
            <td>
              Om zo goed mogelijk zorg te kunnen dragen voor de gezondheid van
              de leden tijdens de werking
            </td>
            <td>Uitvoering overeenkomst</td>
          </tr>
          <tr>
            <td>
              Als dienstverlening voor de lokale groepen, zodat zij hun
              ledenadministratie op een veilige en correcte manier kunnen
              opvolgen
            </td>
            <td>Uitvoering overeenkomst</td>
          </tr>
          <tr>
            <td>Om de leden te kunnen laten verzekeren</td>
            <td>Uitvoering overeenkomst</td>
          </tr>
        </tbody>
      </table>
      <h2>Verstrekking aan derden</h2>
      <p>
        De gegevens die u aan ons bezorgt, kunnen wij aan derde partijen
        verstrekken als dat noodzakelijk is voor de uitvoering van de hierboven
        beschreven doeleinden. Zo maken wij gebruik van een derde partij voor:
      </p>
      <ul>
        <li>
          Het opslaan van gegevens die we nodig hebben voor onze werking: Google
          Drive en Google Forms.
        </li>
        <li>
          Het opmaken en verspreiden van nieuwsbrieven en uitnodigingen: Resend,
          Facebook en Hotmail.
        </li>
        <li>De hosting van onze website: Vercel.</li>
        <li>
          Het plaatsen van foto&apos;s: Google Photos, Facebook en Instagram.
        </li>
      </ul>
      <p>
        Daarnaast kan een lokale overheid gegevens opvragen binnen het kader van
        een subsidie- en/of veiligheidsreglement.
      </p>
      <p>
        Wij laten nooit persoonsgegevens verwerken door derden als we geen
        verwerkersovereenkomst met hen afgesloten hebben. Met die partijen maken
        we uiteraard de nodige afspraken om de beveiliging van uw
        persoonsgegevens te waarborgen.
      </p>
    </BlogText>
  );
}
