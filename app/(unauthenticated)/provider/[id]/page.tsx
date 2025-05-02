import { Suspense } from "react";
import { SingleProvider } from "@/components/custom";

const LandingPageSingleProvider = () => {
  return (
    <div className="grid gap-y-2">
      <Suspense>
        <SingleProvider />
      </Suspense>
    </div>
  );
};

export default LandingPageSingleProvider;
