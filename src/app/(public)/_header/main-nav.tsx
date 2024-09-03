"use client";

import Link from "next/link";

import { Icons } from "~/components/icons";
import NavigationItem from "./navigation-item";
import { type MainNavigationItem } from "~/types/nav";

interface MainNavProps {
  logoName: string;
  logoShortName: string;
  navigationItems: MainNavigationItem[];
}

export default function MainNav({
  logoName,
  logoShortName,
  navigationItems,
}: MainNavProps) {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-1 lg:mr-6">
        <Icons.Logo className="mb-1 h-6 w-6" />
        <span className="hidden font-bold xl:inline-block">{logoName}</span>
        <span className="hidden font-bold md:inline-block xl:hidden">
          {logoShortName}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {navigationItems.map((navItem) => (
          <NavigationItem key={navItem.title} navItem={navItem} />
        ))}
      </nav>
    </div>
  );
}
