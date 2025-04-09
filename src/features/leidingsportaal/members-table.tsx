"use client";

import { useCallback } from "react";
import { type Member, type Group } from "~/server/db/schema";

import { Table } from "~/components/ui/table";
import TableLink from "~/components/ui/table-link";
import CreateButton from "~/components/buttons/create-button";

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

const columns = [
  // Basic info
  { name: "NAAM", uid: "name", sortable: true },
  { name: "VOORNAAM", uid: "firstName", sortable: true },
  { name: "ACHTERNAAM", uid: "lastName", sortable: true },
  { name: "GESLACHT", uid: "gender", sortable: true },
  { name: "GEBOORTEDATUM", uid: "dateOfBirth", sortable: true },

  // Group info
  { name: "AFDELING", uid: "group", sortable: true },

  // Parent info
  { name: "OUDER(S)", uid: "parentNames", sortable: true },
  { name: "TELNR(S) OUDERS", uid: "parentPhoneNumbers", sortable: true },
  {
    name: "E-MAIL OUDERS",
    uid: "parentEmailAddresses",
    sortable: true,
  },

  // Emergency contact info
  { name: "NOODCONTACT", uid: "emergencyContactName", sortable: true },
  {
    name: "TELNR NOODCONTACT",
    uid: "emergencyContactPhoneNumber",
    sortable: true,
  },

  // Medical info
  { name: "HUISDOKTER", uid: "doctorName", sortable: true },
  { name: "TELNR HUISDOKTER", uid: "doctorPhoneNumber", sortable: true },
  { name: "TETANUSVACCINATIE", uid: "tetanusVaccination", sortable: true },
  { name: "ASTMA", uid: "asthma", sortable: true },
  { name: "BEDWATEREN", uid: "bedwetting", sortable: true },
  { name: "EPILEPSIE", uid: "epilepsy", sortable: true },
  { name: "HARTAANDOENING", uid: "heartCondition", sortable: true },
  { name: "HOOIKOORTS", uid: "hayFever", sortable: true },
  { name: "HUIDAANDOENING", uid: "skinCondition", sortable: true },
  { name: "REUMA", uid: "rheumatism", sortable: true },
  { name: "SLAAPWANDELINGEN", uid: "sleepwalking", sortable: true },
  { name: "DIABETES", uid: "diabetes", sortable: true },
  { name: "VOEDSELALLERGIEËN", uid: "foodAllergies", sortable: true },
  { name: "STOFALLERGIEËN", uid: "substanceAllergies", sortable: true },
  { name: "MEDICATIEALLERGIEËN", uid: "medicationAllergies", sortable: true },
  { name: "MEDICATIE", uid: "medication", sortable: true },
  {
    name: "MEDISCHE AANDOENING",
    uid: "otherMedicalConditions",
    sortable: true,
  },
  { name: "IS SNEL MOE", uid: "getsTiredQuickly", sortable: true },
  {
    name: "SPORT/SPEL",
    uid: "canParticipateSports",
    sortable: true,
  },
  { name: "ZWEMMEN", uid: "canSwim", sortable: true },
  { name: "ANDERE INFO", uid: "otherRemarks", sortable: true },
  {
    name: "TOESTEMMING MEDICATIE",
    uid: "permissionMedication",
    sortable: true,
  },

  // Extra info
  { name: "E-MAILADRES LID", uid: "emailAddress", sortable: true },
  { name: "TELEFOONNUMMER LID", uid: "phoneNumber", sortable: true },
  {
    name: "TOELATING FOTO'S",
    uid: "gdprPermissionToPublishPhotos",
    sortable: true,
  },
  { name: "INGESCHREVEN SINDS", uid: "createdAt", sortable: true },
  { name: "LAATST AANGEPAST", uid: "updatedAt", sortable: true },
  { name: "ID", uid: "id", sortable: true },

  // Membership info
  { name: "BETAALD?", uid: "paymentReceived", sortable: true },
  { name: "BETAALMETHODE", uid: "paymentMethod", sortable: true },
  { name: "BETAALD OP", uid: "paymentDate", sortable: true },
] as { name: string; uid: keyof MemberTableData; sortable?: boolean }[];

const initialVisibleColumns = [
  "name",
  "group",
  "parentNames",
  "parentPhoneNumbers",
  "emergencyContactPhoneNumber",
  "doctorPhoneNumber",
  "paymentReceived",
] as (keyof MemberTableData)[];

interface MembersTableProps {
  members: MemberTableData[];
}

export default function ToponymsTable({ members }: MembersTableProps) {
  const renderCell = useCallback(
    (member: MemberTableData, columnKey: keyof MemberTableData | "actions") => {
      switch (columnKey) {
        case "id":
          return <span>{member.id}</span>;
        case "name":
          return (
            <TableLink href={`/leidingsportaal/leden/${member.id}`}>
              {member.name}
            </TableLink>
          );
        case "firstName":
          return <span>{member.firstName}</span>;
        case "lastName":
          return <span>{member.lastName}</span>;
        case "gender":
          return <span>{member.gender}</span>;
        case "dateOfBirth":
          return <span>{member.dateOfBirth.toLocaleDateString("nl-BE")}</span>;
        case "group":
          return <span>{member.group?.name}</span>;
        case "parentNames":
          return <span>{member.parentNames}</span>;
        case "parentPhoneNumbers":
          return <span>{member.parentPhoneNumbers}</span>;
        case "parentEmailAddresses":
          return <span>{member.parentEmailAddresses}</span>;
        case "emergencyContactName":
          return <span>{member.emergencyContactName}</span>;
        case "emergencyContactPhoneNumber":
          return <span>{member.emergencyContactPhoneNumber}</span>;
        case "doctorName":
          return <span>{member.doctorName}</span>;
        case "doctorPhoneNumber":
          return <span>{member.doctorPhoneNumber}</span>;
        case "tetanusVaccination":
          return (
            <span
              className={
                member.tetanusVaccination ? "text-green-500" : "text-red-500"
              }
            >
              {member.tetanusVaccination ? "Ja" : "Nee"}
            </span>
          );
        case "asthma":
          return (
            <span className={member.asthma ? "text-red-500" : "text-green-500"}>
              {member.asthma ? "Ja" : "Nee"}
            </span>
          );
        case "bedwetting":
          return (
            <span
              className={member.bedwetting ? "text-red-500" : "text-green-500"}
            >
              {member.bedwetting ? "Ja" : "Nee"}
            </span>
          );
        case "epilepsy":
          return (
            <span
              className={member.epilepsy ? "text-red-500" : "text-green-500"}
            >
              {member.epilepsy ? "Ja" : "Nee"}
            </span>
          );
        case "heartCondition":
          return (
            <span
              className={
                member.heartCondition ? "text-red-500" : "text-green-500"
              }
            >
              {member.heartCondition ? "Ja" : "Nee"}
            </span>
          );
        case "hayFever":
          return (
            <span
              className={member.hayFever ? "text-red-500" : "text-green-500"}
            >
              {member.hayFever ? "Ja" : "Nee"}
            </span>
          );
        case "skinCondition":
          return (
            <span
              className={
                member.skinCondition ? "text-red-500" : "text-green-500"
              }
            >
              {member.skinCondition ? "Ja" : "Nee"}
            </span>
          );
        case "rheumatism":
          return (
            <span
              className={member.rheumatism ? "text-red-500" : "text-green-500"}
            >
              {member.rheumatism ? "Ja" : "Nee"}
            </span>
          );
        case "sleepwalking":
          return (
            <span
              className={
                member.sleepwalking ? "text-red-500" : "text-green-500"
              }
            >
              {member.sleepwalking ? "Ja" : "Nee"}
            </span>
          );
        case "diabetes":
          return (
            <span
              className={member.diabetes ? "text-red-500" : "text-green-500"}
            >
              {member.diabetes ? "Ja" : "Nee"}
            </span>
          );
        case "foodAllergies":
          return (
            <span
              className={
                member.foodAllergies ? "text-red-500" : "text-green-500"
              }
            >
              {member.foodAllergies}
            </span>
          );
        case "substanceAllergies":
          return (
            <span
              className={
                member.substanceAllergies ? "text-red-500" : "text-green-500"
              }
            >
              {member.substanceAllergies}
            </span>
          );
        case "medicationAllergies":
          return (
            <span
              className={
                member.medicationAllergies ? "text-red-500" : "text-green-500"
              }
            >
              {member.medicationAllergies}
            </span>
          );
        case "medication":
          return (
            <span
              className={member.medication ? "text-red-500" : "text-green-500"}
            >
              {member.medication}
            </span>
          );
        case "otherMedicalConditions":
          return (
            <span
              className={
                member.otherMedicalConditions
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {member.otherMedicalConditions}
            </span>
          );
        case "getsTiredQuickly":
          return (
            <span
              className={
                member.getsTiredQuickly ? "text-red-500" : "text-green-500"
              }
            >
              {member.getsTiredQuickly ? "Ja" : "Nee"}
            </span>
          );
        case "canParticipateSports":
          return (
            <span
              className={
                member.canParticipateSports ? "text-green-500" : "text-red-500"
              }
            >
              {member.canParticipateSports ? "Ja" : "Nee"}
            </span>
          );
        case "canSwim":
          return (
            <span
              className={member.canSwim ? "text-green-500" : "text-red-500"}
            >
              {member.canSwim ? "Ja" : "Nee"}
            </span>
          );
        case "otherRemarks":
          return (
            <span
              className={
                member.otherRemarks ? "text-red-500" : "text-green-500"
              }
            >
              {member.otherRemarks}
            </span>
          );
        case "permissionMedication":
          return (
            <span
              className={
                member.permissionMedication ? "text-green-500" : "text-red-500"
              }
            >
              {member.permissionMedication ? "Ja" : "Nee"}
            </span>
          );
        case "emailAddress":
          return <span>{member.emailAddress}</span>;
        case "phoneNumber":
          return <span>{member.phoneNumber}</span>;
        case "gdprPermissionToPublishPhotos":
          return (
            <span
              className={
                member.gdprPermissionToPublishPhotos
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {member.gdprPermissionToPublishPhotos ? "Ja" : "Nee"}
            </span>
          );
        case "createdAt":
          return <span>{member.createdAt.toLocaleDateString("nl-BE")}</span>;
        case "updatedAt":
          return <span>{member.updatedAt?.toLocaleDateString("nl-BE")}</span>;
        case "paymentReceived":
          return (
            <span
              className={
                member.paymentReceived ? "text-green-500" : "text-red-500"
              }
            >
              {member.paymentReceived ? "Ja" : "Nee"}
            </span>
          );
        case "paymentMethod":
          return <span>{member.paymentMethod}</span>;
        case "paymentDate":
          return <span>{member.paymentDate?.toLocaleDateString("nl-BE")}</span>;
        default:
          return null;
      }
    },
    [],
  );

  return (
    <Table<MemberTableData>
      items={members}
      columns={columns}
      initialVisibleColumns={initialVisibleColumns}
      renderCellAction={renderCell}
      searchPlaceholder="Zoek een lid..."
      searchKeys={["name"]}
      extraActions={
        <CreateButton
          href="/leidingsportaal/leden/lid-inschrijven"
          content="Nieuw lid inschrijven"
        />
      }
      emptyContentMessage="Geen leden gevonden."
      totalItemCount={members.length}
      entityNamePlural="leden"
    />
  );
}
