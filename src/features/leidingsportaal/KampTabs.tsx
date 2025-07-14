"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Users,
  Heart,
  BookOpen,
  UserPlus,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Tent,
  Stethoscope,
  Phone,
  Euro,
  Clock,
  BarChart3,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  Settings,
  FileText,
  MapPin,
} from "lucide-react";
import MembersTable from "./members-table";
import GroupMedicalInfo from "./GroupMedicalInfo";
import type { Member, Group } from "~/server/db/schema";

interface MemberWithMedical extends Member {
  parents: Array<{
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    relationship: string;
    address: {
      street: string;
      houseNumber: string;
      postalCode: number;
      municipality: string;
    };
    isPrimary: boolean;
  }>;
  emergencyContact: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    relationship: string | null;
  } | null;
  medicalInformation: {
    doctorFirstName: string;
    doctorLastName: string;
    doctorPhoneNumber: string;
    tetanusVaccination: boolean;
    asthma: boolean;
    asthmaInformation: string | null;
    bedwetting: boolean;
    bedwettingInformation: string | null;
    epilepsy: boolean;
    epilepsyInformation: string | null;
    heartCondition: boolean;
    heartConditionInformation: string | null;
    hayFever: boolean;
    hayFeverInformation: string | null;
    skinCondition: boolean;
    skinConditionInformation: string | null;
    rheumatism: boolean;
    rheumatismInformation: string | null;
    sleepwalking: boolean;
    sleepwalkingInformation: string | null;
    diabetes: boolean;
    diabetesInformation: string | null;
    foodAllergies: string | null;
    substanceAllergies: string | null;
    medicationAllergies: string | null;
    medication: string | null;
    otherMedicalConditions: string | null;
    getsTiredQuickly: boolean;
    canParticipateSports: boolean;
    canSwim: boolean;
    otherRemarks: string | null;
    permissionMedication: boolean;
  } | null;
  yearlyMembership?: {
    campSubscription?: boolean;
    campPaymentReceived?: boolean;
    campPaymentMethod?: string | null;
    campPaymentDate?: Date | null;
    paymentReceived?: boolean;
    paymentMethod?: string | null;
    paymentDate?: Date | null;
    group?: Group;
  };
}

type MemberTableData = Member & {
  name: string;
  group: Group | null;
  parentNames: string;
  parentPhoneNumbers: string;
  parentEmailAddresses: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  doctorName: string;
  doctorPhoneNumber: string;
  tetanusVaccination: boolean;
  asthma: boolean;
  bedwetting: boolean;
  epilepsy: boolean;
  heartCondition: boolean;
  hayFever: boolean;
  skinCondition: boolean;
  rheumatism: boolean;
  sleepwalking: boolean;
  diabetes: boolean;
  foodAllergies: string;
  substanceAllergies: string;
  medicationAllergies: string;
  medication: string;
  otherMedicalConditions: string;
  getsTiredQuickly: boolean;
  canParticipateSports: boolean;
  canSwim: boolean;
  otherRemarks: string;
  permissionMedication: boolean;
  emailAddress: string;
  phoneNumber: string;
  gdprPermissionToPublishPhotos: boolean;
  paymentReceived: boolean;
  paymentMethod: string;
  paymentDate?: Date;
};

interface KampTabsProps {
  campMembers: MemberWithMedical[];
  campMemberData: MemberTableData[];
  totalSubscriptions: number;
  paidSubscriptions: number;
  pendingPayments: number;
  paymentPercentage: number;
  totalRevenue: number;
  pendingRevenue: number;
  paymentMethods: Record<string, number>;
  subscriptionsByGroup: Record<
    number,
    {
      group: Group;
      subscriptions: MemberWithMedical[];
      total: number;
      paid: number;
    }
  >;
  workYear: {
    startDate: Date;
    endDate: Date;
    campPrice: number | null;
  };
}

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

export default function KampTabs({
  campMembers,
  campMemberData,
  totalSubscriptions,
  paidSubscriptions,
  pendingPayments,
  paymentPercentage,
  totalRevenue,
  pendingRevenue,
  paymentMethods,
  subscriptionsByGroup,
  workYear,
}: KampTabsProps) {
  return (
    <Tabs aria-label="Kamp information tabs" className="w-full">
      <Tab
        key="overview"
        title={
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Overzicht
          </div>
        }
      >
        <div className="space-y-8">
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

          {/* Kamp Information and Payment Methods */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Kamp Information */}
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
        </div>
      </Tab>

      <Tab
        key="medical"
        title={
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Medische informatie
          </div>
        }
      >
        <GroupMedicalInfo members={campMembers} />
      </Tab>

      <Tab
        key="members"
        title={
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Ledenlijst
          </div>
        }
      >
        <MembersTable members={campMemberData} hideGroupColumn={false} />
      </Tab>
    </Tabs>
  );
}
