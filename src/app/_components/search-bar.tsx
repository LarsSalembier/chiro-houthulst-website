"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { cn } from "~/lib/utils";

type SiteLink = {
  id: string;
  label: string;
  url: string;
};

const siteLinks: SiteLink[] = [
  {
    id: "praktisch",
    label: "Praktisch",
    url: "/#praktisch",
  },
  {
    id: "aankomende activiteiten",
    label: "Aankomende activiteiten",
    url: "/#aankomende-evenementen",
  },
  {
    id: "kalender",
    label: "Kalender",
    url: "/kalender.jpg",
  },
  {
    id: "nieuws en updates",
    label: "Nieuws en updates",
    url: "/#nieuws-en-updates",
  },
  {
    id: "leeftijdsgroepen",
    label: "Leeftijdsgroepen",
    url: "/#leeftijdsgroepen",
  },
  {
    id: "sponsors",
    label: "Sponsors",
    url: "/#sponsors",
  },
  {
    id: "contacteer-ons",
    label: "Contacteer ons",
    url: "/#contacteer-ons",
  },
];

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState(siteLinks);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setValue(term);

    const results = siteLinks?.filter((link) =>
      link.label.toLowerCase().includes(term),
    );
    setSearchResults(results);
  };

  const handleSelect = (link: SiteLink) => {
    setValue(link.label);
    setOpen(false);

    router.push(link.url);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value || "Zoeken..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Zoeken..."
            onValueChange={handleSearchChange}
          />
          <CommandEmpty>Geen resultaten gevonden.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {searchResults?.map((link) => (
                <CommandItem key={link.id} onSelect={() => handleSelect(link)}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === link.label ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <Link href={link.url}>{link.label}</Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
