"use client";

import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
} from "~/components/page-header";
import AddMemberDialog from "./add-member-form";

export default function RegisterNewMemberPage() {
  return (
    <div className="container relative flex flex-col gap-6">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <PageHeader>
          <PageHeaderHeading>
            Schrijf je nu in als lid van Chiro Houthulst!
          </PageHeaderHeading>
          <PageHeaderDescription>
            Vul onderstaand formulier in om je kind of jezelf in te schrijven.
          </PageHeaderDescription>
        </PageHeader>
        <div className="pb-8 md:pb-12 lg:pb-12">
          <AddMemberDialog />
        </div>
      </SignedIn>
    </div>
  );
}
