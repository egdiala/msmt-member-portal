"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

interface IThirdPartyPaymentGate {
  setStep: Dispatch<SetStateAction<string | number>>;
}
export const ThirdPartyPaymentGate = ({ setStep }: IThirdPartyPaymentGate) => {
  return (
    <div className="min-h-full flex flex-col justify-center items-center gap-y-8">
      <h3 className="text-3xl font-bold">3RD Party Payment Gate</h3>

      <div className="grid grid-cols-2 md:flex md:items-center justify-center gap-x-5">
        <Button variant="secondary" onClick={() => setStep(1)}>
          Cancel
        </Button>
        <Button onClick={() => setStep(2)}>Payment Success</Button>
      </div>
    </div>
  );
};
