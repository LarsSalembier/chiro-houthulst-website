import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Badge } from "@heroui/badge";
import {
  Heart,
  AlertTriangle,
  AlertCircle,
  Shield,
  Activity,
  ShieldCheck,
  Baby,
  Clock,
  UserCheck,
  CheckCircle,
  Phone,
  User,
  Stethoscope,
  Pill,
  Droplets,
  Zap,
  Eye,
  Brain,
  ActivitySquare,
  Waves,
  Bed,
  Info,
} from "lucide-react";
import TableLink from "~/components/ui/table-link";

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
    campSubscription?: boolean;
    campPaymentReceived?: boolean;
    campPaymentMethod?: string | null;
    campPaymentDate?: Date | null;
    paymentReceived?: boolean;
    paymentMethod?: string | null;
    paymentDate?: Date | null;
    group?: unknown;
  };
}

interface GroupMedicalInfoProps {
  members: MemberWithMedical[];
}

// Helper function to render member info with consistent styling
const renderMemberInfo = (
  member: MemberWithMedical,
  severity: "critical" | "high" | "medium" | "low" = "medium",
  additionalInfo?: string,
) => {
  const severityStyles = {
    critical: "border-red-300 bg-red-50 text-red-800",
    high: "border-orange-300 bg-orange-50 text-orange-800",
    medium: "border-yellow-300 bg-yellow-50 text-yellow-800",
    low: "border-blue-300 bg-blue-50 text-blue-800",
  };

  const doctorName =
    member.medicalInformation?.doctorFirstName &&
    member.medicalInformation?.doctorLastName
      ? `Dr. ${member.medicalInformation.doctorFirstName} ${member.medicalInformation.doctorLastName}`
      : "Geen huisarts opgegeven";

  const doctorPhone =
    member.medicalInformation?.doctorPhoneNumber ?? "Geen telefoon";

  return (
    <div
      key={member.id}
      className={`mb-2 rounded-lg border p-3 ${severityStyles[severity]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <TableLink href={`/leidingsportaal/leden/${member.id}`}>
            {member.firstName} {member.lastName}
          </TableLink>
          {additionalInfo && (
            <p className="mt-1 text-sm opacity-80">{additionalInfo}</p>
          )}
        </div>
        <div className="ml-2 flex flex-col items-end gap-1 text-xs">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span>Ouders: {member.parents[0]?.phoneNumber ?? "N/A"}</span>
          </div>
          {member.emergencyContact && (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Nood: {member.emergencyContact.phoneNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Stethoscope className="h-3 w-3" />
            <span>Huisarts: {doctorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span>Tel: {doctorPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to render section with consistent styling
const renderSection = (
  title: string,
  icon: React.ReactNode,
  children: React.ReactNode,
  color: "red" | "orange" | "yellow" | "blue" | "green" = "blue",
) => {
  const colorStyles = {
    red: "text-red-600 border-red-200",
    orange: "text-orange-600 border-orange-200",
    yellow: "text-yellow-600 border-yellow-200",
    blue: "text-blue-600 border-blue-200",
    green: "text-green-600 border-green-200",
  };

  return (
    <div className="space-y-3">
      <h4
        className={`flex items-center gap-2 font-medium ${colorStyles[color]}`}
      >
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
};

const GroupMedicalInfo: React.FC<GroupMedicalInfoProps> = ({ members }) => {
  // Filter members with medical information
  const membersWithMedical = members.filter((m) => m.medicalInformation);

  // Allergies (highest priority)
  const allergies = {
    foodAllergies: membersWithMedical.filter(
      (m) => m.medicalInformation?.foodAllergies,
    ),
    substanceAllergies: membersWithMedical.filter(
      (m) => m.medicalInformation?.substanceAllergies,
    ),
    medicationAllergies: membersWithMedical.filter(
      (m) => m.medicalInformation?.medicationAllergies,
    ),
    hayFever: membersWithMedical.filter((m) => m.medicalInformation?.hayFever),
  };

  // Medical conditions
  const medicalConditions = {
    epilepsy: membersWithMedical.filter((m) => m.medicalInformation?.epilepsy),
    heartCondition: membersWithMedical.filter(
      (m) => m.medicalInformation?.heartCondition,
    ),
    diabetes: membersWithMedical.filter((m) => m.medicalInformation?.diabetes),
    asthma: membersWithMedical.filter((m) => m.medicalInformation?.asthma),
    skinCondition: membersWithMedical.filter(
      (m) => m.medicalInformation?.skinCondition,
    ),
    rheumatism: membersWithMedical.filter(
      (m) => m.medicalInformation?.rheumatism,
    ),
    sleepwalking: membersWithMedical.filter(
      (m) => m.medicalInformation?.sleepwalking,
    ),
    bedwetting: membersWithMedical.filter(
      (m) => m.medicalInformation?.bedwetting,
    ),
    getsTiredQuickly: membersWithMedical.filter(
      (m) => m.medicalInformation?.getsTiredQuickly,
    ),
  };

  // Medication and permissions
  const medicationAndPermissions = {
    medication: membersWithMedical.filter(
      (m) => m.medicalInformation?.medication,
    ),
    noMedicationPermission: membersWithMedical.filter(
      (m) => !m.medicalInformation?.permissionMedication,
    ),
    notVaccinated: membersWithMedical.filter(
      (m) => !m.medicalInformation?.tetanusVaccination,
    ),
  };

  // Physical limitations
  const physicalLimitations = {
    cannotSwim: membersWithMedical.filter(
      (m) => !m.medicalInformation?.canSwim,
    ),
    cannotSports: membersWithMedical.filter(
      (m) => !m.medicalInformation?.canParticipateSports,
    ),
    noPhotoPermission: members.filter((m) => !m.gdprPermissionToPublishPhotos),
  };

  // Other information
  const otherInfo = {
    otherConditions: membersWithMedical.filter(
      (m) => m.medicalInformation?.otherMedicalConditions,
    ),
    otherRemarks: membersWithMedical.filter(
      (m) => m.medicalInformation?.otherRemarks,
    ),
  };

  const hasAllergies = Object.values(allergies).some((arr) => arr.length > 0);
  const hasMedicalConditions = Object.values(medicalConditions).some(
    (arr) => arr.length > 0,
  );
  const hasMedicationIssues = Object.values(medicationAndPermissions).some(
    (arr) => arr.length > 0,
  );
  const hasPhysicalLimitations = Object.values(physicalLimitations).some(
    (arr) => arr.length > 0,
  );
  const hasOtherInfo = Object.values(otherInfo).some((arr) => arr.length > 0);

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <Heart className="h-6 w-6 text-red-500" />
        Medische en belangrijke informatie
      </h2>

      {/* ALLERGIES - Highest Priority */}
      {hasAllergies && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader className="border-b border-red-200 px-6 py-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Allergieën
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {allergies.foodAllergies.length > 0 &&
                renderSection(
                  "Voedselallergieën",
                  <Shield className="h-4 w-4" />,
                  <div className="space-y-2">
                    {allergies.foodAllergies.map((member) =>
                      renderMemberInfo(
                        member,
                        "critical",
                        member.medicalInformation?.foodAllergies ?? undefined,
                      ),
                    )}
                  </div>,
                  "red",
                )}

              {allergies.medicationAllergies.length > 0 &&
                renderSection(
                  "Medicatieallergieën",
                  <Pill className="h-4 w-4" />,
                  <div className="space-y-2">
                    {allergies.medicationAllergies.map((member) =>
                      renderMemberInfo(
                        member,
                        "critical",
                        member.medicalInformation?.medicationAllergies ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "red",
                )}

              {allergies.substanceAllergies.length > 0 &&
                renderSection(
                  "Stofallergieën",
                  <Shield className="h-4 w-4" />,
                  <div className="space-y-2">
                    {allergies.substanceAllergies.map((member) =>
                      renderMemberInfo(
                        member,
                        "critical",
                        member.medicalInformation?.substanceAllergies ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "red",
                )}

              {allergies.hayFever.length > 0 &&
                renderSection(
                  "Hooikoorts",
                  <Droplets className="h-4 w-4" />,
                  <div className="space-y-2">
                    {allergies.hayFever.map((member) =>
                      renderMemberInfo(
                        member,
                        "critical",
                        member.medicalInformation?.hayFeverInformation ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "red",
                )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* MEDICAL CONDITIONS */}
      {hasMedicalConditions && (
        <Card className="border-orange-300 bg-orange-50">
          <CardHeader className="border-b border-orange-200 px-6 py-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-700">
              <AlertCircle className="h-5 w-5" />
              Medische aandoeningen
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {medicalConditions.epilepsy.length > 0 &&
                renderSection(
                  "Epilepsie",
                  <Zap className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicalConditions.epilepsy.map((member) =>
                      renderMemberInfo(
                        member,
                        "high",
                        member.medicalInformation?.epilepsyInformation ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "orange",
                )}

              {medicalConditions.heartCondition.length > 0 &&
                renderSection(
                  "Hartaandoening",
                  <Heart className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicalConditions.heartCondition.map((member) =>
                      renderMemberInfo(
                        member,
                        "high",
                        member.medicalInformation?.heartConditionInformation ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "orange",
                )}

              {medicalConditions.diabetes.length > 0 &&
                renderSection(
                  "Diabetes",
                  <Droplets className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicalConditions.diabetes.map((member) =>
                      renderMemberInfo(
                        member,
                        "high",
                        member.medicalInformation?.diabetesInformation ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "orange",
                )}

              {medicalConditions.asthma.length > 0 &&
                renderSection(
                  "Astma",
                  <Activity className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicalConditions.asthma.map((member) =>
                      renderMemberInfo(
                        member,
                        "high",
                        member.medicalInformation?.asthmaInformation ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "orange",
                )}

              {medicalConditions.skinCondition.length > 0 &&
                renderSection(
                  "Huidaandoening",
                  <Eye className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicalConditions.skinCondition.map((member) =>
                      renderMemberInfo(
                        member,
                        "high",
                        member.medicalInformation?.skinConditionInformation ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "orange",
                )}

              {medicalConditions.rheumatism.length > 0 &&
                renderSection(
                  "Reuma",
                  <ActivitySquare className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicalConditions.rheumatism.map((member) =>
                      renderMemberInfo(
                        member,
                        "high",
                        member.medicalInformation?.rheumatismInformation ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "orange",
                )}

              {medicalConditions.sleepwalking.length > 0 &&
                renderSection(
                  "Slaapwandelen",
                  <Bed className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicalConditions.sleepwalking.map((member) =>
                      renderMemberInfo(
                        member,
                        "high",
                        member.medicalInformation?.sleepwalkingInformation ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "orange",
                )}

              {medicalConditions.bedwetting.length > 0 &&
                renderSection(
                  "Bedwateren",
                  <Bed className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicalConditions.bedwetting.map((member) =>
                      renderMemberInfo(
                        member,
                        "high",
                        member.medicalInformation?.bedwettingInformation ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "orange",
                )}

              {medicalConditions.getsTiredQuickly.length > 0 &&
                renderSection(
                  "Wordt snel moe",
                  <Activity className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicalConditions.getsTiredQuickly.map((member) =>
                      renderMemberInfo(member, "high"),
                    )}
                  </div>,
                  "orange",
                )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* MEDICATION AND PERMISSIONS */}
      {hasMedicationIssues && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader className="border-b border-yellow-200 px-6 py-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-700">
              <Pill className="h-5 w-5" />
              Medicatie en toestemmingen
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {medicationAndPermissions.medication.length > 0 &&
                renderSection(
                  "Regelmatige medicatie",
                  <Pill className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicationAndPermissions.medication.map((member) =>
                      renderMemberInfo(
                        member,
                        "medium",
                        member.medicalInformation?.medication ?? undefined,
                      ),
                    )}
                  </div>,
                  "yellow",
                )}

              {medicationAndPermissions.noMedicationPermission.length > 0 &&
                renderSection(
                  "Geen toestemming medicatie",
                  <AlertCircle className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicationAndPermissions.noMedicationPermission.map(
                      (member) => renderMemberInfo(member, "medium"),
                    )}
                  </div>,
                  "yellow",
                )}

              {medicationAndPermissions.notVaccinated.length > 0 &&
                renderSection(
                  "Niet gevaccineerd tegen tetanus",
                  <Baby className="h-4 w-4" />,
                  <div className="space-y-2">
                    {medicationAndPermissions.notVaccinated.map((member) =>
                      renderMemberInfo(member, "medium"),
                    )}
                  </div>,
                  "yellow",
                )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* PHYSICAL LIMITATIONS */}
      {hasPhysicalLimitations && (
        <Card className="border-blue-300 bg-blue-50">
          <CardHeader className="border-b border-blue-200 px-6 py-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700">
              <Activity className="h-5 w-5" />
              Fysieke beperkingen
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {physicalLimitations.cannotSwim.length > 0 &&
                renderSection(
                  "Kan niet zwemmen",
                  <Waves className="h-4 w-4" />,
                  <div className="space-y-2">
                    {physicalLimitations.cannotSwim.map((member) =>
                      renderMemberInfo(member, "low"),
                    )}
                  </div>,
                  "blue",
                )}

              {physicalLimitations.cannotSports.length > 0 &&
                renderSection(
                  "Kan niet sporten",
                  <Activity className="h-4 w-4" />,
                  <div className="space-y-2">
                    {physicalLimitations.cannotSports.map((member) =>
                      renderMemberInfo(member, "low"),
                    )}
                  </div>,
                  "blue",
                )}

              {physicalLimitations.noPhotoPermission.length > 0 &&
                renderSection(
                  "Geen toestemming voor foto's",
                  <UserCheck className="h-4 w-4" />,
                  <div className="space-y-2">
                    {physicalLimitations.noPhotoPermission.map((member) =>
                      renderMemberInfo(member, "low"),
                    )}
                  </div>,
                  "blue",
                )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* OTHER INFORMATION */}
      {hasOtherInfo && (
        <Card className="border-gray-300 bg-gray-50">
          <CardHeader className="border-b border-gray-200 px-6 py-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <Info className="h-5 w-5" />
              Overige informatie
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {otherInfo.otherConditions.length > 0 &&
                renderSection(
                  "Andere medische aandoeningen",
                  <Brain className="h-4 w-4" />,
                  <div className="space-y-2">
                    {otherInfo.otherConditions.map((member) =>
                      renderMemberInfo(
                        member,
                        "low",
                        member.medicalInformation?.otherMedicalConditions ??
                          undefined,
                      ),
                    )}
                  </div>,
                  "green",
                )}

              {otherInfo.otherRemarks.length > 0 &&
                renderSection(
                  "Andere opmerkingen",
                  <Info className="h-4 w-4" />,
                  <div className="space-y-2">
                    {otherInfo.otherRemarks.map((member) =>
                      renderMemberInfo(
                        member,
                        "low",
                        member.medicalInformation?.otherRemarks ?? undefined,
                      ),
                    )}
                  </div>,
                  "green",
                )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default GroupMedicalInfo;
