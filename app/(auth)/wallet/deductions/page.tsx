"use client";

import { IconDownload, IconListFilter } from "@/components/icons";
import {
  BreadcrumbCmp,
  PaginationCmp,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import {
  TransactionMobileCard,
  TransactionStatCard,
} from "@/components/custom";
import { Button } from "@/components/ui";
import { DEDUCTION_TRANSACTIONS_DATA } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { WALLET_TABLE_HEADERS } from "@/lib/constants";

const Deductions = () => {
  const walletStats = [
    { id: 1, title: "Unit Balance", value: "235,402,853", bg: "bg-grey-400" },
    { id: 2, title: "Total Credit", value: "502,853", bg: "bg-green" },
    {
      id: 3,
      title: "Total Deduction",
      value: "2,853",
      bg: "bg-red-light",
      href: "/wallet/deductions",
    },
  ];

  const tableData = DEDUCTION_TRANSACTIONS_DATA.map((deduction) => {
    return {
      id: deduction.id,
      date_and_time: (
        <p className="text-brand-2">
          {deduction.date} • {deduction.time}
        </p>
      ),
      description: deduction.description,
      amount: <p>₦{deduction.amount}</p>,
      type: deduction.type,
      status: (
        <p
          className={cn(
            "capitalize",
            deduction.status === "success" ? "text-green-500" : "text-red-500"
          )}
        >
          {deduction.status}
        </p>
      ),
    };
  });

  return (
    <div className="w-full grid gap-y-3 md:gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Wallet", href: "/wallet" },
          { id: 2, name: "Deductions" },
        ]}
      />

      <div className="bg-white rounded-lg md:rounded-2xl p-1 md:p-6 grid grid-cols-3 gap-1 md:gap-4">
        {walletStats.map((stat) => (
          <TransactionStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            className={stat.bg}
            href={stat.href}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 grid gap-y-4 md:gap-y-5">
        <h3 className="font-bold text-brand-1">Deduction Transactions</h3>

        <div className="flex items-center justify-between gap-3">
          <Searchbar value={""} onChange={() => {}} placeholder={"Search"} />

          <div className="flex items-center gap-x-4">
            <Button variant="outline" className="py-2 px-2 md:px-3">
              <IconDownload className="stroke-brand-btn-secondary" />
            </Button>

            <Button
              variant="secondary"
              className="px-2 md:px-3 py-2 shadow-none"
            >
              <IconListFilter className="stroke-brand-btn-secondary" />
            </Button>
          </div>
        </div>

        <TableCmp data={tableData} headers={WALLET_TABLE_HEADERS} />

        <div className="md:hidden grid gap-y-2">
          {DEDUCTION_TRANSACTIONS_DATA.map((transaction) => (
            <TransactionMobileCard key={transaction.id} {...transaction} />
          ))}
        </div>

        <PaginationCmp
          onInputPage={() => {}}
          currentPage={"24"}
          totalPages={"30"}
        />
      </div>
    </div>
  );
};

export default Deductions;
