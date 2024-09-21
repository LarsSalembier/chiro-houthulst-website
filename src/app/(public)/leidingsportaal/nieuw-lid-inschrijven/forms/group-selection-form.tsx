"use client";

import React, { useEffect, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type RegistrationFormData } from "../schemas";
import { getGroupsForBirthDateAndGender } from "../actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Loader2 } from "lucide-react";
import { type Group } from "~/domain/entities/group";

interface GroupSelectionProps {
  form: UseFormReturn<RegistrationFormData>;
}

export default function GroupSelection({ form }: GroupSelectionProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const birthDate = form.watch("memberDateOfBirth");
  const gender = form.watch("memberGender");

  useEffect(() => {
    async function fetchGroups() {
      if (birthDate && gender) {
        setIsLoading(true);
        setError(null);
        try {
          const result = await getGroupsForBirthDateAndGender(
            birthDate,
            gender,
          );
          if ("error" in result) {
            return <div>{result.error}</div>;
          }

          setGroups(result);
          if (result.length === 1) {
            form.setValue("memberGroupId", result[0]!.id);
          }
        } catch (err) {
          console.error("Error fetching groups:", err);
          setError(
            "Er is een fout opgetreden bij het ophalen van de groepen. Probeer het later opnieuw.",
          );
        } finally {
          setIsLoading(false);
        }
      }
    }

    void fetchGroups();
  }, [birthDate, gender, form]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Groepen laden...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (groups.length === 0)
    return (
      <div>
        <p>
          Er zijn geen groepen gevonden voor deze geboortedatum en geslacht.
        </p>
      </div>
    );

  if (groups.length === 1) {
    return (
      <div>
        <p>Je wordt ingedeeld in de groep: {groups[0]!.name}</p>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="memberGroupId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Selecteer een groep</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(Number(value))}
            value={field.value?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer een groep" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
