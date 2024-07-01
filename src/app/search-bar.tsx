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

interface SiteLink {
  id: string;
  label: string;
  url: string;
}

const siteLinks: SiteLink[] = [
  {
    id: "praktisch",
    label: "Praktisch",
    url: "/#praktisch",
  },
  {
    id: "zondag",
    label: "Zondag",
    url: "/#zondag",
  },
  {
    id: "kamp",
    label: "Kamp",
    url: "/#kamp",
  },
  {
    id: "inschrijving",
    label: "Inschrijving",
    url: "/#inschrijving",
  },
  {
    id: "uniform",
    label: "Uniform",
    url: "/#uniform",
  },
  {
    id: "aankomende activiteiten",
    label: "Aankomende activiteiten",
    url: "/#aankomende-activiteiten",
  },
  {
    id: "kalender",
    label: "Kalender",
    url: "/kalender",
  },
  {
    id: "nieuws en updates",
    label: "Nieuws en updates",
    url: "/#nieuws-updates",
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
  {
    id: "hoofdleiding",
    label: "Hoofdleiding",
    url: "/#hoofdleiding",
  },
  {
    id: "privacyverklaring",
    label: "Privacyverklaring",
    url: "/privacyverklaring",
  },
  {
    id: "verzekering",
    label: "Verzekering",
    url: "/verzekeringen",
  },
  {
    id: "ongeval",
    label: "Ongeval",
    url: "/verzekeringen",
  },
];

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const searchResults = siteLinks.filter((link) =>
    link.label.toLowerCase().includes(value.toLowerCase()),
  );

  const handleSearchChange = (term: string) => {
    setValue(term);
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
            value={value}
            onValueChange={handleSearchChange}
          />
          {searchResults.length === 0 && (
            <CommandEmpty>Geen resultaten gevonden.</CommandEmpty>
          )}
          <CommandList>
            {searchResults.length > 0 && (
              <CommandGroup>
                {searchResults.map((link) => (
                  <CommandItem
                    key={link.id}
                    onSelect={() => handleSelect(link)}
                  >
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
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
