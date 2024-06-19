"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const queryTerm = formData.get("search") as string;

        const searchParams = new URLSearchParams();
        searchParams.set("search", queryTerm);

        router.push(`${pathname}?${searchParams.toString()}`);
      }}
      className="flex items-center gap-2"
    >
      <label htmlFor="search" className="sr-only">
        Search for Users
      </label>
      <Input
        id="search"
        name="search"
        type="text"
        placeholder="Zoek gebruikers..."
      />
      <Button type="submit">Zoeken</Button>
    </form>
  );
};
