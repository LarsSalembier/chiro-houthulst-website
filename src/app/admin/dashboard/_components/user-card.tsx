"use client";

import { useState } from "react";
import setRole from "../_actions/set-role";
import { toast } from "sonner";
import { deleteUser } from "../_actions/delete-user";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSetRole = async (role: "admin" | "user") => {
    const result = await setRole(id, role);

    if (result.success) {
      toast.success(`Rol succesvol gewijzigd naar ${role}`);
    } else {
      toast.error(
        result.message ||
          "Er is een fout opgetreden bij het wijzigen van de rol.",
      );
    }
  };

  const handleDeleteUser = async () => {
    const result = await deleteUser(id);

    if (result.success) {
      toast.success("Gebruiker succesvol verwijderd.");
    } else {
      toast.error(
        result.message ||
          "Er is een fout opgetreden bij het verwijderen van de gebruiker.",
      );
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-4">
      <div className="flex gap-2">
        <p className="font-medium">
          {firstName ?? ""} {lastName ?? ""}
        </p>
        <p className="text-gray-500">{primaryEmail}</p>
      </div>
      <div className="mt-2 flex items-center gap-4">
        <p>Huidige rol: {role ?? "geen"}</p>
        {role !== "admin" ? (
          <Button size="sm" onClick={() => handleSetRole("admin")}>
            Maak administrator
          </Button>
        ) : (
          <Button size="sm" onClick={() => handleSetRole("user")}>
            Maak gebruiker
          </Button>
        )}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive">
              Verwijder
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
