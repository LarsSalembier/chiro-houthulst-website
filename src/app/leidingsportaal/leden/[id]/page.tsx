"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import {
  AlertTriangle,
  Waves,
  Heart,
  Pill,
  Droplets,
  Zap,
  Activity,
  Bed,
  Brain,
  Bone,
  Moon,
  Shield,
  Check,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Stethoscope,
  Syringe,
  AlertCircle,
  Thermometer,
  Eye,
  BrainCircuit,
  HeartHandshake,
  Baby,
  Clock,
  Dumbbell,
  ShieldCheck,
  FileText,
  Trash2,
} from "lucide-react";
import BlogTextNoAnimation from "~/components/ui/blog-text-no-animation";
import SignInAsLeiding from "../../sign-in-as-leiding";
import { getFullMemberDetails, removeMember } from "./actions";
import {
  type Member,
  type Group,
  type WorkYear,
  type PaymentMethod,
} from "~/server/db/schema";
import BreadcrumbsWrapper from "~/components/ui/breadcrumbs-wrapper";
import { CampSubscription } from "./components/camp-subscription";
import { formatDateLocale } from "~/lib/date-utils";

interface MemberWithDetails extends Member {
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
    relationship: string;
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
  yearlyMemberships: Array<{
    workYear: WorkYear;
    group: Group;
    campSubscription: boolean;
    campPaymentReceived: boolean;
    campPaymentMethod?: PaymentMethod | null;
    campPaymentDate?: Date | null;
  }>;
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = parseInt(params.id as string, 10);
  const [member, setMember] = useState<MemberWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const breadcrumbItems = [
    { href: "/leidingsportaal", label: "Leidingsportaal" },
    { href: "/leidingsportaal/leden", label: "Leden" },
    { label: member?.firstName + " " + member?.lastName },
  ];

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);
        const memberData = await getFullMemberDetails(memberId);
        if (memberData) {
          setMember(memberData as MemberWithDetails);
        } else {
          setError("Lid niet gevonden");
        }
      } catch (err) {
        setError("Er is een fout opgetreden bij het laden van de lidgegevens.");
        console.error("Error loading member:", err);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      void loadMember();
    }
  }, [memberId]);

  const handleDeleteClick = () => {
    onOpen();
  };

  const handleConfirmDelete = async () => {
    if (!member) return;
    
    setIsDeleting(true);
    try {
      await removeMember(member.id);
      onClose();
      // Redirect to members list
      router.push("/leidingsportaal/leden");
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Er is een fout opgetreden bij het verwijderen van het lid.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error ?? "Lid niet gevonden"}</p>
          <Button color="primary" onPress={() => window.history.back()}>
            Terug
          </Button>
        </div>
      </div>
    );
  }

  const medicalInfo = member.medicalInformation;
  const hasImportantMedicalInfo =
    medicalInfo &&
    ((!medicalInfo.canSwim ||
      medicalInfo.getsTiredQuickly ||
      !medicalInfo.canParticipateSports ||
      !medicalInfo.permissionMedication ||
      medicalInfo.asthma ||
      medicalInfo.epilepsy ||
      medicalInfo.heartCondition ||
      medicalInfo.diabetes ||
      medicalInfo.foodAllergies) ??
      (false || medicalInfo.substanceAllergies) ??
      (false || medicalInfo.medicationAllergies) ??
      (false || medicalInfo.medication) ??
      (false || medicalInfo.otherMedicalConditions) ??
      false);

  // Check if there are any medical conditions to show
  const hasMedicalConditions =
    medicalInfo &&
    (medicalInfo.asthma ||
      medicalInfo.epilepsy ||
      medicalInfo.heartCondition ||
      medicalInfo.diabetes ||
      medicalInfo.hayFever ||
      medicalInfo.skinCondition ||
      medicalInfo.rheumatism ||
      medicalInfo.sleepwalking ||
      medicalInfo.bedwetting);

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "M":
        return "Jongen";
      case "F":
        return "Meisje";
      case "X":
        return "Anders";
      default:
        return gender;
    }
  };

  const getRelationshipLabel = (relationship: string) => {
    switch (relationship) {
      case "FATHER":
        return "Vader";
      case "MOTHER":
        return "Moeder";
      case "PLUSFATHER":
        return "Plusvader";
      case "PLUSMOTHER":
        return "Plusmoeder";
      case "GUARDIAN":
        return "Voogd";
      default:
        return relationship;
    }
  };

  return (
    <>
      <SignedIn>
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Breadcrumbs */}
          <div className="pt-8">
            <BreadcrumbsWrapper items={breadcrumbItems} />
          </div>

          {/* Header Section with Edit and Delete Buttons */}
          <BlogTextNoAnimation>
            <div className="flex items-start justify-between">
              <div>
                <h1>
                  {member.firstName} {member.lastName}
                </h1>
                <p className="text-gray-600">
                  Lid sinds{" "}
                  {member.yearlyMemberships[0]
                    ? formatDateLocale(
                        member.yearlyMemberships[0].workYear.startDate,
                      )
                    : ""}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  color="primary"
                  size="lg"
                  onPress={() =>
                    (window.location.href = `/leidingsportaal/leden/${memberId}/bewerken`)
                  }
                  className="px-8"
                >
                  Bewerken
                </Button>
                <Button
                  color="danger"
                  size="lg"
                  variant="flat"
                  onPress={handleDeleteClick}
                  className="px-8"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Verwijderen
                </Button>
              </div>
            </div>
          </BlogTextNoAnimation>

          {/* Delete Confirmation Modal */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalHeader className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Lid verwijderen
              </ModalHeader>
              <ModalBody>
                <p>
                  Weet je zeker dat je <strong>{member?.firstName} {member?.lastName}</strong> wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Dit zal ook alle gerelateerde gegevens verwijderen:
                </p>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                  <li>Ouders (alleen als ze geen andere kinderen hebben)</li>
                  <li>Medische informatie</li>
                  <li>Noodcontact</li>
                  <li>Lidmaatschappen</li>
                  <li>Evenement inschrijvingen</li>
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Annuleren
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                >
                  Verwijderen
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Important Medical Information Alert */}
          {hasImportantMedicalInfo && (
            <Card className="border-2 border-warning-200 bg-warning-50">
              <CardHeader className="pb-4">
                <h2 className="flex items-center gap-3 text-xl font-semibold text-warning-800">
                  <AlertTriangle className="h-6 w-6 text-warning-600" />
                  Belangrijke medische informatie
                </h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {!medicalInfo.canSwim && (
                    <div className="flex items-start gap-3">
                      <Waves className="mt-0.5 h-5 w-5 text-blue-600" />
                      <div>
                        <Badge
                          color="warning"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Kan niet zwemmen
                        </Badge>
                        <p className="text-sm text-warning-700">
                          Let op bij activiteiten in of rond water
                        </p>
                      </div>
                    </div>
                  )}
                  {medicalInfo.getsTiredQuickly && (
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 text-orange-600" />
                      <div>
                        <Badge
                          color="warning"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Snel moe
                        </Badge>
                        <p className="text-sm text-warning-700">
                          Plan rustpauzes in tijdens activiteiten
                        </p>
                      </div>
                    </div>
                  )}
                  {!medicalInfo.canParticipateSports && (
                    <div className="flex items-start gap-3">
                      <Dumbbell className="mt-0.5 h-5 w-5 text-purple-600" />
                      <div>
                        <Badge
                          color="warning"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Kan niet sporten
                        </Badge>
                        <p className="text-sm text-warning-700">
                          Aangepaste activiteiten nodig
                        </p>
                      </div>
                    </div>
                  )}
                  {!medicalInfo.permissionMedication && (
                    <div className="flex items-start gap-3">
                      <Pill className="mt-0.5 h-5 w-5 text-red-600" />
                      <div>
                        <Badge
                          color="danger"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Geen toestemming medicatie
                        </Badge>
                        <p className="text-sm text-danger-700">
                          Geen medicatie toedienen zonder ouders
                        </p>
                      </div>
                    </div>
                  )}
                  {medicalInfo.asthma && (
                    <div className="flex items-start gap-3">
                      <Activity className="mt-0.5 h-5 w-5 text-cyan-600" />
                      <div>
                        <Badge
                          color="warning"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Astma
                        </Badge>
                        {medicalInfo.asthmaInformation && (
                          <p className="text-sm text-warning-700">
                            {medicalInfo.asthmaInformation}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {medicalInfo.epilepsy && (
                    <div className="flex items-start gap-3">
                      <Zap className="mt-0.5 h-5 w-5 text-yellow-600" />
                      <div>
                        <Badge
                          color="danger"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Epilepsie
                        </Badge>
                        {medicalInfo.epilepsyInformation && (
                          <p className="text-sm text-danger-700">
                            {medicalInfo.epilepsyInformation}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {medicalInfo.heartCondition && (
                    <div className="flex items-start gap-3">
                      <Heart className="mt-0.5 h-5 w-5 text-pink-600" />
                      <div>
                        <Badge
                          color="danger"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Hartafwijking
                        </Badge>
                        {medicalInfo.heartConditionInformation && (
                          <p className="text-sm text-danger-700">
                            {medicalInfo.heartConditionInformation}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {medicalInfo.diabetes && (
                    <div className="flex items-start gap-3">
                      <Droplets className="mt-0.5 h-5 w-5 text-indigo-600" />
                      <div>
                        <Badge
                          color="warning"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Diabetes
                        </Badge>
                        {medicalInfo.diabetesInformation && (
                          <p className="text-sm text-warning-700">
                            {medicalInfo.diabetesInformation}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {medicalInfo.foodAllergies && (
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                      <div>
                        <Badge
                          color="danger"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Voedselallergieën
                        </Badge>
                        <p className="text-sm text-danger-700">
                          {medicalInfo.foodAllergies}
                        </p>
                      </div>
                    </div>
                  )}
                  {medicalInfo.substanceAllergies && (
                    <div className="flex items-start gap-3">
                      <Thermometer className="mt-0.5 h-5 w-5 text-orange-600" />
                      <div>
                        <Badge
                          color="warning"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Stofallergieën
                        </Badge>
                        <p className="text-sm text-warning-700">
                          {medicalInfo.substanceAllergies}
                        </p>
                      </div>
                    </div>
                  )}
                  {medicalInfo.medicationAllergies && (
                    <div className="flex items-start gap-3">
                      <Pill className="mt-0.5 h-5 w-5 text-red-600" />
                      <div>
                        <Badge
                          color="danger"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Medicijnallergieën
                        </Badge>
                        <p className="text-sm text-danger-700">
                          {medicalInfo.medicationAllergies}
                        </p>
                      </div>
                    </div>
                  )}
                  {medicalInfo.medication && (
                    <div className="flex items-start gap-3">
                      <Pill className="mt-0.5 h-5 w-5 text-purple-600" />
                      <div>
                        <Badge
                          color="warning"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Gebruikt medicatie
                        </Badge>
                        <p className="text-sm text-warning-700">
                          {medicalInfo.medication}
                        </p>
                      </div>
                    </div>
                  )}
                  {medicalInfo.otherMedicalConditions && (
                    <div className="flex items-start gap-3">
                      <Stethoscope className="mt-0.5 h-5 w-5 text-teal-600" />
                      <div>
                        <Badge
                          color="warning"
                          variant="flat"
                          className="mb-1 text-sm"
                        >
                          Andere aandoeningen
                        </Badge>
                        <p className="text-sm text-warning-700">
                          {medicalInfo.otherMedicalConditions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Basic Information - Full Width */}
          <Card>
            <CardHeader className="px-6 py-3">
              <h2 className="text-xl font-semibold">Basisgegevens</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                    <User className="h-5 w-5 text-blue-600" />
                    Persoonlijke informatie
                  </h3>
                  <div className="space-y-3">
                    <p>
                      <strong>Naam:</strong> {member.firstName}{" "}
                      {member.lastName}
                    </p>
                    <p>
                      <strong>Geslacht:</strong> {getGenderLabel(member.gender)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <strong>Geboortedatum:</strong>{" "}
                      {formatDateLocale(member.dateOfBirth)}
                    </p>
                    <p>
                      <strong>Leeftijd:</strong>{" "}
                      {Math.floor(
                        (Date.now() - member.dateOfBirth.getTime()) /
                          (1000 * 60 * 60 * 24 * 365.25),
                      )}{" "}
                      jaar
                    </p>
                    {member.emailAddress && (
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <strong>E-mail:</strong> {member.emailAddress}
                      </p>
                    )}
                    {member.phoneNumber && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <strong>Telefoon:</strong> {member.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                    <Users className="h-5 w-5 text-purple-600" />
                    Huidige groep
                  </h3>
                  <div className="space-y-3">
                    {member.yearlyMemberships[0] && (
                      <>
                        <div
                          className="inline-block rounded-lg px-3 py-1 font-medium text-white"
                          style={{
                            backgroundColor:
                              member.yearlyMemberships[0].group.color ??
                              "#3b82f6",
                          }}
                        >
                          {member.yearlyMemberships[0].group.name}
                        </div>
                        <p>
                          <strong>Werkjaar:</strong>{" "}
                          {formatDateLocale(
                            member.yearlyMemberships[0].workYear.startDate,
                          )}{" "}
                          -{" "}
                          {formatDateLocale(
                            member.yearlyMemberships[0].workYear.endDate,
                          )}
                        </p>
                      </>
                    )}
                    <p>
                      <strong>Foto&apos;s publiceren:</strong>{" "}
                      {member.gdprPermissionToPublishPhotos ? (
                        <span className="flex items-center gap-2 text-green-600">
                          <Check className="h-4 w-4 text-green-600" />
                          Toegestaan
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-600">
                          <X className="h-4 w-4 text-red-600" />
                          Niet toegestaan
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Membership and Camp Subscription - Side by Side */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Membership Information */}
            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="text-xl font-semibold">Lidmaatschap</h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="flex flex-row items-start gap-8 space-y-4">
                  <div className="flex-1">
                    {member.yearlyMemberships[0] && (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className="inline-block rounded-lg px-3 py-1 font-medium text-white"
                            style={{
                              backgroundColor:
                                member.yearlyMemberships[0].group.color ??
                                "#3b82f6",
                            }}
                          >
                            {member.yearlyMemberships[0].group.name}
                          </div>
                          <Badge color="success" variant="flat">
                            Actief lid
                          </Badge>
                        </div>
                        <p>
                          <strong>Werkjaar:</strong>{" "}
                          {formatDateLocale(
                            member.yearlyMemberships[0].workYear.startDate,
                          )}{" "}
                          -{" "}
                          {formatDateLocale(
                            member.yearlyMemberships[0].workYear.endDate,
                          )}
                        </p>
                        <p>
                          <strong>Lid sinds:</strong>{" "}
                          {formatDateLocale(
                            member.yearlyMemberships[0].workYear.startDate,
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Camp Subscription */}
            {member.yearlyMemberships[0] && (
              <CampSubscription
                memberId={memberId}
                workYearId={member.yearlyMemberships[0].workYear.id}
                campPrice={175}
                isSubscribed={member.yearlyMemberships[0].campSubscription}
                paymentReceived={
                  member.yearlyMemberships[0].campPaymentReceived
                }
                paymentMethod={member.yearlyMemberships[0].campPaymentMethod}
                paymentDate={member.yearlyMemberships[0].campPaymentDate}
              />
            )}
          </div>

          {/* Parents Information - Full Width */}
          <Card>
            <CardHeader className="px-6 py-3">
              <h2 className="text-xl font-semibold">Ouders/Verzorgers</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-6">
                {member.parents.map((parent, index) => (
                  <div key={index} className="rounded-lg border p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        {parent.firstName} {parent.lastName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Chip color="default" variant="flat">
                          {getRelationshipLabel(parent.relationship)}
                        </Chip>
                        {parent.isPrimary && (
                          <Badge color="primary" variant="flat">
                            Primaire ouder
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <strong>E-mail:</strong> {parent.emailAddress}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          <strong>Telefoon:</strong> {parent.phoneNumber}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-600" />
                          <strong>Adres:</strong>
                        </p>
                        <p className="ml-6">
                          {parent.address.street} {parent.address.houseNumber}
                        </p>
                        <p className="ml-6">
                          {parent.address.postalCode}{" "}
                          {parent.address.municipality}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Emergency Contact and Doctor Information - Side by Side */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Emergency Contact */}
            {member.emergencyContact && (
              <Card>
                <CardHeader className="px-6 py-3">
                  <h2 className="text-xl font-semibold">Noodcontact</h2>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <strong>Naam:</strong> {member.emergencyContact.firstName}{" "}
                      {member.emergencyContact.lastName}
                    </p>
                    <p>
                      <strong>Relatie:</strong>{" "}
                      {member.emergencyContact.relationship}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <strong>Telefoon:</strong>{" "}
                      {member.emergencyContact.phoneNumber}
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Doctor Information */}
            {medicalInfo && (
              <Card>
                <CardHeader className="px-6 py-3">
                  <h2 className="text-xl font-semibold">Dokter</h2>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <p>
                      <strong>Naam:</strong> {medicalInfo.doctorFirstName}{" "}
                      {medicalInfo.doctorLastName}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <strong>Telefoon:</strong> {medicalInfo.doctorPhoneNumber}
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Medical Information - Full Width */}
          {medicalInfo && (
            <Card>
              <CardHeader className="px-6 py-3">
                <h2 className="text-xl font-semibold">Medische informatie</h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-8">
                  {/* Vaccinations */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-700">
                      <Syringe className="h-5 w-5 text-purple-600" />
                      Vaccinaties
                    </h3>
                    <div className="flex gap-2">
                      <Badge
                        color={
                          medicalInfo.tetanusVaccination ? "success" : "danger"
                        }
                        variant="flat"
                      >
                        {medicalInfo.tetanusVaccination ? (
                          <span className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            Tetanusvaccinatie
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-600" />
                            Tetanusvaccinatie
                          </span>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Medical Conditions */}
                  {hasMedicalConditions && (
                    <>
                      <Divider />
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-700">
                          <HeartHandshake className="h-5 w-5 text-pink-600" />
                          Medische aandoeningen
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {medicalInfo.asthma && (
                            <div className="rounded-lg border bg-warning-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-warning-800">
                                <Activity className="h-4 w-4 text-cyan-600" />
                                Astma
                              </p>
                              {medicalInfo.asthmaInformation && (
                                <p className="mt-2 text-sm text-warning-700">
                                  {medicalInfo.asthmaInformation}
                                </p>
                              )}
                            </div>
                          )}
                          {medicalInfo.epilepsy && (
                            <div className="rounded-lg border bg-danger-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-danger-800">
                                <Zap className="h-4 w-4 text-yellow-600" />
                                Epilepsie
                              </p>
                              {medicalInfo.epilepsyInformation && (
                                <p className="mt-2 text-sm text-danger-700">
                                  {medicalInfo.epilepsyInformation}
                                </p>
                              )}
                            </div>
                          )}
                          {medicalInfo.heartCondition && (
                            <div className="rounded-lg border bg-danger-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-danger-800">
                                <Heart className="h-4 w-4 text-pink-600" />
                                Hartafwijking
                              </p>
                              {medicalInfo.heartConditionInformation && (
                                <p className="mt-2 text-sm text-danger-700">
                                  {medicalInfo.heartConditionInformation}
                                </p>
                              )}
                            </div>
                          )}
                          {medicalInfo.diabetes && (
                            <div className="rounded-lg border bg-warning-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-warning-800">
                                <Droplets className="h-4 w-4 text-indigo-600" />
                                Diabetes
                              </p>
                              {medicalInfo.diabetesInformation && (
                                <p className="mt-2 text-sm text-warning-700">
                                  {medicalInfo.diabetesInformation}
                                </p>
                              )}
                            </div>
                          )}
                          {medicalInfo.hayFever && (
                            <div className="rounded-lg border bg-warning-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-warning-800">
                                <Thermometer className="h-4 w-4 text-orange-600" />
                                Hooikoorts
                              </p>
                              {medicalInfo.hayFeverInformation && (
                                <p className="mt-2 text-sm text-warning-700">
                                  {medicalInfo.hayFeverInformation}
                                </p>
                              )}
                            </div>
                          )}
                          {medicalInfo.skinCondition && (
                            <div className="rounded-lg border bg-warning-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-warning-800">
                                <Eye className="h-4 w-4 text-blue-600" />
                                Huidaandoening
                              </p>
                              {medicalInfo.skinConditionInformation && (
                                <p className="mt-2 text-sm text-warning-700">
                                  {medicalInfo.skinConditionInformation}
                                </p>
                              )}
                            </div>
                          )}
                          {medicalInfo.rheumatism && (
                            <div className="rounded-lg border bg-warning-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-warning-800">
                                <Bone className="h-4 w-4 text-gray-600" />
                                Reuma
                              </p>
                              {medicalInfo.rheumatismInformation && (
                                <p className="mt-2 text-sm text-warning-700">
                                  {medicalInfo.rheumatismInformation}
                                </p>
                              )}
                            </div>
                          )}
                          {medicalInfo.sleepwalking && (
                            <div className="rounded-lg border bg-warning-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-warning-800">
                                <Moon className="h-4 w-4 text-indigo-600" />
                                Slaapwandelen
                              </p>
                              {medicalInfo.sleepwalkingInformation && (
                                <p className="mt-2 text-sm text-warning-700">
                                  {medicalInfo.sleepwalkingInformation}
                                </p>
                              )}
                            </div>
                          )}
                          {medicalInfo.bedwetting && (
                            <div className="rounded-lg border bg-warning-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-warning-800">
                                <Baby className="h-4 w-4 text-pink-600" />
                                Bedplassen
                              </p>
                              {medicalInfo.bedwettingInformation && (
                                <p className="mt-2 text-sm text-warning-700">
                                  {medicalInfo.bedwettingInformation}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Allergies */}
                  {Boolean(
                    medicalInfo.foodAllergies ??
                      medicalInfo.substanceAllergies ??
                      medicalInfo.medicationAllergies,
                  ) && (
                    <>
                      <Divider />
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-700">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          Allergieën
                        </h3>
                        <div className="space-y-4">
                          {medicalInfo.foodAllergies && (
                            <div className="rounded-lg border bg-danger-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-danger-800">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                Voedselallergieën
                              </p>
                              <p className="mt-2 text-sm text-danger-700">
                                {medicalInfo.foodAllergies}
                              </p>
                            </div>
                          )}
                          {medicalInfo.substanceAllergies && (
                            <div className="rounded-lg border bg-warning-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-warning-800">
                                <Thermometer className="h-4 w-4 text-orange-600" />
                                Stofallergieën
                              </p>
                              <p className="mt-2 text-sm text-warning-700">
                                {medicalInfo.substanceAllergies}
                              </p>
                            </div>
                          )}
                          {medicalInfo.medicationAllergies && (
                            <div className="rounded-lg border bg-danger-50 p-4">
                              <p className="flex items-center gap-2 font-medium text-danger-800">
                                <Pill className="h-4 w-4 text-red-600" />
                                Medicijnallergieën
                              </p>
                              <p className="mt-2 text-sm text-danger-700">
                                {medicalInfo.medicationAllergies}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Medication */}
                  {medicalInfo.medication && (
                    <>
                      <Divider />
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-700">
                          <Pill className="h-5 w-5 text-purple-600" />
                          Medicatie
                        </h3>
                        <div className="rounded-lg border bg-warning-50 p-4">
                          <p className="flex items-center gap-2 font-medium text-warning-800">
                            <Pill className="h-4 w-4 text-purple-600" />
                            Gebruikt medicatie
                          </p>
                          <p className="mt-2 text-sm text-warning-700">
                            {medicalInfo.medication}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Other Medical Conditions */}
                  {medicalInfo.otherMedicalConditions && (
                    <>
                      <Divider />
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-700">
                          <Stethoscope className="h-5 w-5 text-teal-600" />
                          Andere medische aandoeningen
                        </h3>
                        <div className="rounded-lg border bg-warning-50 p-4">
                          <p className="text-sm text-warning-700">
                            {medicalInfo.otherMedicalConditions}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Physical Capabilities */}
                  <Divider />
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-700">
                      <Activity className="h-5 w-5 text-cyan-600" />
                      Fysieke mogelijkheden
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Badge
                        color={medicalInfo.canSwim ? "success" : "danger"}
                        variant="flat"
                      >
                        {medicalInfo.canSwim ? (
                          <span className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            Kan zwemmen
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-600" />
                            Kan zwemmen
                          </span>
                        )}
                      </Badge>
                      <Badge
                        color={
                          medicalInfo.canParticipateSports
                            ? "success"
                            : "danger"
                        }
                        variant="flat"
                      >
                        {medicalInfo.canParticipateSports ? (
                          <span className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            Kan sporten
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-600" />
                            Kan sporten
                          </span>
                        )}
                      </Badge>
                      <Badge
                        color={
                          medicalInfo.getsTiredQuickly ? "warning" : "success"
                        }
                        variant="flat"
                      >
                        {medicalInfo.getsTiredQuickly ? (
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            Snel moe
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            Snel moe
                          </span>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Medication Permission */}
                  <Divider />
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-700">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      Toestemming medicatie
                    </h3>
                    <Badge
                      color={
                        medicalInfo.permissionMedication ? "success" : "danger"
                      }
                      variant="flat"
                    >
                      {medicalInfo.permissionMedication ? (
                        <span className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          Toestemming voor medicatie
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-600" />
                          Toestemming voor medicatie
                        </span>
                      )}
                    </Badge>
                  </div>

                  {/* Other Remarks */}
                  {medicalInfo.otherRemarks && (
                    <>
                      <Divider />
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-700">
                          <FileText className="h-5 w-5 text-gray-600" />
                          Andere opmerkingen
                        </h3>
                        <div className="rounded-lg border bg-gray-50 p-4">
                          <p className="text-sm text-gray-700">
                            {medicalInfo.otherRemarks}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <SignInAsLeiding />
      </SignedOut>
    </>
  );
}
