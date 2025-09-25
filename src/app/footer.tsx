import { Link } from "@heroui/link";
import FacebookIcon from "~/components/icons/facebook-icon";
import InstagramIcon from "~/components/icons/instagram-icon";
import Address from "~/components/ui/address";
import BlogText from "~/components/ui/blog-text";
import EmailAddress from "~/components/ui/email-address";
import PhoneNumber from "~/components/ui/phone-number";
import { getAllMainLeaders, getAllVBs } from "./contacts/actions";

export async function Footer() {
  const [mainLeaders, vbs] = await Promise.all([
    getAllMainLeaders(),
    getAllVBs(),
  ]);
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
            {mainLeaders.length > 0 && (
              <div className="flex flex-col gap-3 lg:gap-4">
                {mainLeaders.map((leader) => (
                  <PhoneNumber number={leader.phone} key={leader.id} />
                ))}
              </div>
            )}
          </div>
          <h3>Hoofdleiding</h3>
          <p>
            Voor dringende vragen of problemen kan je steeds terecht bij onze
            hoofdleiding:
          </p>
          {mainLeaders.length > 0 && (
            <ul>
              {mainLeaders.map((leader) => (
                <li key={leader.id}>
                  {leader.name}
                  <PhoneNumber number={leader.phone} />
                </li>
              ))}
            </ul>
          )}
          <h3>Volwassen begeleiding</h3>
          <p>
            Voor (tent)verhuur en in noodsituaties kan je onze volwassen
            begeleiding steeds aanspreken.
          </p>
          {vbs.length > 0 && (
            <ul>
              {vbs.map((vb) => (
                <li key={vb.id}>
                  {vb.name}
                  <PhoneNumber number={vb.phone} />
                </li>
              ))}
            </ul>
          )}
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
        <p>© Lars Salembier</p>
      </BlogText>
    </footer>
  );
}
