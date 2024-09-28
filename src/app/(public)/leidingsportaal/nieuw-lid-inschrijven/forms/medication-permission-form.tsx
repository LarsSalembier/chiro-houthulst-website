import React from "react";
import { type UseFormReturn } from "react-hook-form";
import CardWrapper from "~/components/card-wrapper";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
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
              <RadioGroup
                onValueChange={field.onChange}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="YES" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Ja, wij geven toestemming aan de begeleiders om bij
                    hoogdringendheid aan onze zoon of dochter een dosis via de
                    apotheek vrij verkrijgbare pijnstillende en koortswerende
                    medicatie toe te dienen.*
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="NO" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Nee, wij geven geen toestemming
                  </FormLabel>
                </FormItem>
              </RadioGroup>
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
