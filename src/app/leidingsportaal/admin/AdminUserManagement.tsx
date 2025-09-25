"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

import { User, Mail, Shield, UserCheck } from "lucide-react";
import type { UserWithRole } from "./actions";
import { updateUserRole } from "./actions";
import { addToast } from "@heroui/react";

interface AdminUserManagementProps {
  users: UserWithRole[];
}

export default function AdminUserManagement({
  users,
}: AdminUserManagementProps) {
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

  // Check if there's only one admin
  const isLastAdmin =
    users.filter((u) => u.publicMetadata.role === "admin").length === 1;

  const handleRoleChange = async (
    userId: string,
    newRole: "leiding" | "admin" | null,
  ) => {
    setUpdatingUsers((prev) => new Set(prev).add(userId));

    try {
      await updateUserRole(userId, newRole);
      addToast({
        title: "Succes",
        description: "Rol succesvol bijgewerkt",
        color: "success",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      addToast({
        title: "Fout",
        description: "Fout bij het bijwerken van de rol",
        color: "danger",
      });
    } finally {
      setUpdatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-600" />;
      case "leiding":
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  // Sort users into categories
  const adminUsers = users
    .filter((u) => u.publicMetadata.role === "admin")
    .sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`,
      ),
    );
  const leidingUsers = users
    .filter((u) => u.publicMetadata.role === "leiding")
    .sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`,
      ),
    );
  const otherUsers = users
    .filter((u) => !u.publicMetadata.role)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return (
    <div className="space-y-6">
      {/* Admins Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-3">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Beheerders</h2>
              <p className="text-sm text-gray-600">
                Beheerders kunnen gebruikers beheren, contactgegevens aanpassen
                en werkjaren beheren.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-2">
            {adminUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(user.publicMetadata.role)}
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{user.emailAddresses[0]?.emailAddress}</span>
                        <span className="text-gray-400">•</span>
                        <span>
                          Lid sinds {user.createdAt.toLocaleDateString("nl-BE")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    color="danger"
                    variant="bordered"
                    size="sm"
                    isDisabled={updatingUsers.has(user.id)}
                    onPress={() => {
                      if (isLastAdmin) {
                        addToast({
                          title: "Je bent de laatste beheerder",
                          description:
                            "Je kunt de laatste beheerder niet verwijderen omdat er altijd minimaal één beheerder moet zijn.",
                          color: "danger",
                        });
                        return;
                      }
                      void handleRoleChange(user.id, null);
                    }}
                  >
                    Verwijder als beheerder
                  </Button>
                </div>
              </div>
            ))}
            {adminUsers.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Geen beheerders gevonden
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Leiding Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Leiding</h2>
              <p className="text-sm text-gray-600">
                Leiding kunnen op het leidingsportaal leden inschrijven en de
                gegevens van leden bekijken.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-2">
            {leidingUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(user.publicMetadata.role)}
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{user.emailAddresses[0]?.emailAddress}</span>
                        <span className="text-gray-400">•</span>
                        <span>
                          Lid sinds {user.createdAt.toLocaleDateString("nl-BE")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    color="danger"
                    variant="bordered"
                    size="sm"
                    isDisabled={updatingUsers.has(user.id)}
                    onPress={() => void handleRoleChange(user.id, null)}
                  >
                    Verwijder als leiding
                  </Button>
                  <Button
                    color="secondary"
                    variant="bordered"
                    size="sm"
                    isDisabled={updatingUsers.has(user.id)}
                    onPress={() => void handleRoleChange(user.id, "admin")}
                  >
                    Maak beheerder
                  </Button>
                </div>
              </div>
            ))}
            {leidingUsers.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Geen leiding gevonden
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Other Users Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-3">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Overige Gebruikers</h2>
              <p className="text-sm text-gray-600">
                Gebruikers zonder rol kunnen niet op het leidingsportaal en
                kunnen ook niks aanpassen op de website.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-2">
            {otherUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(user.publicMetadata.role)}
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{user.emailAddresses[0]?.emailAddress}</span>
                        <span className="text-gray-400">•</span>
                        <span>
                          Lid sinds {user.createdAt.toLocaleDateString("nl-BE")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    color="primary"
                    variant="bordered"
                    size="sm"
                    isDisabled={updatingUsers.has(user.id)}
                    onPress={() => void handleRoleChange(user.id, "leiding")}
                  >
                    Maak leiding
                  </Button>
                  <Button
                    color="secondary"
                    variant="bordered"
                    size="sm"
                    isDisabled={updatingUsers.has(user.id)}
                    onPress={() => void handleRoleChange(user.id, "admin")}
                  >
                    Maak beheerder
                  </Button>
                </div>
              </div>
            ))}
            {otherUsers.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Geen overige gebruikers gevonden
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
