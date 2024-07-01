"use client";

import React from "react";
import Image from "next/image";
import SearchBar from "./search-bar";
import MobileNavSheet from "./mobile-nav-sheet";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-md">
      <nav className="container flex flex-row items-center justify-between px-6 py-4 md:px-12 lg:px-24">
        <Link href="/">
          <Image
            src="/logo-black.svg"
            alt="Chiro Houthulst Logo"
            className="h-12"
            width={64}
            height={64}
          />
        </Link>
        <div className="flex flex-row gap-4">
          <SearchBar />
          <MobileNavSheet />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
