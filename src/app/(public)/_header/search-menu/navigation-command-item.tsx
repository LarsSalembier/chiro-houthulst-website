import * as React from "react";
import { CommandItem } from "~/components/ui/command";
import { Icons } from "~/components/icons";
import { useRouter } from "next/navigation";

interface NavigationCommandItemProps {
  navItem: {
    title: string;
    href: string;
    icon: keyof typeof Icons;
  };
  runCommand: (command: () => unknown) => void;
}

export default function NavigationCommandItem({
  navItem,
  runCommand,
}: NavigationCommandItemProps) {
  const router = useRouter();
  const Icon = Icons[navItem.icon];

  return (
    <CommandItem
      key={navItem.href}
      value={navItem.title}
      onSelect={() => {
        runCommand(() => router.push(navItem.href));
      }}
    >
      <div className="mr-2 flex h-4 w-4 items-center justify-center">
        <Icon className="h-3 w-3" />
      </div>
      {navItem.title}
    </CommandItem>
  );
}
