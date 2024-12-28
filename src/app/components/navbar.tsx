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
} from "@nextui-org/react";
import ChiroHouthulstIcon from "../../components/icons/chiro-houthulst-icon";
import { useState } from "react";
import SearchIcon from "~/components/icons/search-icon";
import FacebookIcon from "~/components/icons/facebook-icon";
import InstagramIcon from "~/components/icons/instagram-icon";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ["Home"];

  return (
    <NextUiNavbar
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: "container mx-auto px-4 sm:px-8 md:px-16 lg:px-32",
        wrapper: "px-0 max-w-none",
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="flex gap-2">
          <ChiroHouthulstIcon
            aria-hidden="true"
            focusable="false"
            role="presentation"
          />
          <p className="hidden font-semibold text-inherit sm:flex">
            Chiro Sint-Jan Houthulst
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" justify="end" className="flex w-full gap-4">
        <Input
          className="hidden sm:flex"
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
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" href="/" size="lg">
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUiNavbar>
  );
}
