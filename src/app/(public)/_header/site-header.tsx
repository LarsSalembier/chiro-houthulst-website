import { siteConfig } from "~/config/site";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { navigationConfig } from "~/config/navigation";
import MainNav from "./main-nav";
import MobileNav from "./mobile-nav/mobile-nav";
import SearchMenu from "./search-menu/search-menu";
import { Icons } from "~/components/icons";
import ModeToggle from "./mode-toggle";
import SocialLink from "./social-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav
          logoName={siteConfig.logoName}
          logoShortName={siteConfig.logoShortName}
          navigationItems={navigationConfig.mainNav}
        />
        <MobileNav sidebarNavGroups={navigationConfig.sidebarNavGroups} />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchMenu />
          </div>
          <nav className="flex items-center gap-1">
            <SocialLink href={siteConfig.links.facebook} label="Facebook">
              <Icons.Facebook className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={siteConfig.links.instagram} label="Instagram">
              <Icons.Instagram className="h-4 w-4" />
            </SocialLink>
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
