import { requireAdminAuth } from "~/lib/auth";
import { getAllEvents } from "./actions";
import CalendarAdminClient from "./CalendarAdminClient";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";

export default async function CalendarAdminPage() {
  await requireAdminAuth();

  const events = await getAllEvents();

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { label: "Kalenderbeheer" },
  ];

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Kalenderbeheer</h1>
          <p className="text-gray-600">
            Beheer alle evenementen en activiteiten van de Chiro.
          </p>
        </div>

        <CalendarAdminClient initialEvents={events} />
      </div>
    </>
  );
}
