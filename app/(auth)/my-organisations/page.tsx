import { MyOrganisationsContent } from "@/components/custom";
import { BreadcrumbCmp } from "@/components/shared";

const MyOrganisations = () => {
  return (
    <div className="grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home" },
          { id: 2, name: "My Organisations" },
        ]}
      />

      <MyOrganisationsContent />
    </div>
  );
};

export default MyOrganisations;
