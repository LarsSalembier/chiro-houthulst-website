import { SignInButton, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import FacebookIcon from "../page/icons/facebook";
import InstagramIcon from "../page/icons/instagram";

export function Footer() {
  return (
    <footer className="w-full bg-card text-card-foreground" role="contentinfo">
      <div className="container flex flex-col items-center gap-8 px-6 py-8 md:px-12 lg:px-24">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">Chiro Houthulst</h4>
              <p>
                Jonkershovestraat 101S
                <br />
                8650 Houthulst
              </p>
              <p>chirohouthulst@hotmail.com</p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">Contacteer de hoofdleiding</h4>
              <p>
                Warre Sabbe
                <br />
                0468 30 06 64
              </p>
              <p>
                Yben Vandamme
                <br />
                0471 69 25 53
              </p>
              <p>
                Yorben Vandamme
                <br />
                0497 42 52 93
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
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">Intern</h4>
              <SignedOut>
                <SignInButton>
                  <Button variant="outline" className="w-fit">
                    Inloggen
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold" id="contacteer-ons">
              Contacteer ons
            </h4>
            <form action="#" method="POST">
              <div className="mb-4">
                <label htmlFor="naam" className="mb-2 block">
                  Naam:
                </label>
                <Input type="text" id="naam" name="naam" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block">
                  Email:
                </label>
                <Input type="email" id="email" name="email" />
              </div>
              <div className="mb-4">
                <label htmlFor="bericht" className="mb-2 block">
                  Bericht:
                </label>
                <Textarea id="bericht" name="bericht" rows={4}></Textarea>
              </div>
              <Button type="submit" disabled>
                Verzenden
              </Button>
              <p>
                Dit contactformulier werkt nog niet. Contacteer ons via onze{" "}
                <Link
                  href="https://facebook.com/chirohouthulst"
                  className="underline"
                >
                  Facebookpagina
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
        <p className="text-sm text-gray-500">© 2024 Chiro Houthulst</p>
      </div>
    </footer>
  );
}
