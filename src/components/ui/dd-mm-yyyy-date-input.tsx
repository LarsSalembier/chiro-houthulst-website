"use client";

import { useState, useEffect } from "react";
import { Input } from "@heroui/input";

interface DDMMYYYYDateInputProps {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  placeholder?: string;
}

export default function DDMMYYYYDateInput({
  label,
  value,
  onChange,
  isInvalid = false,
  errorMessage,
  isRequired = false,
  placeholder = "dd-mm-yyyy"
}: DDMMYYYYDateInputProps) {
  const [inputValue, setInputValue] = useState("");

  // Convert Date to DD-MM-YYYY string
  useEffect(() => {
    if (value) {
      const day = value.getDate().toString().padStart(2, '0');
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const year = value.getFullYear();
      setInputValue(`${day}-${month}-${year}`);
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    // Don't validate or call onChange while typing - only store the input value
  };

  const handleBlur = () => {
    // Only validate and update the date when the user finishes editing (on blur)
    if (inputValue.trim() === "") {
      onChange(undefined);
      return;
    }

    // Parse DD-MM-YYYY format
    const dateRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
    const match = dateRegex.exec(inputValue);
    
    if (match) {
      const [, dayStr, monthStr, yearStr] = match;
      if (dayStr && monthStr && yearStr) {
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10) - 1; // Convert to 0-indexed
        const year = parseInt(yearStr, 10);
        
        // Validate date
        if (day >= 1 && day <= 31 && month >= 0 && month <= 11 && year >= 1900 && year <= 2100) {
          const date = new Date(year, month, day);
          // Check if the date is valid (handles edge cases like February 30th)
          if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
            onChange(date);
            return;
          }
        }
      }
    }
    
    // If not a valid date, keep the input value but don't update the date
    // This allows users to continue editing without losing their input
  };

  return (
    <Input
      label={label}
      value={inputValue}
      onValueChange={handleInputChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      isRequired={isRequired}
      description="Format: dd-mm-yyyy (bijvoorbeeld: 15-03-2024)"
    />
  );
} 