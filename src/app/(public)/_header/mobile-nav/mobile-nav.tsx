"use client";

import * as React from "react";

import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import MobileNavContent from "./mobile-nav-content";
import { type SidebarNavGroup } from "~/types/nav";
import HamburgerButton from "./hamburger-button";

interface MobileNavProps {
  sidebarNavGroups: SidebarNavGroup[];
}

export default function MobileNav({ sidebarNavGroups }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <HamburgerButton />
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileNavContent
          sidebarNavGroups={sidebarNavGroups}
          closeSheet={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
