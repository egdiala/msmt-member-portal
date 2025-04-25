import { Suspense } from "react";
import { BreadcrumbCmp } from "@/components/shared";
import { FavouriteProvidersTable } from "@/components/custom";

const FavouriteProviders = () => {
  return (
    <div className="grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Favourite Providers" },
        ]}
      />

      <Suspense>
        <FavouriteProvidersTable />
      </Suspense>
    </div>
  );
};

export default FavouriteProviders;
