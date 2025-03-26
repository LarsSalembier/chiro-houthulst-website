"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import { nlNL } from "@clerk/localizations";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={nlNL}>
      <NextUIProvider>{children}</NextUIProvider>
    </ClerkProvider>
  );
}
