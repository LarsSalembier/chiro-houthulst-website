import { hasRole } from "~/utils/roles";
import { UserSearchbar } from "./user-searchbar";
import { clerkClient } from "@clerk/nextjs/server";
import UserCard from "./user-card";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Adminportaal",
  description: "Beheer de gebruikers van de website.",
};

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  if (!hasRole("admin")) {
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

  const query = params.searchParams.search;

  const users = query
    ? (await clerkClient.users.getUserList({ query })).data
    : (await clerkClient.users.getUserList()).data;

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
                      ? (user.publicMetadata.role as "admin" | undefined)
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
