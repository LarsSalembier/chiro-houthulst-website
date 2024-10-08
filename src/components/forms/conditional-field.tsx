import React from "react";
import {
  type UseFormReturn,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

interface ConditionalFieldProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  placeholder: string;
  condition: boolean;
  numberOfLines?: number;
}

export default function ConditionalField<TFieldValues extends FieldValues>({
  form,
  name,
  placeholder,
  condition,
  numberOfLines = 3,
}: ConditionalFieldProps<TFieldValues>) {
  if (!condition) return null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              rows={numberOfLines}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
