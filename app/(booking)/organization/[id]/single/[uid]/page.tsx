import { SingleOrganisationIndividualProviderContent } from "@/components/custom";
import { StepperProvider } from "@/contexts/StepperContext";

const SingleOrganisationIndividualProvider = () => {
  return (
    <StepperProvider>
      <div className="grid gap-y-2">
        <SingleOrganisationIndividualProviderContent />
      </div>
    </StepperProvider>
  );
};

export default SingleOrganisationIndividualProvider;
