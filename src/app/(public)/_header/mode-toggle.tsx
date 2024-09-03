"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import ThemeToggleButton from "./theme-toggle-button";

export default function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ThemeToggleButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Licht
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Donker
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Systeem
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
