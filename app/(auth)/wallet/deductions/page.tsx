import { BreadcrumbCmp } from "@/components/shared";
import {
  WalletDeductionsStatsSection,
  WalletDeductionsTable,
} from "@/components/custom";

const Deductions = () => {
  return (
    <div className="w-full grid gap-y-3 md:gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Wallet", href: "/wallet" },
          { id: 2, name: "Deductions" },
        ]}
      />

      <WalletDeductionsStatsSection />

      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 grid gap-y-4 md:gap-y-5">
        <h3 className="font-bold text-brand-1">Deduction Transactions</h3>

        <WalletDeductionsTable />
      </div>
    </div>
  );
};

export default Deductions;
