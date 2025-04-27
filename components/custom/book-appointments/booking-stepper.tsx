"use client";

import { RenderIf } from "@/components/shared";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Checkbox } from "@/components/ui";
import { AppointmentStepper, ProvidersTable } from "../providers";
import { SetScheduleStep } from "../providers";
import { ThirdPartyPaymentGate } from "../providers";
import { FillAppointmentQuestionnaireForm } from "../providers";
import { useStepper } from "@/contexts/StepperContext";
import { IconCreditCard, IconUsers, IconWallet } from "@/components/icons";
export const BookingStepper = () => {
  const { step, setStep } = useStepper();
  const paymentMethods = [
    { id: 1, name: "Family", icon: IconUsers },
    { id: 2, name: "Wallet", icon: IconWallet },
    { id: 3, name: "Card", icon: IconCreditCard },
  ];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([
    "Family",
  ]);

  return (
    <div className="mx-auto w-full h-full  grid  gap-4">
      <div className="hidden md:flex flex-col justify-center items-center gap-4">
        <RenderIf condition={step === 2}>
          <div className="flex items-center gap-x-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => {
                  if (selectedPaymentMethod.includes(method.name)) {
                    setSelectedPaymentMethod(
                      selectedPaymentMethod.filter((val) => val !== method.name)
                    );
                  } else {
                    setSelectedPaymentMethod([
                      ...selectedPaymentMethod,
                      method.name,
                    ]);
                  }
                }}
                className="flex items-center gap-x-2 px-3 py-2 rounded-full border bg-white border-divider cursor-pointer hover:bg-blue-400"
              >
                {selectedPaymentMethod.includes(method.name) ? (
                  <Checkbox
                    checked={selectedPaymentMethod.includes(method.name)}
                  />
                ) : (
                  <method.icon className="stroke-brand-3 size-3.5" />
                )}

                <p
                  className={cn(
                    "text-sm",
                    selectedPaymentMethod.includes(method.name)
                      ? "text-button-primary"
                      : "text-brand-2"
                  )}
                >
                  {method.name}
                </p>
              </div>
            ))}
          </div>
        </RenderIf>
        <RenderIf condition={step === 1 || step === 2 || step === 3}>
          <AppointmentStepper
            steps={[
              { id: 1, name: "Providers" },
              { id: 2, name: "Schedule" },
              { id: 3, name: "Questionaire" },
            ]}
            step={parseInt(step.toString())}
          />
        </RenderIf>
      </div>
      <RenderIf condition={step === 1}>
        <div className="grid gap-4">
          <div className="text-center pb-4 md:py-5">
            <h1 className="text-lg md:text-2xl font-bold text-text-1 text-center">
              Select a Provider
            </h1>
            <p className="text-text-2 text-sm">
              You can search, filter a provider{" "}
            </p>
          </div>
          <div className="flex md:gap-x-5 max-w-5xl mx-auto w-full min-h-[500px]">
            <ProvidersTable />
          </div>
        </div>
      </RenderIf>

      <RenderIf condition={step === 2}>
        <div className="mx-auto w-full max-w-2xl">
          <SetScheduleStep setStep={setStep} />
        </div>
      </RenderIf>

      <RenderIf condition={step === "gateway"}>
        <ThirdPartyPaymentGate setStep={setStep} />
      </RenderIf>

      <RenderIf condition={step === 3}>
        <div className="mx-auto w-full max-w-2xl">
          <FillAppointmentQuestionnaireForm setStep={setStep} />
        </div>
      </RenderIf>
    </div>
  );
};
