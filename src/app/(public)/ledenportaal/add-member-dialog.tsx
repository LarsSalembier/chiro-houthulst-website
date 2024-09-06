"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

import { useState } from "react";
import { toast } from "sonner";
import { AuthenticationError } from "~/lib/errors";
import { RegistrationFormProvider } from "./form-context";
import { MemberForm } from "./member-form";
import { ParentForm } from "./parent-form";

export const MINIMUM_STEP = 1;
export const MAXIMUM_STEP = 2;

export default function AddMemberDialog() {
  const [step, setStep] = useState(1);

  const handlePrevious = () => {
    setStep((prev) => (prev - 1 < MINIMUM_STEP ? MINIMUM_STEP : prev - 1));
  };

  const handleNext = () => {
    setStep((prev) => (prev + 1 > MAXIMUM_STEP ? MAXIMUM_STEP : prev + 1));
  };

  const handleSubmit = async () => {
    try {
      // await createMemberAndRevalidate(values);
      toast.success(`Lid is succesvol toegevoegd.`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof AuthenticationError) {
      toast.error("Je bent niet ingelogd.");
    } else {
      toast.error("Er is iets misgegaan bij het toevoegen van het lid.");
      console.error("Error adding member", error);
    }
  };

  return (
    <RegistrationFormProvider>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="w-fit">
            Nieuw lid inschrijven
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuw lid inschrijven</DialogTitle>
            <DialogDescription>
              Vul onderstaand formulier in om een nieuw lid toe te voegen.
            </DialogDescription>
          </DialogHeader>
          {step === 1 ? (
            <MemberForm onNext={handleNext} />
          ) : (
            <ParentForm onPrevious={handlePrevious} onNext={handleSubmit} />
          )}
        </DialogContent>
      </Dialog>
    </RegistrationFormProvider>
  );
}
