import Link from "next/link";

import { siteConfig } from "~/config/site";
import { SearchMenu } from "./search-menu";
import { Icons } from "~/components/icons";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";
import { Button } from "../ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchMenu />
          </div>
          <nav className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 px-0"
            >
              <Link
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noreferrer"
              >
                <Icons.Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 px-0"
            >
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <Icons.Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
            <ModeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </nav>
        </div>
      </div>
    </header>
  );
}
