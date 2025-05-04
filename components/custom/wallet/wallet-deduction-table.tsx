"use client";

import { IconDownload } from "@/components/icons";
import { PaginationCmp, Searchbar, TableCmp } from "@/components/shared";
import { Button } from "@/components/ui";
import { WALLET_TABLE_HEADERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DEDUCTION_TRANSACTIONS_DATA } from "@/lib/mock";
import { FilterTransactionsPopover } from "./filter-transactions-popover";

export const WalletDeductionsTable = () => {
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
      type: <p className="capitalize">{deduction.type}</p>,
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
    <>
      <div className="flex items-end md:items-center justify-between gap-3 flex-col md:flex-row">
        <Searchbar onChange={() => {}} placeholder={"Search"} />

        <div className="flex items-center gap-x-4">
          <Button variant="outline" className="py-2 px-2 md:px-3">
            <IconDownload className="stroke-brand-btn-secondary" />
          </Button>

          <FilterTransactionsPopover
            isDeduction
            setFilters={() => console.log("")}
            selected={undefined}
            setSelected={() => console.log("")}
            transactionTypeFilter={""}
            setTransactionTypeFilter={() => console.log("")}
            statusFilter={""}
            setStatusFilter={() => console.log("")}
            dateFilters={undefined}
          />
        </div>
      </div>

      <TableCmp data={tableData} headers={WALLET_TABLE_HEADERS} />

      {/* <div className="md:hidden grid gap-y-2">
        {DEDUCTION_TRANSACTIONS_DATA.map((transaction) => (
          <TransactionMobileCard key={transaction.id} {...transaction} />
        ))}
      </div> */}

      <PaginationCmp
        onInputPage={() => {}}
        currentPage={"24"}
        totalPages={"30"}
      />
    </>
  );
};
