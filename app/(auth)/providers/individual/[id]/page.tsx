import { SingleIndividualProviderContent } from "@/components/custom";
import { StepperProvider } from "@/contexts/StepperContext";

const SingleIndividualProvider = () => {
  return (
    <StepperProvider>
      <div className="grid gap-y-2">
        <SingleIndividualProviderContent />
      </div>
    </StepperProvider>
  );
};

export default SingleIndividualProvider;
