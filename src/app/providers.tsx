"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { HeroUIProvider } from "@heroui/react";
import { nlNL } from "@clerk/localizations";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={nlNL}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </ClerkProvider>
  );
}
