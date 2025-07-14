"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
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
  FileText,
} from "lucide-react";
import MembersTable from "./members-table";
import GroupMedicalInfo from "./GroupMedicalInfo";
import MedicalPrintView from "./MedicalPrintView";
import type { Member } from "~/server/db/schema";

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
    group: {
      id: number;
      name: string;
      color: string | null;
      description: string | null;
      minimumAgeInDays: number;
      maximumAgeInDays: number | null;
      gender: string | null;
    } | null;
    campSubscription: boolean;
    campPaymentReceived: boolean;
    campPaymentMethod?: string | null;
    campPaymentDate?: Date | null;
    paymentReceived: boolean;
    paymentMethod?: string | null;
    paymentDate?: Date | null;
  };
}

// Import the MemberTableData type from members-table
type MemberTableData = Member & {
  name: string;
  group: import("~/server/db/schema").Group | null;
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

interface ChiroOverviewTabsProps {
  members: MemberWithMedical[];
  memberTabularData: MemberTableData[];
  totalMembers: number;
  boysCount: number;
  girlsCount: number;
  otherGenderCount: number;
  campSubscriptions: number;
  campPaymentReceived: number;
  campPaymentPending: number;
  paymentReceived: number;
  paymentPending: number;
  averageAge: number;
  medicalConditions?: {
    allergies: number;
    criticalConditions: number;
    medication: number;
    noMedicationPermission: number;
    notVaccinated: number;
    cannotSwim: number;
    cannotSports: number;
  } | null;
  sortedGroups: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  workYearName: string;
}

export default function ChiroOverviewTabs({
  members,
  memberTabularData,
  totalMembers,
  boysCount,
  girlsCount,
  otherGenderCount,
  campSubscriptions,
  campPaymentReceived,
  campPaymentPending,
  paymentReceived,
  paymentPending,
  averageAge,
  medicalConditions,
  sortedGroups,
  workYearName,
}: ChiroOverviewTabsProps) {
  return (
    <Tabs aria-label="Chiro overview tabs" className="w-full">
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
          {/* Gender Distribution */}
          <Card>
            <CardHeader className="px-6 py-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <UserPlus className="h-5 w-5" />
                Geslachtverdeling
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Jongens</span>
                  </div>
                  <Badge color="primary" variant="flat">
                    {boysCount}
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-pink-100 p-2">
                      <Users className="h-5 w-5 text-pink-600" />
                    </div>
                    <span className="font-medium">Meisjes</span>
                  </div>
                  <Badge color="secondary" variant="flat">
                    {girlsCount}
                  </Badge>
                </div>
                {otherGenderCount > 0 && (
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <span className="font-medium">Anders</span>
                    </div>
                    <Badge color="default" variant="flat">
                      {otherGenderCount}
                    </Badge>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Group Distribution */}
          <Card>
            <CardHeader className="px-6 py-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <GraduationCap className="h-5 w-5" />
                Verdeling per groep
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedGroups.map((group) => (
                  <div
                    key={group.name}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-lg p-2"
                        style={{
                          backgroundColor: `${group.color}20`,
                        }}
                      >
                        <Users
                          className="h-5 w-5"
                          style={{ color: group.color }}
                        />
                      </div>
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <Badge
                      color="primary"
                      variant="flat"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.count}
                    </Badge>
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
        <GroupMedicalInfo members={members} />
      </Tab>

      <Tab
        key="print"
        title={
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Medisch print
          </div>
        }
      >
        <MedicalPrintView
          members={members}
          title="Medische informatie - Alle leden"
        />
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
        <MembersTable members={memberTabularData} />
      </Tab>
    </Tabs>
  );
}
