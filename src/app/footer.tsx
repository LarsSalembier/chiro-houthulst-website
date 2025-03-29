import { Link } from "@nextui-org/link";
import FacebookIcon from "~/components/icons/facebook-icon";
import InstagramIcon from "~/components/icons/instagram-icon";
import Address from "~/components/ui/address";
import BlogText from "~/components/ui/blog-text";
import EmailAddress from "~/components/ui/email-address";
import PhoneNumber from "~/components/ui/phone-number";

export function Footer() {
  return (
    <footer
      className="text-card-foreground container relative mx-auto w-full bg-slate-100 px-4 pb-2 md:px-16 xl:px-32"
      role="contentinfo"
    >
      <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-16 lg:gap-32">
        <BlogText>
          <h2 id="contact">Contact</h2>
          <h3>Chiro Sint-Jan Houthulst</h3>
          <Address
            addressLine1="Jonkershovestraat 101S"
            city="Houthulst"
            postalCode="8650"
          />
          <div className="flex flex-col gap-3 lg:gap-4">
            <EmailAddress address="chirohouthulst@hotmail.com" />
            <PhoneNumber number="0468 30 06 64" />
          </div>
          <h3>Hoofdleiding</h3>
          <p>
            Voor dringende vragen of problemen kan je steeds terecht bij onze
            hoofdleiding:
          </p>
          <ul>
            <li>
              Warre Sabbe
              <PhoneNumber number="0468 30 06 64" />
            </li>
            <li>
              Yben Vandamme
              <PhoneNumber number="0471 69 25 53" />
            </li>
          </ul>
          <h3>Volwassen begeleiding</h3>
          <p>
            Voor (tent)verhuur en in noodsituaties kan je onze volwassen
            begeleiding steeds aanspreken.
          </p>
          <ul>
            <li>
              Edwin Gouwy
              <PhoneNumber number="0476 34 16 37" />
            </li>
          </ul>
        </BlogText>
        <BlogText>
          <h2 className="hidden md:flex">Overig</h2>
          <h3>Volg ons</h3>
          <div className="flex flex-col gap-3 lg:gap-4">
            <Link
              href="https://www.facebook.com/chirohouthulst"
              className="flex items-center gap-2 text-base md:text-lg"
            >
              <FacebookIcon /> Facebook
            </Link>
            <Link
              href="https://www.instagram.com/chirohouthulst"
              className="flex items-center gap-2 text-base md:text-lg"
            >
              <InstagramIcon /> Instagram
            </Link>
          </div>
          <h3>Juridisch</h3>
          <p>
            Lees onze{" "}
            <Link href="/privacyverklaring" className="text-base md:text-lg">
              privacyverklaring
            </Link>{" "}
            en{" "}
            <Link href="/cookie-policy" className="text-base md:text-lg">
              cookie policy
            </Link>
            .
          </p>
          <h3>Voor leiding</h3>
          <p>
            Ga naar het{" "}
            <Link href="/leidingsportaal" className="text-base md:text-lg">
              leidingsportaal
            </Link>
            .
          </p>
        </BlogText>
      </div>
      <BlogText className="max-w-none text-center">
        <p>
          © {new Date().getFullYear()} Chiro Sint-Jan Houthulst | Alle rechten
          voorbehouden.
        </p>
      </BlogText>
    </footer>
  );
}
