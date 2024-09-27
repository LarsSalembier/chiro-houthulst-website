import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import CheckboxField from "~/components/forms/checkbox-field";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface MedicationPermissionFormProps {
  form: UseFormReturn<RegisterMemberInput>;
}

export default function MedicationPermissionForm({
  form,
}: MedicationPermissionFormProps) {
  return (
    <CardWrapper
      title="Toedienen van medicatie"
      description="Het is verboden om als begeleid(st)er, behalve EHBO, op eigen initiatief medische handelingen uit te voeren. Ook het verstrekken van lichte pijnstillende en koortswerende medicatie zoals Perdolan, Dafalgan of Aspirine is, zonder toelating van de ouders, voorbehouden aan een arts. Daarom is het noodzakelijk om via deze steekkaart vooraf toestemming van ouders te hebben voor het eventueel toedienen van dergelijke hulp."
    >
      <FormField
        control={form.control}
        name="medicalInformation.permissionMedication"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <CheckboxField
                form={form}
                label="Ja, wij geven toestemming aan de begeleiders om bij
                hoogdringendheid aan onze zoon of dochter een dosis via de
                apotheek vrij verkrijgbare pijnstillende en koortswerende
                medicatie toe te dienen.*"
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              * gebaseerd op aanbeveling Kind & Gezin 09.12.2009 - Aanpak van
              koorts / Toedienen van geneesmiddelen in de kinderopvang
            </p>
          </FormItem>
        )}
      />
    </CardWrapper>
  );
}
