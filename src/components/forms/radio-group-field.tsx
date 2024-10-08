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
  FormLabel,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  options: RadioOption[];
  showBelowEachother?: boolean;
}

export default function RadioGroupField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  options,
  showBelowEachother,
}: RadioGroupFieldProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={`flex gap-2 ${showBelowEachother ? "flex-col" : "flex-wrap"}`}
            >
              {options.map(({ value, label }) => (
                <FormItem
                  key={value}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={value} />
                  </FormControl>
                  <FormLabel>{label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
