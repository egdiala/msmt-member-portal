"use client";
import { useState } from "react";
import {
  SetScheduleStep,
  ThirdPartyPaymentGate,
  FillAppointmentQuestionnaireForm,
} from "@/components/custom";
import { RenderIf } from "@/components/shared";

const BookAppointment = () => {
  const [step, setStep] = useState<number | string>(1);

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 bg-portal z-50 h-screen overflow-y-scroll">
      <div className="mx-auto w-full max-w-2xl min-h-screen h-screen">
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
