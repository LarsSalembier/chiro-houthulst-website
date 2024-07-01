import { redirect } from "next/navigation";
import { checkRole } from "~/utils/roles";
import { SearchUsers } from "./search-users";
import { clerkClient } from "@clerk/nextjs/server";
import UserCard from "./user-card";

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = params.searchParams.search;

  const users = query
    ? (await clerkClient.users.getUserList({ query })).data
    : (await clerkClient.users.getUserList()).data;

  return (
    <>
      <SearchUsers />
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
                  ? (user.publicMetadata.role as "user" | "admin")
                  : undefined
              }
            />
          );
        })}
      </div>
    </>
  );
}
