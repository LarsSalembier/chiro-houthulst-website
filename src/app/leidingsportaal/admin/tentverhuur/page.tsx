import { requireAdminAuth } from "~/lib/auth";
import { getAllTentRentals, getAllTentRentalTerms } from "./actions";
import TentverhuurAdminClient from "./TentverhuurAdminClient";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";

export default async function TentverhuurAdminPage() {
  await requireAdminAuth();

  const [tentRentals, tentRentalTerms] = await Promise.all([
    getAllTentRentals(),
    getAllTentRentalTerms(),
  ]);

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { href: "/leidingsportaal/admin", label: "Admin" },
    { label: "Tentenverhuur" },
  ];

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Tentenverhuur</h1>
          <p className="text-gray-600">
            Beheer de catalogus van beschikbare tenten voor verhuur.
          </p>
        </div>

        <TentverhuurAdminClient
          initialTentRentals={tentRentals}
          initialTentRentalTerms={tentRentalTerms}
        />
      </div>
    </>
  );
}
