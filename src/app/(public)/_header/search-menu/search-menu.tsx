"use client";

import * as React from "react";

import { navigationConfig } from "~/config/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "~/components/ui/command";
import { type DialogProps } from "@radix-ui/react-dialog";
import SearchInput from "./search-input";
import NavigationCommandItem from "./navigation-command-item";

export default function SearchMenu({ ...props }: DialogProps) {
  const [open, setOpen] = React.useState(false);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <SearchInput openDialog={() => setOpen(true)} />
      <CommandDialog open={open} onOpenChange={setOpen} {...props}>
        <CommandInput placeholder="Zoek naar..." />
        <CommandList>
          <CommandEmpty>Geen resultaten gevonden.</CommandEmpty>
          {navigationConfig.sidebarNavGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem) => {
                return (
                  <NavigationCommandItem
                    key={navItem.href}
                    navItem={navItem}
                    runCommand={runCommand}
                  />
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
