import { createContext, useContext, useState } from "react";
import { type RegistrationFormInputData } from "./registration-form-input-data";
import { type RecursivePartial } from "~/types/recursive-partial";

interface RegistrationFormContextType {
  formData: RecursivePartial<RegistrationFormInputData>;
  updateFormData: (data: RecursivePartial<RegistrationFormInputData>) => void;
  clearFormData: () => void;
}

const RegistrationFormContext = createContext<
  RegistrationFormContextType | undefined
>(undefined);

const STORAGE_KEY = "multistep_form_data";

function mergeParentsWithAddresses(
  current: RecursivePartial<RegistrationFormInputData["parentsWithAddresses"]>,
  updated: RecursivePartial<RegistrationFormInputData["parentsWithAddresses"]>,
) {
  return updated.map((parentWithAddress, index) => {
    return {
      ...current[index],
      ...parentWithAddress,
    };
  });
}

export default function MultistepFormContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialFormData: RecursivePartial<RegistrationFormInputData> = {
    memberDateOfBirth: new Date(),
    parentsWithAddresses: [
      {
        postalCode: 8650,
        municipality: "Houthulst",
      },
    ],
  };

  const [formData, setFormData] = useState<
    RecursivePartial<RegistrationFormInputData>
  >(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? (JSON.parse(saved) as RecursivePartial<RegistrationFormInputData>)
      : initialFormData;
  });

  const updateFormData = (
    data: RecursivePartial<RegistrationFormInputData>,
  ) => {
    const updatedData = {
      ...formData,
      ...data,
      parentsWithAddresses: mergeParentsWithAddresses(
        formData.parentsWithAddresses!,
        data.parentsWithAddresses!,
      ),
      asthma: {
        ...formData.asthma,
        ...data.asthma,
      },
      bedwetting: {
        ...formData.bedwetting,
        ...data?.bedwetting,
      },
      epilepsy: {
        ...formData.epilepsy,
        ...data.epilepsy,
      },
      heartCondition: {
        ...formData.heartCondition,
        ...data.heartCondition,
      },
      hayFever: {
        ...formData.hayFever,
        ...data.hayFever,
      },
      skinCondition: {
        ...formData.skinCondition,
        ...data.skinCondition,
      },
      rheumatism: {
        ...formData.rheumatism,
        ...data.rheumatism,
      },
      sleepwalking: {
        ...formData.sleepwalking,
        ...data.sleepwalking,
      },
      diabetes: {
        ...formData.diabetes,
        ...data.diabetes,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    setFormData(updatedData);
  };

  const clearFormData = () => {
    setFormData({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <RegistrationFormContext.Provider
      value={{ formData, updateFormData, clearFormData }}
    >
      {children}
    </RegistrationFormContext.Provider>
  );
}

export function useRegistrationFormContext() {
  const context = useContext(RegistrationFormContext);
  if (context === undefined) {
    throw new Error(
      "useRegistrationFormContext must be used within a RegistrationFormContextProvider",
    );
  }
  return context;
}
