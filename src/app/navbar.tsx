"use client";

import {
  Navbar as NextUiNavbar,
  NavbarBrand,
  NavbarContent,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Input,
  NavbarItem,
} from "@nextui-org/react";
import { useState } from "react";
import SearchIcon from "~/components/icons/search-icon";
import FacebookIcon from "~/components/icons/facebook-icon";
import InstagramIcon from "~/components/icons/instagram-icon";
import ChiroHouthulstIcon from "~/components/icons/chiro-houthulst-icon";
import NextLink from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Welkom", href: "/" },
    { name: "Kalender", href: "/#kalender" },
    { name: "Chirozondagen", href: "/#chirozondagen" },
    { name: "Kamp", href: "/#kamp" },
    { name: "Inschrijven", href: "/#inschrijven" },
    { name: "Uniform", href: "/#uniform" },
    { name: "Verzekering", href: "/verzekeringen" },
    { name: "Contact", href: "#contact" },
    { name: "Privacyverklaring", href: "/privacyverklaring" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Leidingsportaal", href: "/leidingsportaal" },
  ];

  return (
    <NextUiNavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: "container mx-auto px-4 sm:px-8 md:px-16 xl:px-32",
        wrapper: "px-0 max-w-none",
      }}
    >
      <NavbarContent className="flex gap-6">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
        <NextLink href="/">
          <NavbarBrand className="flex gap-2">
            <ChiroHouthulstIcon
              aria-hidden="true"
              focusable="false"
              role="presentation"
            />
            <p className="hidden font-semibold text-inherit sm:flex">
              Sint-Jan Houthulst
            </p>
          </NavbarBrand>
        </NextLink>
        <NavbarItem className="hidden lg:flex">
          <Link href="/#kalender" color="foreground">
            Kalender
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link href="/#inschrijven" color="foreground">
            Inschrijven
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link href="/verzekeringen" color="foreground">
            Verzekering
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden xl:flex">
          <Link href="/#chirozondagen" color="foreground">
            Zondag
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden xl:flex">
          <Link href="/#kamp" color="foreground">
            Kamp
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end" className="flex w-full gap-4">
        <Input
          className="hidden max-w-64 sm:flex"
          placeholder="Zoek op de website..."
          startContent={
            <SearchIcon
              aria-hidden="true"
              focusable="false"
              role="presentation"
              size={18}
            />
          }
          type="search"
        />
        <Input
          className="flex sm:hidden"
          placeholder="Zoeken..."
          size="sm"
          startContent={
            <SearchIcon
              aria-hidden="true"
              focusable="false"
              role="presentation"
              size={18}
            />
          }
          type="search"
        />
        <div className="hidden gap-2 sm:flex">
          <Button
            as={Link}
            isIconOnly
            aria-label="Go to our Facebook page"
            href="https://www.facebook.com/chirohouthulst"
            isExternal
            variant="light"
          >
            <FacebookIcon size={24} />
          </Button>
          <Button
            as={Link}
            isIconOnly
            aria-label="Go to our Instagram page"
            href="https://www.instagram.com/chirohouthulst"
            isExternal
            variant="light"
          >
            <InstagramIcon size={24} />
          </Button>
        </div>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              className="w-full"
              href={item.href}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUiNavbar>
  );
}
