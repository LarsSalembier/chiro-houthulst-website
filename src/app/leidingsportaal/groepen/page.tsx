import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Plus, UserCheck, ArrowRight, Users2 } from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import SignInAsLeiding from "../sign-in-as-leiding";
import { getGroupsWithMemberCount } from "./actions";
import { requireLeidingAuth } from "~/lib/auth";
import { formatDateLocale } from "~/lib/date-utils";

export default async function GroepenPage() {
  // Check if user has leiding role - this will redirect if not authorized
  await requireLeidingAuth();

  const { groups, workYear } = await getGroupsWithMemberCount();

  // Filter to only show active groups
  const activeGroups = groups.filter((group) => group.group.active);

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { label: "Groepen" },
  ];

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <BlogTextNoAnimation>
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Chirogroepen</h1>
          <p className="max-w-2xl text-xl text-gray-600">
            Beheer en bekijk de verschillende leeftijdsgroepen van de Chiro.
            {workYear && (
              <span className="mt-2 block text-lg font-medium text-gray-600">
                Werkjaar: {formatDateLocale(workYear.startDate)} -{" "}
                {formatDateLocale(workYear.endDate)}
              </span>
            )}
          </p>
        </div>

        <div className="mb-8 flex gap-4">
          <SignedOut>
            <SignInAsLeiding />
          </SignedOut>
        </div>
      </BlogTextNoAnimation>

      <SignedIn>
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {activeGroups.map(({ group, memberCount }) => {
              // Calculate ages in years (rounded)
              const minAge = Math.round(group.minimumAgeInDays / 365.25);
              const maxAge = group.maximumAgeInDays
                ? Math.round(group.maximumAgeInDays / 365.25)
                : null;

              // Special case for Aspis - show infinity instead of calculated max age
              const displayMaxAge =
                group.name.toLowerCase() === "aspis" ? null : maxAge;

              // Get gender display text - only show if specific
              const genderText =
                group.gender === "M"
                  ? "Jongens"
                  : group.gender === "F"
                    ? "Meisjes"
                    : null;

              return (
                <Card key={group.id} className="flex cursor-pointer flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-lg p-3"
                        style={{
                          backgroundColor: group.color
                            ? `${group.color}20` // 20% opacity
                            : "#3b82f620",
                        }}
                      >
                        <Users2
                          className="h-8 w-8"
                          style={{
                            color: group.color ?? "#3b82f6",
                          }}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{group.name}</h2>
                        <p className="text-sm text-gray-600">
                          {minAge} - {displayMaxAge ?? "∞"} jaar
                          {genderText && ` • ${genderText}`}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="flex flex-1 flex-col pt-0">
                    {group.description && (
                      <p className="mb-4 flex-1 text-gray-700">
                        {group.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-900">
                          {memberCount} {memberCount === 1 ? "lid" : "leden"}
                        </span>
                      </div>
                      <Button
                        color="primary"
                        variant="flat"
                        as="a"
                        href={`/leidingsportaal/groepen/${group.id}`}
                        endContent={<ArrowRight className="h-4 w-4" />}
                      >
                        Bekijk groep
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {activeGroups.length === 0 && (
            <Card className="py-12 text-center">
              <CardBody>
                <UserCheck className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold">
                  Geen actieve groepen gevonden
                </h3>
                <p className="mb-4 text-gray-600">
                  {workYear
                    ? "Er zijn geen actieve groepen voor het huidige werkjaar."
                    : "Er is geen actief werkjaar gevonden."}
                </p>
                <Button
                  color="primary"
                  startContent={<Plus className="h-4 w-4" />}
                >
                  Eerste groep aanmaken
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </SignedIn>
    </>
  );
}
