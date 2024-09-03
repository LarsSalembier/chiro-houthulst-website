"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";

interface NavigationItemProps {
  navItem: {
    title: string;
    href: string;
  };
  onClick?: () => void;
}

export default function NavigationItem({
  navItem,
  onClick,
}: NavigationItemProps) {
  const pathname = usePathname();
  const isActive = pathname === navItem.href;

  return (
    <Link
      key={navItem.title}
      href={navItem.href}
      onClick={onClick}
      className={cn(
        "transition-colors hover:text-foreground/80",
        isActive ? "text-foreground" : "text-foreground/60",
      )}
    >
      {navItem.title}
    </Link>
  );
}
