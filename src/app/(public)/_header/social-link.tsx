import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";

export default function SocialLink({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Button variant="ghost" size="icon" asChild className="h-8 w-8 px-0">
      <Link href={href} target="_blank" rel="noreferrer">
        {children}
        <span className="sr-only">{label}</span>
      </Link>
    </Button>
  );
}
