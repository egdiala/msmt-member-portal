"use client";

import { useState } from "react";
import { RenderIf } from "@/components/shared";
import { AppointmentStepper, ProvidersTable } from "../providers";
import { SetScheduleStep } from "../providers";
import { ThirdPartyPaymentGate } from "../providers";
import { FillAppointmentQuestionnaireForm } from "../providers";

export const BookingStepper = () => {
  const [step, setStep] = useState<number | string>(1);

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
        <SetScheduleStep setStep={setStep} />
      </RenderIf>

      <RenderIf condition={step === "gateway"}>
        <ThirdPartyPaymentGate setStep={setStep} />
      </RenderIf>

      <RenderIf condition={step === 3}>
        <FillAppointmentQuestionnaireForm setStep={setStep} />
      </RenderIf>
    </div>
  );
};
