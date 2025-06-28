import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import {
  Users,
  Utensils,
  RefreshCw,
  Download,
  Printer,
  Users2,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import SignInAsLeiding from "../sign-in-as-leiding";
import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import { MEMBER_QUERIES } from "~/server/db/queries/member-queries";
import { GROUP_QUERIES } from "~/server/db/queries/group-queries";
import { requireLeidingAuth } from "~/lib/auth";
import TableDistribution from "~/features/leidingsportaal/table-distribution";
import type { Group, WorkYear } from "~/server/db/schema";

export default async function TableDistributionPage() {
  // Check if user has leiding role - this will redirect if not authorized
  await requireLeidingAuth();

  const workYear = await WORK_YEAR_QUERIES.getByDate();

  if (!workYear) {
    return (
      <BlogTextNoAnimation>
        <div className="py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Geen actief werkjaar</h1>
          <p className="text-gray-600">
            Er is momenteel geen actief werkjaar gevonden.
          </p>
        </div>
      </BlogTextNoAnimation>
    );
  }

  // Get all camp subscriptions for the current work year
  const campSubscriptions = await MEMBER_QUERIES.getCampSubscriptionsForWorkYear(
    workYear.id,
  );

  // Get all groups for reference
  const groups = await GROUP_QUERIES.getAll({ activeOnly: true });

  // Filter only paid subscriptions
  const paidSubscriptions = campSubscriptions.filter(
    (sub) => sub.campPaymentReceived,
  );

  // Group members by their group
  const membersByGroup = groups.reduce((acc: Record<number, { group: Group; members: any[]; count: number }>, group: Group) => {
    const groupMembers = paidSubscriptions.filter(
      (sub) => sub.groupId === group.id,
    );
    if (groupMembers.length > 0) {
      acc[group.id] = {
        group,
        members: groupMembers,
        count: groupMembers.length,
      };
    }
    return acc;
  }, {});

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { label: "Tafelverdeling" },
  ];

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <BlogTextNoAnimation>
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-orange-100 p-4">
              <Utensils className="h-16 w-16 text-orange-600" />
            </div>
            <div className="flex flex-col justify-center">
              <h1
                className="!mb-0 !mt-0 mb-0 !pb-0 !pt-0 pb-0 text-4xl font-bold leading-tight"
                style={{ margin: 0, padding: 0 }}
              >
                Tafelverdeling Kamp
              </h1>
              <p
                className="!mb-0 mt-1 !pb-0 text-base text-gray-600"
                style={{ marginBottom: 0, paddingBottom: 0 }}
              >
                Automatische verdeling van leden over tafels
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-4">
          <SignedOut>
            <SignInAsLeiding />
          </SignedOut>
        </div>
      </BlogTextNoAnimation>

      <SignedIn>
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Overview Statistics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Totaal ingeschreven</p>
                    <p className="text-2xl font-bold">{campSubscriptions.length}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Betaald</p>
                    <p className="text-2xl font-bold">{paidSubscriptions.length}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <Utensils className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aantal tafels</p>
                    <p className="text-2xl font-bold">
                      {Math.ceil(paidSubscriptions.length / 8.5)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Users2 className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Groepen</p>
                    <p className="text-2xl font-bold">
                      {Object.keys(membersByGroup).length}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Group Distribution Overview */}
          <Card>
            <CardHeader className="px-6 py-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <BarChart3 className="h-5 w-5" />
                Verdeling per groep
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.values(membersByGroup).map(({ group, count }) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                    style={{
                      borderColor: group.color ? `${group.color}40` : "#e5e7eb",
                      backgroundColor: group.color ? `${group.color}10` : "#f9fafb",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: group.color ?? "#6b7280" }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{group.name}</p>
                        <p className="text-sm text-gray-600">
                          {count} {count === 1 ? "lid" : "leden"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      color="primary"
                      variant="flat"
                      style={{
                        backgroundColor: group.color ? `${group.color}20` : undefined,
                        color: group.color ? group.color : undefined,
                      }}
                    >
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Table Distribution Component */}
          {paidSubscriptions.length > 0 ? (
            <TableDistribution
              members={paidSubscriptions}
              groups={groups}
              workYear={workYear}
            />
          ) : (
            <Card>
              <CardBody className="p-12 text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Geen betaalde kampinschrijvingen
                </h3>
                <p className="text-gray-600">
                  Er zijn nog geen betaalde kampinschrijvingen om te verdelen over tafels.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </SignedIn>
    </>
  );
} 