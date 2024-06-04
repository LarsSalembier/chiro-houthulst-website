"use client";

import { useFormState, useFormStatus } from "react-dom";
import { sendEmail } from "~/app/_actions/send-email";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const initialState = {
  state: "",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-fit" disabled={pending}>
      Add
    </Button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(sendEmail, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="naam" className="mb-2 block">
          Naam:
        </Label>
        <Input type="text" id="naam" name="name" required />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2 block">
          Emailadres:
        </Label>
        <Input type="email" id="email" name="email" required />
      </div>
      <div>
        <Label htmlFor="bericht" className="mb-2 block">
          Bericht:
        </Label>
        <Textarea id="bericht" name="message" rows={6} required></Textarea>
      </div>
      <SubmitButton />
      {state.message && state.state === "error" && (
        <p className="text-destructive">{state.message}</p>
      )}
      {state.message && state.state === "success" && (
        <p className="text-success">{state.message}</p>
      )}
    </form>
  );
}
