import { BreadcrumbCmp } from "@/components/shared";
import { FamilyAndFriendsTable } from "@/components/custom";

const FamilyAndFriends = () => {
  return (
    <div className="w-full grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Family & Friends" },
        ]}
      />

      <FamilyAndFriendsTable />
    </div>
  );
};

export default FamilyAndFriends;
