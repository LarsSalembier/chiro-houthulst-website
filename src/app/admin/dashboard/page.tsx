import { redirect } from "next/navigation";
import { checkRole } from "~/utils/roles";
import { SearchUsers } from "./_components/search-users";
import { clerkClient } from "@clerk/nextjs/server";
import setRole from "./_actions/set-role";
import { deleteUser } from "./_actions/delete-user";

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = params.searchParams.search;

  const users = query
    ? (await clerkClient.users.getUserList({ query })).data
    : [];

  return (
    <>
      <SearchUsers />

      {users.map((user) => {
        return (
          <div key={user.id}>
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div>
              {
                user.emailAddresses.find(
                  (email) => email.id === user.primaryEmailAddressId,
                )?.emailAddress
              }
            </div>
            <div>{user.publicMetadata.role as string}</div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="admin" name="role" />
                <button type="submit">Maak gebruiker administrator</button>
              </form>
            </div>
            <div>
              <form action={deleteUser}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="user" name="role" />
                <button type="submit">Verwijder gebruiker</button>
              </form>
            </div>
          </div>
        );
      })}
    </>
  );
}
