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
          <Button
            asChild
            variant="link"
            className="w-fit"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/#praktisch">Praktisch</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="w-fit"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/#aankomende-evenementen">Aankomende activiteiten</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="w-fit"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/kalender">Kalender</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="w-fit"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/#nieuws-updates">Nieuws en updates</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="w-fit"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/#leeftijdsgroepen">Leeftijdsgroepen</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="w-fit"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/#sponsors">Sponsors</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="w-fit"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/#contacteer-ons">Contacteer ons</Link>
          </Button>
        </nav>
        <SheetFooter className="sm:justify-center">
          <p>&copy; Chiro Houthulst</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
