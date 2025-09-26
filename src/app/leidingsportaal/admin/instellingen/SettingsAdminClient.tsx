"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useForm } from "@tanstack/react-form";
import {
  createMainLeader,
  updateMainLeader,
  deleteMainLeader,
  createVB,
  updateVB,
  deleteVB,
} from "~/app/contacts/actions";

type MainLeader = {
  id: number;
  name: string;
  phone: string;
  order: number;
  createdAt: Date;
  updatedAt: Date | null;
};

type VB = {
  id: number;
  name: string;
  phone: string;
  order: number;
  createdAt: Date;
  updatedAt: Date | null;
};

interface SettingsAdminClientProps {
  initialMainLeaders: MainLeader[];
  initialVBs: VB[];
}

export default function SettingsAdminClient({
  initialMainLeaders,
  initialVBs,
}: SettingsAdminClientProps) {
  const [mainLeaders, setMainLeaders] =
    useState<MainLeader[]>(initialMainLeaders);
  const [vbs, setVBs] = useState<VB[]>(initialVBs);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    type: "mainLeader" | "vb";
    item: MainLeader | VB | null;
  } | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      order: 0,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        if (editingItem?.type === "mainLeader") {
          if (editingItem.item && "id" in editingItem.item) {
            // Update existing
            const updated = await updateMainLeader(editingItem.item.id, {
              name: value.name,
              phone: value.phone,
              order: value.order,
            });
            setMainLeaders((prev) =>
              prev
                .map((l) => (l.id === editingItem.item!.id ? updated : l))
                .filter((l): l is MainLeader => l !== undefined),
            );
          } else {
            // Create new
            const newLeader = await createMainLeader({
              name: value.name,
              phone: value.phone,
              order: value.order,
            });
            setMainLeaders((prev) =>
              [...prev, newLeader].filter(
                (l): l is MainLeader => l !== undefined,
              ),
            );
          }
          onOpenChange();
          form.reset();
        } else if (editingItem?.type === "vb") {
          if (editingItem.item && "id" in editingItem.item) {
            // Update existing
            const updated = await updateVB(editingItem.item.id, {
              name: value.name,
              phone: value.phone,
              order: value.order,
            });
            setVBs((prev) =>
              prev
                .map((v) => (v.id === editingItem.item!.id ? updated : v))
                .filter((v): v is VB => v !== undefined),
            );
          } else {
            // Create new
            const newVB = await createVB({
              name: value.name,
              phone: value.phone,
              order: value.order,
            });
            setVBs((prev) =>
              [...prev, newVB].filter((v): v is VB => v !== undefined),
            );
          }
          onOpenChange();
          form.reset();
        }
      } catch (error) {
        console.error("Error saving:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleEdit = (type: "mainLeader" | "vb", item: MainLeader | VB) => {
    setEditingItem({ type, item });
    if (type === "mainLeader" || type === "vb") {
      const contactItem = item;
      form.setFieldValue("name", contactItem.name ?? "");
      form.setFieldValue("phone", contactItem.phone ?? "");
      form.setFieldValue("order", contactItem.order ?? 0);
    }
    onOpen();
  };

  const handleNew = (type: "mainLeader" | "vb") => {
    setEditingItem({ type, item: null });
    form.reset();
    onOpen();
  };

  const handleDelete = async (type: "mainLeader" | "vb", id: number) => {
    if (confirm("Ben je zeker dat je dit item wilt verwijderen?")) {
      try {
        if (type === "mainLeader") {
          await deleteMainLeader(id);
          setMainLeaders((prev) => prev.filter((l) => l.id !== id));
        } else if (type === "vb") {
          await deleteVB(id);
          setVBs((prev) => prev.filter((v) => v.id !== id));
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Leaders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Hoofdleiding</h2>
          <Button color="primary" onPress={() => handleNew("mainLeader")}>
            Nieuwe Hoofdleiding
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mainLeaders.map((leader) => (
            <Card key={leader.id} className="p-4">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">{leader.name}</h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="mb-3 text-sm text-gray-600">{leader.phone}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => handleEdit("mainLeader", leader)}
                  >
                    Bewerken
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() => handleDelete("mainLeader", leader.id)}
                  >
                    Verwijderen
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* VBs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Volwassen Begeleiders</h2>
          <Button color="primary" onPress={() => handleNew("vb")}>
            Nieuwe VB
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vbs.map((vb) => (
            <Card key={vb.id} className="p-4">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">{vb.name}</h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="mb-3 text-sm text-gray-600">{vb.phone}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => handleEdit("vb", vb)}
                  >
                    Bewerken
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() => handleDelete("vb", vb.id)}
                  >
                    Verwijderen
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <ModalHeader>
                {editingItem?.type === "mainLeader" &&
                  (editingItem.item && "id" in editingItem.item
                    ? "Hoofdleiding Bewerken"
                    : "Nieuwe Hoofdleiding")}
                {editingItem?.type === "vb" &&
                  (editingItem.item && "id" in editingItem.item
                    ? "VB Bewerken"
                    : "Nieuwe VB")}
              </ModalHeader>
              <ModalBody className="space-y-4">
                {(editingItem?.type === "mainLeader" ||
                  editingItem?.type === "vb") && (
                  <>
                    <form.Field name="name">
                      {(field) => (
                        <Input
                          label="Naam"
                          placeholder="Naam van de persoon"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isRequired
                        />
                      )}
                    </form.Field>

                    <form.Field name="phone">
                      {(field) => (
                        <Input
                          label="Telefoon"
                          placeholder="Telefoonnummer"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isRequired
                        />
                      )}
                    </form.Field>

                    <form.Field name="order">
                      {(field) => (
                        <Input
                          label="Volgorde"
                          type="number"
                          placeholder="0"
                          value={field.state.value?.toString() ?? ""}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value) || 0)
                          }
                        />
                      )}
                    </form.Field>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Annuleren
                </Button>
                <Button color="primary" type="submit" isLoading={isSubmitting}>
                  {editingItem?.item && "id" in editingItem.item
                    ? "Bijwerken"
                    : "Aanmaken"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
