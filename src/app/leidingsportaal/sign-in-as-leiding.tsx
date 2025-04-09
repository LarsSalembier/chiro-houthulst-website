"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";

export default function SignInAsLeiding() {
  return (
    <div className="flex gap-4">
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
    </div>
  );
}
