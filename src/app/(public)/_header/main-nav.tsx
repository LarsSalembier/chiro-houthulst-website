"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { Icons } from "~/components/icons";
import { navigationConfig } from "~/config/navigation";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-1 lg:mr-6">
        <Icons.Logo className="mb-1 h-6 w-6" />
        <span className="hidden font-bold xl:inline-block">
          {siteConfig.logoName}
        </span>
        <span className="hidden font-bold md:inline-block xl:hidden">
          {siteConfig.logoShortName}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {navigationConfig.mainNav.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-foreground" : "text-foreground/60",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
