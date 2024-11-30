"use client";

import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const MultistepFormContextProvider = dynamic(
  () => import("./registration-form-context"),
  {
    ssr: false,
  },
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <MultistepFormContextProvider>
          <div className="container relative flex flex-col gap-6">
            {children}
          </div>
        </MultistepFormContextProvider>
      </SignedIn>
    </>
  );
}
