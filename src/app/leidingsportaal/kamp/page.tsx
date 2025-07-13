import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import {
  Tent,
  Users,
  Euro,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  Printer,
  MapPin,
  FileText,
  CreditCard,
  Banknote,
  Smartphone,
  Settings,
} from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import SignInAsLeiding from "../sign-in-as-leiding";
import { requireLeidingAuth } from "~/lib/auth";
import { WORK_YEAR_QUERIES } from "~/server/db/queries/work-year-queries";
import { MEMBER_QUERIES } from "~/server/db/queries/member-queries";
import { GROUP_QUERIES } from "~/server/db/queries/group-queries";
import TableLink from "~/components/ui/table-link";
import { type Group, type YearlyMembership } from "~/server/db/schema";

export default async function KampPage() {
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
  const campSubscriptions =
    await MEMBER_QUERIES.getCampSubscriptionsForWorkYear(workYear.id);

  // Get all groups for reference
  const groups = await GROUP_QUERIES.getAll({ activeOnly: true });

  // Calculate overall statistics
  const totalSubscriptions = campSubscriptions.length;
  const paidSubscriptions = campSubscriptions.filter(
    (sub) => sub.campPaymentReceived,
  ).length;
  const pendingPayments = totalSubscriptions - paidSubscriptions;
  const paymentPercentage =
    totalSubscriptions > 0
      ? Math.round((paidSubscriptions / totalSubscriptions) * 100)
      : 0;

  // Calculate payment method statistics
  const paymentMethods = campSubscriptions.reduce(
    (acc, sub) => {
      if (sub.campPaymentMethod) {
        acc[sub.campPaymentMethod] = (acc[sub.campPaymentMethod] ?? 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Group subscriptions by group
  const subscriptionsByGroup = groups.reduce(
    (acc, group) => {
      const groupSubscriptions = campSubscriptions.filter(
        (sub) => sub.groupId === group.id,
      );
      if (groupSubscriptions.length > 0) {
        acc[group.id] = {
          group,
          subscriptions: groupSubscriptions,
          total: groupSubscriptions.length,
          paid: groupSubscriptions.filter((sub) => sub.campPaymentReceived)
            .length,
        };
      }
      return acc;
    },
    {} as Record<
      number,
      {
        group: Group;
        subscriptions: YearlyMembership[];
        total: number;
        paid: number;
      }
    >,
  );

  // Calculate revenue
  const totalRevenue = paidSubscriptions * (workYear.campPrice ?? 175);
  const pendingRevenue = pendingPayments * (workYear.campPrice ?? 175);

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { label: "Kamp" },
  ];

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "CASH":
        return "Contant";
      case "BANK_TRANSFER":
        return "Overschrijving";
      case "PAYCONIQ":
        return "Payconiq";
      case "OTHER":
        return "Anders";
      default:
        return method;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "CASH":
        return <Banknote className="h-4 w-4" />;
      case "BANK_TRANSFER":
        return <CreditCard className="h-4 w-4" />;
      case "PAYCONIQ":
        return <Smartphone className="h-4 w-4" />;
      case "OTHER":
        return <Settings className="h-4 w-4" />;
      default:
        return <Euro className="h-4 w-4" />;
    }
  };

  return (
    <>
      <BreadcrumbsWrapper items={breadcrumbItems} />

      <BlogTextNoAnimation>
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-orange-100 p-4">
              <Tent className="h-16 w-16 text-orange-600" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="!mb-0 !mt-0 !pb-0 !pt-0 text-4xl font-bold leading-tight">
                Kamp {workYear.startDate.getFullYear()}
              </h1>
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
                    <p className="text-2xl font-bold">{totalSubscriptions}</p>
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
                    <p className="text-2xl font-bold">{paidSubscriptions}</p>
                    <p className="text-xs text-gray-500">
                      {paymentPercentage}%
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-yellow-100 p-3">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Openstaand</p>
                    <p className="text-2xl font-bold">{pendingPayments}</p>
                    <p className="text-xs text-gray-500">
                      {totalSubscriptions > 0
                        ? Math.round(
                            (pendingPayments / totalSubscriptions) * 100,
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Euro className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Omzet</p>
                    <p className="text-2xl font-bold">€{totalRevenue}</p>
                    <p className="text-xs text-gray-500">
                      €{pendingRevenue} openstaand
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Camp Information */}
            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <FileText className="h-5 w-5" />
                  Kamp informatie
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <Euro className="h-5 w-5 text-green-600" />
                      Prijs
                    </h3>
                    <p className="text-lg font-semibold">
                      €{workYear.campPrice ?? 175} per lid
                    </p>
                    <p className="text-sm text-gray-600">
                      €{workYear.campPrice ? workYear.campPrice - 10 : 165} voor
                      tweede kind
                    </p>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <MapPin className="h-5 w-5 text-red-600" />
                      Betalingsgegevens
                    </h3>
                    <div className="space-y-2">
                      <p className="font-medium">IBAN: BE71 0018 7690 8469</p>
                      <p className="text-sm text-gray-600">
                        Vermeld naam van het lid bij betaling
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <CreditCard className="h-5 w-5" />
                  Betalingsmethoden
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {Object.entries(paymentMethods).length > 0 ? (
                    Object.entries(paymentMethods).map(([method, count]) => (
                      <div
                        key={method}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          {getPaymentMethodIcon(method)}
                          <span className="font-medium">
                            {getPaymentMethodLabel(method)}
                          </span>
                        </div>
                        <Badge color="primary" variant="flat">
                          {count}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Nog geen betalingsmethoden geregistreerd
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Group Statistics */}
          <Card>
            <CardHeader className="px-6 py-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <BarChart3 className="h-5 w-5" />
                Statistieken per groep
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.values(subscriptionsByGroup)
                  .sort((a, b) => b.total - a.total)
                  .map(({ group, total, paid }) => (
                    <div
                      key={group.id}
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: group.color
                          ? `${group.color}40`
                          : "#e5e7eb",
                        backgroundColor: group.color
                          ? `${group.color}10`
                          : "#f9fafb",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{
                              backgroundColor: group.color ?? "#6b7280",
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {group.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {paid}/{total} betaald
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{total}</p>
                          <p className="text-xs text-gray-500">
                            {total > 0 ? Math.round((paid / total) * 100) : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardBody>
          </Card>

          {/* All Camp Subscriptions */}
          <Card>
            <CardHeader className="px-6 py-3">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Users className="h-5 w-5" />
                  Alle kamp inschrijvingen
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="bordered"
                    size="sm"
                    startContent={<Download className="h-4 w-4" />}
                  >
                    Exporteer
                  </Button>
                  <Button
                    variant="bordered"
                    size="sm"
                    startContent={<Printer className="h-4 w-4" />}
                  >
                    Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-3">
                {campSubscriptions.length > 0 ? (
                  campSubscriptions
                    .sort((a, b) => {
                      // Sort by group age (oldest first), then by name
                      const groupAgeDiff =
                        (b.group.minimumAgeInDays ?? 0) -
                        (a.group.minimumAgeInDays ?? 0);
                      if (groupAgeDiff !== 0) return groupAgeDiff;

                      const lastNameDiff = a.member.lastName.localeCompare(
                        b.member.lastName,
                      );
                      if (lastNameDiff !== 0) return lastNameDiff;

                      return a.member.firstName.localeCompare(
                        b.member.firstName,
                      );
                    })
                    .map((subscription) => (
                      <div
                        key={subscription.memberId}
                        className={`flex items-center justify-between rounded-lg p-4 ${
                          subscription.campPaymentReceived
                            ? "border border-green-200 bg-green-50"
                            : "border border-yellow-200 bg-yellow-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor:
                                subscription.group.color ?? "#6b7280",
                            }}
                          />
                          <div>
                            <TableLink
                              href={`/leidingsportaal/leden/${subscription.memberId}`}
                            >
                              {subscription.member.firstName}{" "}
                              {subscription.member.lastName}
                            </TableLink>
                            <p className="text-sm text-gray-600">
                              {subscription.group.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {subscription.campPaymentMethod && (
                            <Chip size="sm" variant="flat">
                              {getPaymentMethodLabel(
                                subscription.campPaymentMethod,
                              )}
                            </Chip>
                          )}
                          <Badge
                            color={
                              subscription.campPaymentReceived
                                ? "success"
                                : "warning"
                            }
                            variant="flat"
                          >
                            {subscription.campPaymentReceived ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Betaald
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Openstaand
                              </div>
                            )}
                          </Badge>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="py-8 text-center">
                    <Tent className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">
                      Nog geen kamp inschrijvingen
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </SignedIn>
    </>
  );
}
