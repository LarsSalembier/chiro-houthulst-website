import FacebookIcon from "~/components/icons/facebook";
import InstagramIcon from "~/components/icons/instagram";
import ContactForm from "./contact-form";
import Address from "~/components/typography/address";
import Paragraph from "~/components/typography/paragraph";
import EmailAddress from "~/components/typography/email-address";
import UnorderedList from "~/components/typography/unordered-list";
import Header4 from "~/components/typography/header4";
import PhoneNumber from "~/components/typography/phone-number";
import Link from "~/components/typography/link";

export function Footer() {
  return (
    <footer className="w-full bg-card text-card-foreground" role="contentinfo">
      <div className="container flex flex-col items-center gap-8 px-6 py-8 md:px-12 lg:px-24">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <Header4>Chiro Houthulst</Header4>
            <Address
              streetAddress="Jonkershovestraat 101S"
              city="Houthulst"
              postalCode="8650"
            />
            <Paragraph>
              <EmailAddress address="chirohouthulst@hotmail.com" />
            </Paragraph>
            <Header4 id="hoofdleiding">Hoofdleiding</Header4>
            <Paragraph>
              Voor dringende vragen of problemen kan je steeds terecht bij onze
              hoofdleiding:
            </Paragraph>
            <UnorderedList>
              <li>
                Warre Sabbe
                <br />
                <PhoneNumber number="0468 30 06 64" />
              </li>
              <li>
                Yben Vandamme
                <br />
                <PhoneNumber number="0471 69 25 53" />
              </li>
              <li>
                Yorben Vandamme
                <br />
                <PhoneNumber number="0497 42 52 93" />
              </li>
            </UnorderedList>
            <Header4>Juridisch</Header4>
            <Paragraph>
              Lees onze <Link href="/privacyverklaring">privacyverklaring</Link>
            </Paragraph>
            <Header4>Voor leiding</Header4>
            <Paragraph>
              Ga naar het <Link href="/leidingportaal">Leidingportaal</Link>.
            </Paragraph>
          </div>
          <div>
            <Header4>Volg ons</Header4>
            <div className="mt-5 flex gap-4">
              <Link href="https://www.facebook.com/chirohouthulst">
                <FacebookIcon />
              </Link>
              <Link href="https://www.instagram.com/chirohouthulst">
                <InstagramIcon />
              </Link>
            </div>
            <Header4 id="contacteer-ons">Contacteer ons</Header4>
            <ContactForm className="mt-5" />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Chiro Houthulst
        </p>
      </div>
    </footer>
  );
}
