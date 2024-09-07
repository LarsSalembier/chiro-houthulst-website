"use client";

import * as React from "react";

import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import MobileNavContent from "./mobile-nav-content";
import { type SidebarNavGroup } from "~/types/nav";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";

interface MobileNavProps {
  sidebarNavGroups: SidebarNavGroup[];
}

export default function MobileNav({ sidebarNavGroups }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.Hamburger className="h-5 w-5" />
          <span className="sr-only">Menu openen</span>
        </Button>
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
