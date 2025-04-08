"use client";
import { useState } from "react";
import {
  SetScheduleStep,
  ThirdPartyPaymentGate,
  FillAppointmentQuestionnaireForm,
  AppointmentStepper,
} from "@/components/custom";
import { RenderIf } from "@/components/shared";

const BookAppointment = () => {
  const [step, setStep] = useState<number | string>(1);

  return (
    <div className="md:absolute md:top-0 md:bottom-0 md:left-0 md:right-0 md:bg-portal md:z-50 md:h-screen md:overflow-y-scroll">
      <div className="mx-auto w-full max-w-2xl md:min-h-screen md:h-screen">
        <RenderIf condition={step === 1 || step === 2}>
          <AppointmentStepper step={parseInt(step.toString())} />
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
    </div>
  );
};

export default BookAppointment;
