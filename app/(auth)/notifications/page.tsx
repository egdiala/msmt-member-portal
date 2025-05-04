import { NotificationTable } from "@/components/custom";
import { Suspense } from "react";
import { BreadcrumbCmp } from "@/components/shared";

const Notifications = () => {
  return (
    <div className="grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Notifications" },
        ]}
      />

      <div className="bg-white rounded-2xl p-3 md:p-6 grid gap-y-4 md:gap-y-5">
        <h2 className="font-bold text-text-1">Notifications</h2>
        <Suspense>
          <NotificationTable />
        </Suspense>
      </div>
    </div>
  );
};

export default Notifications;
