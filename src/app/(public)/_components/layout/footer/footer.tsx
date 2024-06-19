import Link from "next/link";
import FacebookIcon from "../../../../../components/icons/facebook";
import InstagramIcon from "../../../../../components/icons/instagram";
import ContactForm from "./contact-form";

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
              <h4 className="text-lg font-bold">Hoofdleiding</h4>
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
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold" id="contacteer-ons">
              Contacteer ons
            </h4>
            <ContactForm />
          </div>
        </div>
        <p className="text-sm text-gray-500">© 2024 Chiro Houthulst</p>
      </div>
    </footer>
  );
}