import Cookies from "js-cookie";
import { IconTick } from "@/components/icons";
import { RenderIf } from "@/components/shared";
import { cn } from "@/lib/utils";

interface IAppointmentStepper {
  step: number;
  steps: { id: number; name: string }[];
}

export const AppointmentStepper = ({ step, steps }: IAppointmentStepper) => {
  const isLoggedIn = Cookies.get("authToken");
  return (
    <>
      <div className={cn("hidden md:flex items-start gap-x-41 justify-center ", !!isLoggedIn ? 'pt-16 pb-7' : '')}>
        {steps?.map((innerStep, index) => (
          <div key={index} className="flex items-center gap-x-1 relative">
            <div className="flex flex-col items-center gap-y-2 text-center">
              <RenderIf condition={step > index + 1}>
                <IconTick />
              </RenderIf>

              <RenderIf condition={step === index + 1 || step < index + 1}>
                <div className="border-4 border-divider bg-white size-4 rounded-full" />
              </RenderIf>

              <p className="text-brand-1 text-sm">{innerStep.name}</p>
            </div>

            <RenderIf condition={index <= 1 && !isLoggedIn}>
              <div
                className={cn(
                  "w-53 border-t absolute top-2 left-11",
                  step > index + 1 ? "border-actions-green" : "border-divider"
                )}
              ></div>
            </RenderIf>

            <RenderIf condition={index === 0 && !!isLoggedIn}>
              <div
                className={cn(
                  "w-53 border-t absolute top-2 left-11",
                  step > index + 1 ? "border-actions-green" : "border-divider"
                )}
              ></div>
            </RenderIf>
          </div>
        ))}
      </div>

      <p className="md:hidden text-center text-sm text-brand-2">
        Step {step} of {steps?.length}
      </p>
    </>
  );
};
