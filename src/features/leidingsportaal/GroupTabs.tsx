"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Users,
  Calendar,
  UserCheck,
  Heart,
  Activity,
  Shield,
  Baby,
  Clock,
  ShieldCheck,
  FileText,
  UserPlus,
  GraduationCap,
  Target,
  Users2,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Tent,
  BookOpen,
} from "lucide-react";
import MembersTable from "~/features/leidingsportaal/members-table";
import GroupMedicalInfo from "~/features/leidingsportaal/GroupMedicalInfo";
import MedicalPrintView from "~/features/leidingsportaal/MedicalPrintView";
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

interface GroupTabsProps {
  group: {
    id: number;
    name: string;
    color: string | null;
    description: string | null;
    minimumAgeInDays: number;
    maximumAgeInDays: number | null;
    gender: string | null;
  };
  workYearMembers: MemberWithMedical[];
  campMembers: MemberWithMedical[];
  workYearMemberData: MemberTableData[];
  campMemberData: MemberTableData[];
  workYearStats: {
    totalMembers: number;
    boysCount: number;
    girlsCount: number;
    otherGenderCount: number;
    campSubscriptions: number;
    campPaymentReceived: number;
    campPaymentPending: number;
    averageAge: number;
  };
  campStats: {
    totalMembers: number;
    boysCount: number;
    girlsCount: number;
    otherGenderCount: number;
    campSubscriptions: number;
    campPaymentReceived: number;
    campPaymentPending: number;
    averageAge: number;
  };
  minAge: number;
  displayMaxAge: number | null;
  genderText: string | null;
}

export default function GroupTabs({
  group,
  workYearMembers,
  campMembers,
  workYearMemberData,
  campMemberData,
  workYearStats,
  campStats,
  minAge,
  displayMaxAge,
  genderText,
}: GroupTabsProps) {
  return (
    <Tabs
      aria-label="Group information tabs"
      className="w-full"
      defaultSelectedKey="camp"
    >
      <Tab
        key="camp"
        title={
          <div className="flex items-center gap-2">
            <Tent className="h-4 w-4" />
            Kamp
          </div>
        }
      >
        <div className="space-y-8">
          {/* Camp Statistics Overview */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: group.color
                        ? `${group.color}20`
                        : "#3b82f620",
                    }}
                  >
                    <Tent
                      className="h-8 w-8"
                      style={{ color: group.color ?? "#3b82f6" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kamp deelnemers</p>
                    <p className="text-2xl font-bold">
                      {campStats.totalMembers}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gemiddelde leeftijd</p>
                    <p className="text-2xl font-bold">
                      {campStats.averageAge} jaar
                    </p>
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
                    <p className="text-2xl font-bold">
                      {campStats.campPaymentReceived}
                    </p>
                    <p className="text-xs text-gray-500">
                      {campStats.campSubscriptions > 0
                        ? Math.round(
                            (campStats.campPaymentReceived /
                              campStats.campSubscriptions) *
                              100,
                          )
                        : 0}
                      % van inschrijvingen
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
                    <p className="text-2xl font-bold">
                      {campStats.campPaymentPending}
                    </p>
                    <p className="text-xs text-gray-500">
                      {campStats.campSubscriptions > 0
                        ? Math.round(
                            (campStats.campPaymentPending /
                              campStats.campSubscriptions) *
                              100,
                          )
                        : 0}
                      % van inschrijvingen
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Camp Group Information */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <FileText className="h-5 w-5" />
                  Kamp groep informatie
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <Target className="h-5 w-5 text-blue-600" />
                      Doelgroep
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Leeftijdsbereik:</strong> {minAge} -{" "}
                        {displayMaxAge ?? "∞"} jaar
                      </p>
                      <p>
                        <strong>Gemiddelde leeftijd:</strong>{" "}
                        {campStats.averageAge} jaar
                      </p>
                      {genderText && (
                        <p>
                          <strong>Geslacht:</strong> {genderText}
                        </p>
                      )}
                    </div>
                  </div>

                  {group.description && (
                    <>
                      <Divider />
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                          <FileText className="h-5 w-5 text-purple-600" />
                          Beschrijving
                        </h3>
                        <p className="text-sm text-gray-700">
                          {group.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Users2 className="h-5 w-5" />
                  Kamp ledendemografie
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <UserPlus className="h-5 w-5 text-blue-600" />
                      Geslachtverdeling
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Jongens:</span>
                        <Badge color="primary" variant="flat">
                          {campStats.boysCount}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Meisjes:</span>
                        <Badge color="secondary" variant="flat">
                          {campStats.girlsCount}
                        </Badge>
                      </div>
                      {campStats.otherGenderCount > 0 && (
                        <div className="flex items-center justify-between">
                          <span>Anders:</span>
                          <Badge color="default" variant="flat">
                            {campStats.otherGenderCount}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                      Kamp groepsgrootte
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Kamp deelnemers:</span>
                        <Badge
                          color={
                            campStats.totalMembers > 0 ? "success" : "default"
                          }
                          variant="flat"
                        >
                          {campStats.totalMembers} leden
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Van totaal groep:</span>
                        <span className="text-sm text-gray-600">
                          {workYearStats.totalMembers > 0
                            ? Math.round(
                                (campStats.totalMembers /
                                  workYearStats.totalMembers) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Tab>

      <Tab
        key="camp-medical"
        title={
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Kamp medisch
          </div>
        }
      >
        <GroupMedicalInfo members={campMembers} />
      </Tab>

      <Tab
        key="camp-members"
        title={
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Kamp ledenlijst
          </div>
        }
      >
        <MembersTable members={campMemberData} hideGroupColumn={true} />
      </Tab>

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
          {/* Work Year Statistics Overview */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: group.color
                        ? `${group.color}20`
                        : "#3b82f620",
                    }}
                  >
                    <Users
                      className="h-8 w-8"
                      style={{ color: group.color ?? "#3b82f6" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Totaal leden</p>
                    <p className="text-2xl font-bold">
                      {workYearStats.totalMembers}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gemiddelde leeftijd</p>
                    <p className="text-2xl font-bold">
                      {workYearStats.averageAge} jaar
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Leeftijdsbereik</p>
                    <p className="text-2xl font-bold">
                      {minAge}-{displayMaxAge ?? "∞"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <Tent className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kampinschrijvingen</p>
                    <p className="text-2xl font-bold">
                      {workYearStats.campSubscriptions}
                    </p>
                    <p className="text-xs text-gray-500">
                      {workYearStats.campPaymentReceived} betaald,{" "}
                      {workYearStats.campPaymentPending} openstaand
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Group Information */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <FileText className="h-5 w-5" />
                  Groep informatie
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <Target className="h-5 w-5 text-blue-600" />
                      Doelgroep
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Leeftijdsbereik:</strong> {minAge} -{" "}
                        {displayMaxAge ?? "∞"} jaar
                      </p>
                      <p>
                        <strong>Gemiddelde leeftijd:</strong>{" "}
                        {workYearStats.averageAge} jaar
                      </p>
                      {genderText && (
                        <p>
                          <strong>Geslacht:</strong> {genderText}
                        </p>
                      )}
                    </div>
                  </div>

                  {group.description && (
                    <>
                      <Divider />
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                          <FileText className="h-5 w-5 text-purple-600" />
                          Beschrijving
                        </h3>
                        <p className="text-sm text-gray-700">
                          {group.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Users2 className="h-5 w-5" />
                  Ledendemografie
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <UserPlus className="h-5 w-5 text-blue-600" />
                      Geslachtverdeling
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Jongens:</span>
                        <Badge color="primary" variant="flat">
                          {workYearStats.boysCount}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Meisjes:</span>
                        <Badge color="secondary" variant="flat">
                          {workYearStats.girlsCount}
                        </Badge>
                      </div>
                      {workYearStats.otherGenderCount > 0 && (
                        <div className="flex items-center justify-between">
                          <span>Anders:</span>
                          <Badge color="default" variant="flat">
                            {workYearStats.otherGenderCount}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                      Groepsgrootte
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Huidige grootte:</span>
                        <Badge
                          color={
                            workYearStats.totalMembers > 0
                              ? "success"
                              : "default"
                          }
                          variant="flat"
                        >
                          {workYearStats.totalMembers} leden
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Capaciteit:</span>
                        <span className="text-sm text-gray-600">Onbeperkt</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
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
        <GroupMedicalInfo members={workYearMembers} />
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
        <MembersTable members={workYearMemberData} hideGroupColumn={true} />
      </Tab>
    </Tabs>
  );
}
