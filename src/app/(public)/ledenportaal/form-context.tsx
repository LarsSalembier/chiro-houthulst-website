import React, { createContext, useState, useContext } from "react";
import { type ParentFormData } from "./parent-form";
import { type MemberFormData } from "./member-form";

type FormData = {
  memberData: MemberFormData;
  parentData: ParentFormData;
};

type FormContextType = {
  formData: FormData;
  setMemberData: (data: MemberFormData) => void;
  setParentData: (data: ParentFormData) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: React.ReactNode;
}

export function RegistrationFormProvider({ children }: FormProviderProps) {
  const [formData, setFormData] = useState<FormData>({} as FormData);

  const setMemberData = (data: MemberFormData) => {
    setFormData((prev) => ({ ...prev, memberData: data }));
  };

  const setParentData = (data: ParentFormData) => {
    setFormData((prev) => ({ ...prev, parentData: data }));
  };

  return (
    <FormContext.Provider value={{ formData, setMemberData, setParentData }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
