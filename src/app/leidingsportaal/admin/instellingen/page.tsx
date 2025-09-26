import { requireAdminAuth } from "~/lib/auth";
import { getAllMainLeaders, getAllVBs } from "~/app/contacts/actions";
import SettingsAdminClient from "./SettingsAdminClient";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";

export default async function SettingsAdminPage() {
  await requireAdminAuth();

  const [mainLeaders, vbs] = await Promise.all([
    getAllMainLeaders(),
    getAllVBs(),
  ]);

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { label: "Instellingen" },
  ];

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Instellingen</h1>
          <p className="text-gray-600">
            Beheer algemene instellingen en contactgegevens voor de website.
          </p>
        </div>

        <SettingsAdminClient
          initialMainLeaders={mainLeaders}
          initialVBs={vbs}
        />
      </div>
    </>
  );
}
