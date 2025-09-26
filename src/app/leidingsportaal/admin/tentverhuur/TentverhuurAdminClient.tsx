"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
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
  createTentRental,
  updateTentRental,
  deleteTentRental,
  createTentRentalTerm,
  updateTentRentalTerm,
  deleteTentRentalTerm,
} from "./actions";
import CreateButton from "~/components/buttons/create-button";
import EditButton from "~/components/buttons/edit-button";
import RemoveButton from "~/components/buttons/remove-button";
import { Image } from "@heroui/image";
import { UploadButton } from "~/utilities/uploadthing";
import { Edit, Trash } from "lucide-react";

type TentRental = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

type TentRentalTerm = {
  id: number;
  text: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

type TentverhuurAdminClientProps = {
  initialTentRentals: TentRental[];
  initialTentRentalTerms: TentRentalTerm[];
};

export default function TentverhuurAdminClient({
  initialTentRentals,
  initialTentRentalTerms,
}: TentverhuurAdminClientProps) {
  const [tentRentals, setTentRentals] =
    useState<TentRental[]>(initialTentRentals);
  const [tentRentalTerms, setTentRentalTerms] = useState<TentRentalTerm[]>(
    initialTentRentalTerms,
  );
  const [editingTentRental, setEditingTentRental] = useState<TentRental | null>(
    null,
  );
  const [editingTerm, setEditingTerm] = useState<TentRentalTerm | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isTermsOpen,
    onOpen: onTermsOpen,
    onOpenChange: onTermsOpenChange,
  } = useDisclosure();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      active: true,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = {
          ...value,
          imageUrl: uploadedImageUrl || value.imageUrl,
        };

        if (editingTentRental) {
          const updatedTentRental = await updateTentRental(
            editingTentRental.id,
            formData,
          );
          setTentRentals((prev) =>
            prev
              .map((tent) =>
                tent.id === editingTentRental.id ? updatedTentRental : tent,
              )
              .filter((tent): tent is TentRental => tent !== undefined),
          );
        } else {
          const newTentRental = await createTentRental(formData);
          setTentRentals((prev) =>
            [...prev, newTentRental].filter(
              (tent): tent is TentRental => tent !== undefined,
            ),
          );
        }
        onOpenChange();
        setEditingTentRental(null);
        setUploadedImageUrl("");
        form.reset();
      } catch (error) {
        console.error("Error saving tent rental:", error);
      }
    },
  });

  const termsForm = useForm({
    defaultValues: {
      text: "",
      order: 0,
      active: true,
    },
    onSubmit: async ({ value }) => {
      try {
        if (editingTerm) {
          const updatedTerm = await updateTentRentalTerm(editingTerm.id, value);
          setTentRentalTerms((prev) =>
            prev
              .map((term) => (term.id === editingTerm.id ? updatedTerm : term))
              .filter((term): term is TentRentalTerm => term !== undefined),
          );
        } else {
          const newTerm = await createTentRentalTerm(value);
          setTentRentalTerms((prev) =>
            [...prev, newTerm].filter(
              (term): term is TentRentalTerm => term !== undefined,
            ),
          );
        }
        onTermsOpenChange();
        setEditingTerm(null);
        termsForm.reset();
      } catch (error) {
        console.error("Error saving term:", error);
      }
    },
  });

  const handleEdit = (tentRental: TentRental) => {
    setEditingTentRental(tentRental);
    setUploadedImageUrl("");
    form.setFieldValue("name", tentRental.name);
    form.setFieldValue("description", tentRental.description ?? "");
    form.setFieldValue("price", tentRental.price);
    form.setFieldValue("imageUrl", tentRental.imageUrl ?? "");
    form.setFieldValue("active", tentRental.active);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Weet je zeker dat je deze tent wilt verwijderen?")) {
      try {
        await deleteTentRental(id);
        setTentRentals((prev) => prev.filter((tent) => tent.id !== id));
      } catch (error) {
        console.error("Error deleting tent rental:", error);
      }
    }
  };

  const handleCreate = () => {
    setEditingTentRental(null);
    setUploadedImageUrl("");
    form.reset();
    onOpen();
  };

  const handleEditTerm = (term: TentRentalTerm) => {
    setEditingTerm(term);
    termsForm.setFieldValue("text", term.text);
    termsForm.setFieldValue("order", term.order);
    termsForm.setFieldValue("active", term.active);
    onTermsOpen();
  };

  const handleDeleteTerm = async (id: number) => {
    if (confirm("Weet je zeker dat je deze voorwaarde wilt verwijderen?")) {
      try {
        await deleteTentRentalTerm(id);
        setTentRentalTerms((prev) => prev.filter((term) => term.id !== id));
      } catch (error) {
        console.error("Error deleting term:", error);
      }
    }
  };

  const handleCreateTerm = () => {
    setEditingTerm(null);
    termsForm.reset();
    onTermsOpen();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Catalogus</h2>
        <CreateButton onPress={handleCreate} content="Tent toevoegen" />
      </div>

      {tentRentals.length === 0 ? (
        <Card>
          <CardBody className="py-8 text-center">
            <p className="text-gray-500">Nog geen tenten toegevoegd</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tentRentals.map((tent) => (
            <Card key={tent.id}>
              <CardHeader className="p-0">
                {tent.imageUrl ? (
                  <Image
                    src={tent.imageUrl}
                    alt={tent.name}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                    <span className="text-gray-500">Geen foto</span>
                  </div>
                )}
              </CardHeader>
              <CardBody className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold">{tent.name}</h3>
                  <div className="flex gap-1">
                    <EditButton
                      onPress={() => handleEdit(tent)}
                      isIconOnly
                      content=""
                    />
                    <RemoveButton
                      onPress={() => handleDelete(tent.id)}
                      isIconOnly
                      content=""
                    />
                  </div>
                </div>
                {tent.description && (
                  <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                    {tent.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    €{tent.price.toFixed(2)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      tent.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tent.active ? "Actief" : "Inactief"}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Algemene Voorwaarden Sectie */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Algemene Voorwaarden</h2>
          <CreateButton
            onPress={handleCreateTerm}
            content="Voorwaarde toevoegen"
          />
        </div>

        {tentRentalTerms.length === 0 ? (
          <Card>
            <CardBody className="py-8 text-center">
              <p className="text-gray-500">Nog geen voorwaarden toegevoegd</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-2">
            {tentRentalTerms.map((term) => (
              <Card key={term.id}>
                <CardBody className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{term.order}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            term.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {term.active ? "Actief" : "Inactief"}
                        </span>
                      </div>
                      <p className="text-gray-700">{term.text}</p>
                    </div>
                    <div className="ml-4 flex gap-1">
                      <EditButton
                        onPress={() => handleEditTerm(term)}
                        content=""
                        isIconOnly
                      />
                      <RemoveButton
                        onPress={() => handleDeleteTerm(term.id)}
                        content=""
                        isIconOnly
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingTentRental ? "Tent bewerken" : "Nieuwe tent toevoegen"}
              </ModalHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void form.handleSubmit();
                }}
              >
                <ModalBody className="space-y-4">
                  <form.Field name="name">
                    {(field) => (
                      <Input
                        label="Naam"
                        placeholder="Bijv. 4-persoons tent"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        isRequired
                      />
                    )}
                  </form.Field>

                  <form.Field name="description">
                    {(field) => (
                      <Textarea
                        label="Beschrijving"
                        placeholder="Beschrijving van de tent..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        minRows={3}
                      />
                    )}
                  </form.Field>

                  <form.Field name="price">
                    {(field) => (
                      <Input
                        label="Prijs (€)"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={field.state.value.toString()}
                        onChange={(e) =>
                          field.handleChange(parseFloat(e.target.value) || 0)
                        }
                        isRequired
                      />
                    )}
                  </form.Field>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Foto</label>
                    <div className="space-y-2">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setUploadedImageUrl(res[0].url);
                            form.setFieldValue("imageUrl", res[0].url);
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.error("Upload error:", error);
                          alert(`Upload fout: ${error.message}`);
                        }}
                        appearance={{
                          button:
                            "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-r-none bg-primary px-4 py-2 text-sm font-medium text-white after:bg-primary",
                          allowedContent: "text-xs text-gray-500",
                        }}
                      />
                      {uploadedImageUrl && (
                        <div className="mt-2">
                          <p className="mb-2 text-xs text-green-600">
                            Foto geüpload!
                          </p>
                          <Image
                            src={uploadedImageUrl}
                            alt="Preview"
                            width={200}
                            height={150}
                            className="rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <form.Field name="active">
                    {(field) => (
                      <Switch
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Actief (zichtbaar op website)
                      </Switch>
                    )}
                  </form.Field>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Annuleren
                  </Button>
                  <Button color="primary" type="submit">
                    {editingTentRental ? "Bijwerken" : "Toevoegen"}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal voor Algemene Voorwaarden */}
      <Modal isOpen={isTermsOpen} onOpenChange={onTermsOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingTerm
                  ? "Voorwaarde bewerken"
                  : "Nieuwe voorwaarde toevoegen"}
              </ModalHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void termsForm.handleSubmit();
                }}
              >
                <ModalBody className="space-y-4">
                  <termsForm.Field name="text">
                    {(field) => (
                      <Textarea
                        label="Voorwaarde tekst"
                        placeholder="Bijv. Tenten moeten minimaal 1 week van tevoren gereserveerd worden"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        minRows={3}
                        isRequired
                      />
                    )}
                  </termsForm.Field>

                  <termsForm.Field name="order">
                    {(field) => (
                      <Input
                        label="Volgorde"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={field.state.value.toString()}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value) || 0)
                        }
                        isRequired
                      />
                    )}
                  </termsForm.Field>

                  <termsForm.Field name="active">
                    {(field) => (
                      <Switch
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Actief (zichtbaar op website)
                      </Switch>
                    )}
                  </termsForm.Field>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Annuleren
                  </Button>
                  <Button color="primary" type="submit">
                    {editingTerm ? "Bijwerken" : "Toevoegen"}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
