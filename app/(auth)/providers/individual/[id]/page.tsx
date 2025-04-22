import { SingleIndividualProviderContent } from "@/components/custom";
import { Suspense } from "react";

const SingleIndividualProvider = () => {
  return (
    <div className="grid gap-y-2">
      <Suspense>
        <SingleIndividualProviderContent />
      </Suspense>
    </div>
  );
};

export default SingleIndividualProvider;
