import Link from "next/link";
import FacebookIcon from "../../../../../components/icons/facebook";
import InstagramIcon from "../../../../../components/icons/instagram";
import ContactForm from "./contact-form";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full bg-card text-card-foreground" role="contentinfo">
      <div className="container flex flex-col items-center gap-8 px-6 py-8 md:px-12 lg:px-24">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">Chiro Houthulst</h4>
              <address className="flex flex-col gap-2 not-italic">
                <p>
                  Jonkershovestraat 101S
                  <br />
                  8650 Houthulst
                </p>
                <a href="mailto:chirohouthulst@hotmail.com">
                  chirohouthulst@hotmail.com
                </a>
              </address>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">Hoofdleiding</h4>
              <ul className="flex flex-col gap-2">
                <li>
                  Warre Sabbe
                  <br />
                  <a href="tel:+32468300664">0468 30 06 64</a>
                </li>
                <li>
                  Yben Vandamme
                  <br />
                  <a href="tel:+32471692553">0471 69 25 53</a>
                </li>
                <li>
                  Yorben Vandamme
                  <br />
                  <a href="tel:+32497425293">0497 42 52 93</a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">Juridisch</h4>
              <p>
                Lees onze{" "}
                <Link href="/privacyverklaring" className="underline">
                  privacyverklaring
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">Volg ons</h4>
              <div className="flex gap-4">
                <Link href="https://www.facebook.com/chirohouthulst">
                  <FacebookIcon />
                </Link>
                <Link href="https://www.instagram.com/chirohouthulst">
                  <InstagramIcon />
                </Link>
              </div>
            </div>
            <SignedOut>
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-bold">Intern</h4>
                <SignInButton>
                  <Button className="w-fit" variant="secondary">
                    Inloggen
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold" id="contacteer-ons">
              Contacteer ons
            </h4>
            <ContactForm />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Chiro Houthulst
        </p>
      </div>
    </footer>
  );
}
