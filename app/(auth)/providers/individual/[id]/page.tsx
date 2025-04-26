import { SingleIndividualProviderContent } from "@/components/custom";
import { StepperProvider } from "@/contexts/StepperContext";
import { Suspense } from "react";

const SingleIndividualProvider = () => {
  return (
    <StepperProvider>
      <div className="grid gap-y-2">
        <Suspense>
        <SingleIndividualProviderContent />
        </Suspense>
    </div>
    </StepperProvider>
  );
};

export default SingleIndividualProvider;
