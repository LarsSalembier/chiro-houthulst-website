"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Header4 from "~/components/typography/header4";
import FacebookIcon from "~/components/icons/facebook";
import InstagramIcon from "~/components/icons/instagram";

const navLinks = [
  { href: "/#praktisch", label: "Praktisch" },
  { href: "/#aankomende-activiteiten", label: "Aankomende activiteiten" },
  { href: "/kalender", label: "Kalender" },
  { href: "/#nieuws-updates", label: "Nieuws en updates" },
  { href: "/#leeftijdsgroepen", label: "Leeftijdsgroepen" },
  { href: "/#sponsors", label: "Sponsors" },
  { href: "/#contacteer-ons", label: "Contacteer ons" },
  { href: "/#hoofdleiding", label: "Hoofdleiding" },
  { href: "/privacyverklaring", label: "Privacyverklaring" },
];

export default function MobileNavSheet() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" aria-label="Open menu">
          <MenuIcon />
          <span className="sr-only">Menu tonen</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-8 sm:max-w-xs" side="left">
        <SheetHeader>
          <SheetTitle>Navigeer naar...</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-grow flex-col gap-4 font-medium">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Button
                  asChild
                  variant="link"
                  className="w-fit"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
          <Header4>Volg ons</Header4>
          <div className="mt-5 flex gap-4">
            <Link href="https://www.facebook.com/chirohouthulst">
              <FacebookIcon />
            </Link>
            <Link href="https://www.instagram.com/chirohouthulst">
              <InstagramIcon />
            </Link>
          </div>
        </nav>
        <SheetFooter className="sm:justify-center">
          <footer>
            <p>© Chiro Houthulst</p>
          </footer>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
