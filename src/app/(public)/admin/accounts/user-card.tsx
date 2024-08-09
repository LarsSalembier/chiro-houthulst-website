"use client";

import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { type Role } from "types/globals";
import { Badge } from "~/components/ui/badge";
import { deleteUserAndRevalidate, setRoleAndRevalidate } from "./actions";
import { toast } from "sonner";
import { AuthenticationError, AuthorizationError } from "~/utils/errors";

interface UserCardProps {
  id: string;
  primaryEmail?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export default function UserCard({
  id,
  primaryEmail,
  firstName,
  lastName,
  role,
}: UserCardProps) {
  const handleSetRole = async (role: Role) => {
    try {
      await setRoleAndRevalidate(id, role);
      toast.success(`Rol succesvol gewijzigd naar ${role}`);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        toast.error(
          `Je hebt geen toestemming om de rol van deze gebruiker te wijzigen naar ${role}.`,
        );
      } else if (error instanceof AuthenticationError) {
        toast.error("Je bent niet ingelogd.");
      } else {
        toast.error(
          `Er is een fout opgetreden bij het wijzigen van de rol naar ${role}.`,
        );
      }

      console.error(`Error setting role for user ${id}:`, error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUserAndRevalidate(id);
      toast.success("Gebruiker succesvol verwijderd.");
    } catch (error) {
      if (error instanceof AuthorizationError) {
        toast.error(
          "Je hebt geen toestemming om deze gebruiker te verwijderen.",
        );
      } else if (error instanceof AuthenticationError) {
        toast.error("Je bent niet ingelogd.");
      } else {
        toast.error(
          "Er is een fout opgetreden bij het verwijderen van de gebruiker.",
        );
      }

      console.error(`Error deleting user ${id}:`, error);
    }
  };

  const buttons = [
    {
      label: "Maak leiding",
      role: "leiding",
    },
    {
      label: "Maak administrator",
      role: "admin",
    },
    {
      label: "Verwijder rol",
      role: "none",
    },
  ];

  if (role === "leiding") {
    buttons.shift();
  }

  if (role === "admin") {
    buttons.splice(1, 1);
  }

  if (role === "none") {
    buttons.pop();
  }

  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-4">
      <div className="flex gap-2">
        <p className="font-medium">
          {firstName ?? ""} {lastName ?? ""}
        </p>
        <p className="text-gray-500">{primaryEmail}</p>
        <Badge className={role === "admin" ? "bg-purple-800" : "bg-green-700"}>
          {role}
        </Badge>
      </div>
      <div className="mt-4 flex w-full flex-wrap gap-4">
        {buttons.map(({ label, role }) => (
          <Button
            key={role}
            size="sm"
            onClick={() => handleSetRole(role as Role)}
          >
            {label}
          </Button>
        ))}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive">
              Verwijder account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Verwijder gebruiker</AlertDialogTitle>
              <AlertDialogDescription>
                Weet je zeker dat je deze gebruiker wilt verwijderen? Deze actie
                kan niet ongedaan worden gemaakt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuleer</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser}>
                Verwijder
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
