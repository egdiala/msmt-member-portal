"use client";

import { useState } from "react";
import { RenderIf } from "@/components/shared";
import { AppointmentStepper } from "./appointment-stepper";
import { SetScheduleStep } from "./appointment-schedule-form";
import { ThirdPartyPaymentGate } from "./third-party-payment-gate";
import { FillAppointmentQuestionnaireForm } from "./appointment-questionnaire-form";

export const BookAppointmentContent = () => {
  const [step, setStep] = useState<number | string>(1);

  return (
    <div className="mx-auto w-full max-w-2xl md:min-h-screen md:h-screen">
      <RenderIf condition={step === 1 || step === 2}>
        <AppointmentStepper
          steps={[
            { id: 1, name: "Schedule" },
            { id: 2, name: "Questionaire" },
          ]}
          step={parseInt(step.toString())}
        />
      </RenderIf>

      <RenderIf condition={step === 1}>
        <SetScheduleStep setStep={setStep} />
      </RenderIf>

      <RenderIf condition={step === "gateway"}>
        <ThirdPartyPaymentGate setStep={setStep} />
      </RenderIf>

      <RenderIf condition={step === 2}>
        <FillAppointmentQuestionnaireForm setStep={setStep} />
      </RenderIf>
    </div>
  );
};
