"use client";

import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
} from "~/components/page-header";
import AddWorkyearForm from "./add-workyear-form";

export default function CreateNewWorkyearPage() {
  return (
    <div className="container relative flex flex-col gap-6">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <PageHeader>
          <PageHeaderHeading>Voeg nieuw werkjaar toe</PageHeaderHeading>
          <PageHeaderDescription>
            Vul onderstaand formulier in om een nieuw werkjaar toe te voegen.
          </PageHeaderDescription>
        </PageHeader>
        <div className="pb-8 md:pb-12 lg:pb-12">
          <AddWorkyearForm />
        </div>
      </SignedIn>
    </div>
  );
}
