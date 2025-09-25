"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Switch } from "@heroui/switch";
import { Play } from "lucide-react";
import type { WorkYear, Group } from "~/server/db/schema";
import { createWorkYear } from "~/app/leidingsportaal/admin/actions";
import { addToast } from "@heroui/react";

interface WorkYearFormData {
  startDate: string;
  membershipFee: string;
  groupStatuses: Record<number, boolean>;
}

interface StartWorkYearButtonProps {
  groups: Group[];
  onWorkYearStarted?: (workYear: WorkYear) => void;
}

export default function StartWorkYearButton({
  groups,
  onWorkYearStarted,
}: StartWorkYearButtonProps) {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [workYearForm, setWorkYearForm] = useState<WorkYearFormData>({
    startDate: new Date().toISOString().split("T")[0] ?? "",
    membershipFee: "40",
    groupStatuses: {},
  });

  const resetWorkYearForm = () => {
    setWorkYearForm({
      startDate: new Date().toISOString().split("T")[0] ?? "",
      membershipFee: "40",
      groupStatuses: {},
    });
  };

  const formatAgeInYears = (days: number) => {
    return Math.floor(days / 365);
  };

  const handleStartNewWorkYear = async () => {
    setLoading(true);
    try {
      const data = {
        startDate: new Date(workYearForm.startDate),
        membershipFee: parseFloat(workYearForm.membershipFee),
        groupStatuses: workYearForm.groupStatuses,
      };

      const newWorkYear = await createWorkYear(data);
      addToast({
        title: "Succes",
        description: "Nieuw werkjaar succesvol gestart",
        color: "success",
      });

      onClose();
      resetWorkYearForm();
      onWorkYearStarted?.(newWorkYear);
      // Refresh the page to show the new work year
      window.location.reload();
    } catch (error) {
      console.error("Error starting new work year:", error);
      addToast({
        title: "Fout",
        description:
          error instanceof Error
            ? error.message
            : "Fout bij starten nieuw werkjaar",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        startContent={<Play className="h-4 w-4" />}
        onPress={onOpen}
      >
        Nieuw Werkjaar Starten
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>Nieuw Werkjaar Starten</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <Input
                  label="Lidgeld (€)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={workYearForm.membershipFee}
                  onChange={(e) =>
                    setWorkYearForm((prev) => ({
                      ...prev,
                      membershipFee: e.target.value,
                    }))
                  }
                  isRequired
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Welke groepen zijn beschikbaar voor dit werkjaar?
                </label>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: group.color ?? "#6b7280" }}
                        />
                        <div>
                          <p className="text-sm font-medium">{group.name}</p>
                          <p className="text-xs text-gray-600">
                            {formatAgeInYears(group.minimumAgeInDays)} jaar
                            {group.maximumAgeInDays &&
                              ` - ${formatAgeInYears(group.maximumAgeInDays)} jaar`}
                          </p>
                        </div>
                      </div>
                      <Switch
                        size="sm"
                        isSelected={
                          workYearForm.groupStatuses[group.id] ?? group.active
                        }
                        onValueChange={(checked) =>
                          setWorkYearForm((prev) => ({
                            ...prev,
                            groupStatuses: {
                              ...prev.groupStatuses,
                              [group.id]: checked,
                            },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={onClose}>
              Annuleren
            </Button>
            <Button
              color="primary"
              onPress={handleStartNewWorkYear}
              isLoading={loading}
            >
              Werkjaar Starten
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
