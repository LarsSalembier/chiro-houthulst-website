import { UserSearchbar } from "./user-searchbar";
import UserCard from "./user-card";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { type Metadata } from "next";
import { isAdmin } from "~/lib/auth";
import { type Role } from "types/globals";
import { getUsersByQuery } from "~/server/queries/user-queries";

export const metadata: Metadata = {
  title: "Adminportaal",
  description: "Beheer de gebruikers van de website.",
};

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  if (!isAdmin()) {
    return (
      <>
        <SignedIn>
          <div className="container relative flex flex-col gap-6 pb-8 md:pb-12 lg:pb-12">
            <PageHeader>
              <PageHeaderHeading>Adminportaal</PageHeaderHeading>
              <PageHeaderDescription>
                Je hebt geen toegang tot deze pagina. Wacht tot je account is
                goedgekeurd als administrator.
              </PageHeaderDescription>
            </PageHeader>
          </div>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    );
  }

  const users = await getUsersByQuery(params.searchParams.search);

  return (
    <>
      <SignedIn>
        <div className="container relative flex flex-col gap-6 pb-8 md:pb-12 lg:pb-12">
          <PageHeader>
            <PageHeaderHeading>Adminportaal</PageHeaderHeading>
            <PageHeaderDescription>
              Hier kan je alle gebruikers vinden en beheren.
            </PageHeaderDescription>
          </PageHeader>
          <UserSearchbar />
          <div className="flex flex-col gap-4">
            {users.map((user) => {
              return (
                <UserCard
                  key={user.id}
                  id={user.id}
                  primaryEmail={user.primaryEmailAddress?.emailAddress}
                  firstName={user.firstName ?? undefined}
                  lastName={user.lastName ?? undefined}
                  role={
                    user?.publicMetadata?.role
                      ? (user.publicMetadata.role as Role | undefined)
                      : undefined
                  }
                />
              );
            })}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
