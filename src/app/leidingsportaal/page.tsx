"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import BlogText from "~/components/ui/blog-text";

export default function Leidingsportaal() {
  return (
    <BlogText className="mx-auto pt-16">
      <h1>Leidingsportaal</h1>
      <p>
        Welkom op het leidingsportaal van Chiro Sint-Jan Houthulst. Hier vind je
        alle informatie die je nodig hebt als leiding.
      </p>
      <div className="flex gap-4">
        <SignedOut>
          <SignInButton>
            <Button size="lg" color="primary">
              Inloggen als leiding
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button size="lg" color="primary" variant="flat">
              Registreren als leiding
            </Button>
          </SignUpButton>
        </SignedOut>
      </div>
      <SignedIn>
        Welkom, <UserButton />!
      </SignedIn>
    </BlogText>
  );
}
