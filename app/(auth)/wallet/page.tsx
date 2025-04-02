"use client";

import { useState } from "react";
import {
  FilterTransactionsPopover,
  FundWalletModal,
  TransactionMobileCard,
  TransactionStatCard,
} from "@/components/custom";
import { IconDownload, IconHandCoins, IconPlus } from "@/components/icons";
import {
  BreadcrumbCmp,
  PaginationCmp,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import { Button } from "@/components/ui";
import { WALLET_TABLE_HEADERS } from "@/lib/constants";
import { TRANSACTIONS_DATA } from "@/lib/mock";
import { cn } from "@/lib/utils";

const Wallet = () => {
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

  const tableData = TRANSACTIONS_DATA.map((transaction) => {
    return {
      id: transaction.id,
      date_and_time: (
        <p className="text-brand-2">
          {transaction.date} • {transaction.time}
        </p>
      ),
      description: transaction.description,
      amount: <p>₦{transaction.amount}</p>,
      type: <p className="capitalize">{transaction.type}</p>,
      status: (
        <p
          className={cn(
            "capitalize",
            transaction.status === "success" ? "text-green-500" : "text-red-500"
          )}
        >
          {transaction.status}
        </p>
      ),
    };
  });

  const [openFundWalletModal, setOpenFundWalletModal] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="w-full grid gap-y-3 md:gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Wallet" },
        ]}
      />

      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
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
        <h3 className="font-bold text-brand-1">Transactions</h3>

        <div className="flex items-end md:items-center justify-between gap-3 flex-col md:flex-row">
          <Searchbar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search"}
            onClear={() => {}}
          />

          <div className="flex items-center gap-x-4">
            <Button variant="outline" className="py-2 px-2 md:px-3">
              <IconDownload className="stroke-brand-btn-secondary" />
            </Button>

            <FilterTransactionsPopover />

            <Button
              className="gap-x-1"
              onClick={() => setOpenFundWalletModal(true)}
            >
              <IconHandCoins className="stroke-white hidden md:inline-flex" />
              <IconPlus className="stroke-white md:hidden" />
              Fund Wallet
            </Button>
          </div>
        </div>

        <TableCmp data={tableData} headers={WALLET_TABLE_HEADERS} />

        <div className="md:hidden grid gap-y-2">
          {TRANSACTIONS_DATA.map((transaction) => (
            <TransactionMobileCard key={transaction.id} {...transaction} />
          ))}
        </div>

        <PaginationCmp
          onInputPage={() => {}}
          currentPage={"24"}
          totalPages={"30"}
        />
      </div>

      <FundWalletModal
        isOpen={openFundWalletModal}
        handleClose={() => setOpenFundWalletModal(false)}
      />
    </div>
  );
};

export default Wallet;
