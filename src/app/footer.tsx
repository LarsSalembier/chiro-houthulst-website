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
      className="border-border/40 bg-card text-card-foreground container relative mx-auto w-full bg-slate-50 px-4 py-8 pb-8 sm:pb-8 md:px-16 xl:px-32"
      role="contentinfo"
    >
      <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-16 lg:gap-32">
        <BlogText className="lg:prose-lg">
          <h3>Chiro Sint-Jan Houthulst</h3>
          <Address
            addressLine1="Jonkershovestraat 101S"
            city="Houthulst"
            postalCode="8650"
          />
          <div className="flex flex-col gap-3 lg:gap-4">
            <EmailAddress
              address="chirohouthulst@hotmail.com"
              className="text-base lg:text-lg"
            />
            <PhoneNumber
              number="0468 30 06 64"
              className="text-base lg:text-lg"
            />
          </div>
          <h3>Hoofdleiding</h3>
          <p>
            Voor dringende vragen of problemen kan je steeds terecht bij onze
            hoofdleiding:
          </p>
          <ul>
            <li>
              Warre Sabbe
              <PhoneNumber
                number="0468 30 06 64"
                className="text-base lg:text-lg"
              />
            </li>
            <li>
              Yben Vandamme
              <PhoneNumber
                number="0471 69 25 53"
                className="text-base lg:text-lg"
              />
            </li>
          </ul>
        </BlogText>
        <BlogText className="lg:prose-lg">
          <h3>Volwassen begeleiding</h3>
          <p>
            Voor (tent)verhuur en belangrijke zaken kan je onze volwassen
            begeleiding steeds aanspreken.
          </p>
          <ul>
            <li>
              Edwin Gouwy
              <PhoneNumber
                number="0476 34 16 37"
                className="text-base lg:text-lg"
              />
            </li>
          </ul>
          <h3>Volg ons</h3>
          <ul>
            <li>
              <Link
                href="https://www.facebook.com/chirohouthulst"
                className="flex items-center gap-2 text-base lg:text-lg"
              >
                <FacebookIcon /> Facebook
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com/chirohouthulst"
                className="flex items-center gap-2 text-base lg:text-lg"
              >
                <InstagramIcon /> Instagram
              </Link>
            </li>
          </ul>
          <div className="flex gap-4"></div>
          <h3>Juridisch</h3>
          <p>
            Lees onze{" "}
            <Link href="/privacyverklaring" className="text-base lg:text-lg">
              privacyverklaring
            </Link>
            .
          </p>
        </BlogText>
      </div>
      <div className="prose max-w-none pt-16 text-center lg:prose-lg">
        <p>
          © {new Date().getFullYear()} Chiro Sint-Jan Houthulst | Alle rechten
          voorbehouden.
        </p>
      </div>
    </footer>
  );
}
