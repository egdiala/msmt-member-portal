import { WalletStatsSection, WalletTable } from "@/components/custom";
import { BreadcrumbCmp } from "@/components/shared";

const Wallet = () => {
  return (
    <div className="w-full grid gap-y-3 md:gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Wallet" },
        ]}
      />

      <WalletStatsSection />

      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 grid gap-y-4 md:gap-y-5">
        <WalletTable />
      </div>
    </div>
  );
};

export default Wallet;
