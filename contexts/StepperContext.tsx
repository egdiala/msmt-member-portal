"use client";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

interface StepperType {
  step: number | string;
  setStep: Dispatch<SetStateAction<number | string>>;
}

const StepperContext = createContext<StepperType | undefined>(undefined);

export const StepperProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState<number | string>(() => {
    if (typeof window !== "undefined") {
      const storedStep = localStorage.getItem("current-step");
      const parsedStep = parseInt(storedStep || "", 10);
      return isNaN(parsedStep) ? 1 : parsedStep;
    }
    return 1;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("current-step", step.toString());
    }
  }, [step]);

  return (
    <StepperContext.Provider value={{ step, setStep }}>
      {children}
    </StepperContext.Provider>
  );
};

export const useStepper = (): StepperType => {
  const context = useContext(StepperContext);
  if (context === undefined) {
    throw new Error("useStepper must be used within a StepperProvider");
  }
  return context;
};
