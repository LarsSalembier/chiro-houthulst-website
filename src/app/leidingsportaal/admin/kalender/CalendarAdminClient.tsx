"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useForm } from "@tanstack/react-form";
// Define a simplified event type for the admin interface
type AdminEvent = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  coverImageUrl: string | null;
  facebookEventUrl: string | null;
  price: number | null;
  canSignUp: boolean;
  signUpDeadline: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
};
import { createEvent, updateEvent, deleteEvent } from "./actions";
import DDMMYYYYDateInput from "~/components/ui/dd-mm-yyyy-date-input";
import { UploadButton } from "~/utilities/uploadthing";
import { Image } from "@heroui/image";

interface CalendarAdminClientProps {
  initialEvents: AdminEvent[];
}

export default function CalendarAdminClient({
  initialEvents,
}: CalendarAdminClientProps) {
  const [events, setEvents] = useState<AdminEvent[]>(initialEvents);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const form = useForm({
    defaultValues: {
      title: "",
      startDate: undefined as Date | undefined,
      endDate: undefined as Date | undefined,
      location: "",
      coverImageUrl: "",
      facebookEventUrl: "",
      price: undefined as number | undefined,
      canSignUp: false,
      signUpDeadline: undefined as Date | undefined,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const eventData = {
          title: value.title,
          startDate: value.startDate!,
          endDate: value.endDate,
          location: value.location || undefined,
          facebookEventUrl: value.facebookEventUrl || undefined,
          price: value.price ?? undefined,
          canSignUp: value.canSignUp,
          signUpDeadline: value.signUpDeadline,
          coverImageUrl: uploadedImageUrl || value.coverImageUrl || undefined,
        };

        if (editingEvent) {
          const updatedEvent = await updateEvent(editingEvent.id, eventData);
          setEvents(
            events.map((e) =>
              e.id === editingEvent.id ? (updatedEvent as AdminEvent) : e,
            ),
          );
        } else {
          const newEvent = await createEvent(eventData);
          setEvents([...events, newEvent as AdminEvent]);
        }

        form.reset();
        setEditingEvent(null);
        setUploadedImageUrl("");
        onOpenChange();
      } catch (error) {
        console.error("Error saving event:", error);
        // TODO: Add proper error handling
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleEdit = (event: AdminEvent) => {
    setEditingEvent(event);
    setUploadedImageUrl("");
    form.setFieldValue("title", event.title);
    form.setFieldValue("startDate", event.startDate);
    form.setFieldValue("endDate", event.endDate ?? undefined);
    form.setFieldValue("location", event.location ?? "");
    form.setFieldValue("coverImageUrl", event.coverImageUrl ?? "");
    form.setFieldValue("facebookEventUrl", event.facebookEventUrl ?? "");
    form.setFieldValue("price", event.price ?? undefined);
    form.setFieldValue("canSignUp", event.canSignUp);
    form.setFieldValue("signUpDeadline", event.signUpDeadline ?? undefined);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Ben je zeker dat je dit evenement wilt verwijderen?")) {
      try {
        await deleteEvent(id);
        setEvents(events.filter((e) => e.id !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
        // TODO: Add proper error handling
      }
    }
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setUploadedImageUrl("");
    form.reset();
    onOpen();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("nl-BE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Evenementen</h2>
        <Button color="primary" onPress={handleNewEvent}>
          Nieuw Evenement
        </Button>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {formatDate(event.startDate)}
                  {event.endDate ? ` - ${formatDate(event.endDate)}` : ""}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-600">📍 {event.location}</p>
                )}
                {event.price && (
                  <p className="text-sm text-gray-600">💰 €{event.price}</p>
                )}
                {event.canSignUp && (
                  <p className="text-sm text-green-600">✓ Inschrijven nodig</p>
                )}
                {event.facebookEventUrl && (
                  <p className="text-sm text-blue-600">
                    📘 Facebook event beschikbaar
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => handleEdit(event)}
                >
                  Bewerken
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => handleDelete(event.id)}
                >
                  Verwijderen
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="inside"
      >
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
                {editingEvent ? "Evenement Bewerken" : "Nieuw Evenement"}
              </ModalHeader>
              <ModalBody className="max-h-[70vh] space-y-4 overflow-y-auto">
                <form.Field name="title">
                  {(field) => (
                    <Input
                      label="Titel"
                      placeholder="Naam van het evenement"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isRequired
                    />
                  )}
                </form.Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name="startDate">
                    {(field) => (
                      <DDMMYYYYDateInput
                        label="Startdatum"
                        value={field.state.value}
                        onChange={(date: Date | undefined) => {
                          field.handleChange(date);
                        }}
                        isRequired
                      />
                    )}
                  </form.Field>

                  <form.Field name="endDate">
                    {(field) => (
                      <DDMMYYYYDateInput
                        label="Einddatum"
                        value={field.state.value}
                        onChange={(date: Date | undefined) => {
                          field.handleChange(date);
                        }}
                      />
                    )}
                  </form.Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name="location">
                    {(field) => (
                      <Input
                        label="Locatie"
                        placeholder="Waar vindt het evenement plaats?"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>

                  <form.Field name="price">
                    {(field) => (
                      <Input
                        label="Prijs (€)"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={field.state.value?.toString() ?? ""}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          )
                        }
                      />
                    )}
                  </form.Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name="canSignUp">
                    {(field) => (
                      <div className="flex items-center">
                        <Checkbox
                          isSelected={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          Inschrijving mogelijk
                        </Checkbox>
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="signUpDeadline">
                    {(field) => (
                      <DDMMYYYYDateInput
                        label="Inschrijvingsdeadline"
                        value={field.state.value}
                        onChange={(date: Date | undefined) => {
                          field.handleChange(date);
                        }}
                      />
                    )}
                  </form.Field>
                </div>

                <form.Field name="facebookEventUrl">
                  {(field) => (
                    <Input
                      label="Facebook Event URL"
                      placeholder="https://facebook.com/events/..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Cover Afbeelding
                  </label>
                  <div className="space-y-2">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          setUploadedImageUrl(res[0].url);
                          form.setFieldValue("coverImageUrl", res[0].url);
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
                          Afbeelding geüpload!
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
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Annuleren
                </Button>
                <Button color="primary" type="submit" isLoading={isSubmitting}>
                  {editingEvent ? "Bijwerken" : "Aanmaken"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
