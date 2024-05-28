import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Footer() {
  return (
    <footer className="flex w-full justify-center border-t p-4">
      <div className="flex w-full max-w-7xl items-center justify-between">
        <span className="text-md">© 2024 Chiro Houthulst</span>
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </footer>
  );
}
