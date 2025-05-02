import { Suspense } from "react";
import { Footer, Header, SingleProvider } from "@/components/custom";

const LandingPageSingleProvider = () => {
  return (
    <div className="w-full max-w-[1550px] mx-auto">
      <Header />

      <div className="grid gap-y-2 px-5 md:px-15 xl:px-25 py-5 md:py-12">
        <Suspense>
          <SingleProvider />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPageSingleProvider;
