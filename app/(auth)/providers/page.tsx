import { Suspense } from "react";
import { BreadcrumbCmp } from "@/components/shared";
import { ProvidersTable } from "@/components/custom";

const Providers = () => {
  return (
    <div className="grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Providers" },
        ]}
      />

      <div className="flex md:gap-x-5">
        <Suspense>
          <ProvidersTable />
        </Suspense>
      </div>
    </div>
  );
};

export default Providers;
