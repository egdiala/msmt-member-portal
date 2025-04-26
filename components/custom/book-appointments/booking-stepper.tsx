"use client";

import { RenderIf } from "@/components/shared";
import { AppointmentStepper, ProvidersTable } from "../providers";
import { SetScheduleStep } from "../providers";
import { ThirdPartyPaymentGate } from "../providers";
import { FillAppointmentQuestionnaireForm } from "../providers";
import { useStepper } from "@/contexts/StepperContext";

export const BookingStepper = () => {
  const { step, setStep } = useStepper();
  console.log(step, "STEPS");

  return (
    <div className="mx-auto w-full ">
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

      <RenderIf condition={step === 1}>
        <div className="flex md:gap-x-5">
          <ProvidersTable />
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
