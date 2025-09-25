"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Square } from "lucide-react";
import type { WorkYear } from "~/server/db/schema";
import { endWorkYear } from "~/app/leidingsportaal/admin/actions";
import { addToast } from "@heroui/react";

interface EndWorkYearButtonProps {
  currentWorkYear: WorkYear;
}

export default function EndWorkYearButton({
  currentWorkYear,
}: EndWorkYearButtonProps) {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nl-BE");
  };

  const handleEndWorkYear = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const endedWorkYear = await endWorkYear(currentWorkYear.id, endDate);
      if (endedWorkYear) {
        addToast({
          title: "Succes",
          description: "Werkjaar succesvol beëindigd",
          color: "success",
        });
        onClose();
        // Refresh the page to show the updated state
        window.location.reload();
      }
    } catch (error) {
      console.error("Error ending work year:", error);
      addToast({
        title: "Fout",
        description:
          error instanceof Error
            ? error.message
            : "Fout bij beëindigen werkjaar",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color="danger"
        startContent={<Square className="h-4 w-4" />}
        onPress={onOpen}
        className="mb-8"
      >
        Werkjaar Beëindigen
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Werkjaar Beëindigen</ModalHeader>
          <ModalBody>
            <p>Weet je zeker dat je het huidige werkjaar wilt beëindigen?</p>
            <p className="mt-2 text-sm text-gray-600">
              Het werkjaar wordt beëindigd op {formatDate(new Date())}. Deze
              actie kan niet ongedaan worden gemaakt.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={onClose}>
              Annuleren
            </Button>
            <Button
              color="danger"
              onPress={handleEndWorkYear}
              isLoading={loading}
            >
              Werkjaar Beëindigen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
