import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Users } from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import { requireAdminAuth } from "~/lib/auth";
import { getAllUsers, canRemoveSelfAsAdmin } from "../actions";
import AdminUserManagement from "../AdminUserManagement";

export default async function UserManagementPage() {
  // Check if user has admin role - this will redirect if not authorized
  await requireAdminAuth();

  const users = await getAllUsers();
  const canRemoveSelf = await canRemoveSelfAsAdmin();

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { label: "Gebruikersbeheer" },
  ];

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <BlogTextNoAnimation>
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-4">
              <Users className="h-16 w-16 text-green-600" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="!mb-0 !mt-0 !pb-0 !pt-0 text-4xl font-bold leading-tight">
                Gebruikersbeheer
              </h1>
              <p className="!mb-0 mt-1 !pb-0 text-base text-gray-600">
                Beheer gebruikers en hun rollen • {users.length} gebruikers
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-4">
          <SignedOut>
            <div className="text-center">
              <p className="text-gray-600">
                Je moet ingelogd zijn om deze pagina te bekijken.
              </p>
            </div>
          </SignedOut>
        </div>
      </BlogTextNoAnimation>

      <SignedIn>
        <div className="mx-auto max-w-6xl">
          <AdminUserManagement users={users} />
        </div>
      </SignedIn>
    </>
  );
}
