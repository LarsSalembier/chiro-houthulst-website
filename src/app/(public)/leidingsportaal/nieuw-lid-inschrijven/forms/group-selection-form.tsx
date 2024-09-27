"use client";

import React, { useEffect, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
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
import { toast } from "sonner";
import { type RegisterMemberInput } from "~/interface-adapters/controllers/members/schema";

interface GroupSelectionProps {
  form: UseFormReturn<RegisterMemberInput>;
}

export default function GroupSelection({ form }: GroupSelectionProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const birthDate = form.watch("memberData.dateOfBirth");
  const gender = form.watch("memberData.gender");

  useEffect(() => {
    async function fetchGroups() {
      if (birthDate && gender) {
        setIsLoading(true);
        setError(null);
        const result = await getGroupsForBirthDateAndGender(birthDate, gender);

        if ("error" in result) {
          toast.error(result.error);
          return <div className="text-red-500">{result.error}</div>;
        }

        const groups = result.success;

        setGroups(groups);
        if (groups.length === 1) {
          form.setValue("groupId", groups[0]!.id);
        }

        setIsLoading(false);
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
      name="groupId"
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
