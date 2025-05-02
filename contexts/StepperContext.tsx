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
import Cookies from "js-cookie";

interface StepperType {
  step: number | string;
  setStep: Dispatch<SetStateAction<number | string>>;
}

const StepperContext = createContext<StepperType | undefined>(undefined);

export const StepperProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState<number | string>(() => {
    const cookieStep = Cookies.get("current-step");
    console.log(cookieStep, "Cookies");
    return Number(cookieStep) ?? 1;
  });

  useEffect(() => {
    Cookies.set("current-step", step.toString(), { expires: 7 });
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
