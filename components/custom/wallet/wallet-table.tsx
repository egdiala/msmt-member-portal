"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { PaginationCmp, Searchbar, TableCmp } from "@/components/shared";
import { IconDownload, IconHandCoins, IconPlus } from "@/components/icons";
import { cn } from "@/lib/utils";
import { TRANSACTIONS_DATA } from "@/lib/mock";
import { WALLET_TABLE_HEADERS } from "@/lib/constants";
import { useGetWalletTransactions } from "@/services/hooks/queries/use-wallet";
import { FundWalletModal } from "./fund-wallet-modal";
import { FilterTransactionsPopover } from "./filter-transactions-popover";
import { TransactionMobileCard } from "./transaction-mobile-card";

export const WalletTable = () => {
  const { data: walletTransactions } = useGetWalletTransactions({});
  console.log({ walletTransactions });

  const [search, setSearch] = useState("");
  const [openFundWalletModal, setOpenFundWalletModal] = useState(false);

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

  return (
    <>
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

      <FundWalletModal
        isOpen={openFundWalletModal}
        handleClose={() => setOpenFundWalletModal(false)}
      />
    </>
  );
};
