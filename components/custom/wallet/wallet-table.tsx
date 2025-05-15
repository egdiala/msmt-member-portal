"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  endOfMonth,
  format,
  parse,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { Button } from "@/components/ui";
import {
  FilterTag,
  PaginationCmp,
  RenderIf,
  TableCmp,
} from "@/components/shared";
import { IconHandCoins, IconPlus } from "@/components/icons";
import {
  getPaginationParams,
  setPaginationParams,
} from "@/hooks/use-pagination-params";
import {
  formatTableDate,
  useGetTableTotalPages,
} from "@/hooks/use-format-table-info";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { cn } from "@/lib/utils";
import {
  WALLET_FILTER_KEY_MATCH,
  WALLET_TABLE_HEADERS,
  WALLET_TRANSACTION_TYPE_FILTER_ENUM,
} from "@/lib/constants";
import { useGetWalletTransactions } from "@/services/hooks/queries/use-wallet";
import {
  FetchedWalletTransactionsCountType,
  FetchedWalletTransactionsType,
} from "@/types/wallet";
import { FundWalletModal } from "./fund-wallet-modal";
import { FilterTransactionsPopover } from "./filter-transactions-popover";
import { TransactionMobileCard } from "./transaction-mobile-card";
import { WALLET_TRANSACTION_STATUS_FILTER_ENUM } from "../../../lib/constants";

export const WalletTable = () => {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Record<string, any>>({});

  const { data: walletTransactions, isLoading: isLoadingWalletTransactions } =
    useGetWalletTransactions<FetchedWalletTransactionsType[]>({
      page: page?.toString(),
      item_per_page: itemsPerPage.toString(),
      ...filters,
    });

  const { data: walletTransactionsCount } =
    useGetWalletTransactions<FetchedWalletTransactionsCountType>({
      component: "count",
      ...filters,
    });

  const [openFundWalletModal, setOpenFundWalletModal] = useState(false);

  const tableData = walletTransactions?.map((transaction) => {
    return {
      id: transaction.transaction_id,
      date_and_time: (
        <p className="text-brand-2">
          {transaction.createdAt ? formatTableDate(transaction.createdAt) : ""}
        </p>
      ),
      description: transaction.description,
      amount: <p>{formatNumberWithCommas(transaction.amount ?? 0)}</p>,
      type: (
        <p className="capitalize">
          <RenderIf condition={transaction.transaction_type === 1}>
            Credit
          </RenderIf>
          <RenderIf condition={transaction.transaction_type === 2}>
            Debit
          </RenderIf>
        </p>
      ),
      status: (
        <p
          className={cn(
            "capitalize",
            transaction.status === 1 ? "text-green-500" : "text-red-500"
          )}
        >
          <RenderIf condition={transaction.status === 1}>Successful</RenderIf>
          <RenderIf condition={transaction.status === 2}>Failed</RenderIf>
          <RenderIf condition={transaction.status === 3}>Abandoned</RenderIf>
        </p>
      ),
    };
  });

  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (!isNaN(page)) {
      setPage(page);
      setPaginationParams(page, router, searchParams);
    }
  };

  getPaginationParams(setPage);

  const today = startOfToday();
  //eslint-disable-next-line
  const [dateFilters, _] = useState([
    {
      id: 1,
      name: "Today",
      value: { start: today, end: today, label: "today" },
    },
    {
      id: 2,
      name: "This Month",
      value: {
        start: startOfMonth(
          parse(format(today, "yyyy-MM-dd"), "yyyy-MM-dd", new Date())
        ),
        end: endOfMonth(
          parse(format(today, "yyyy-MM-dd"), "yyyy-MM-dd", new Date())
        ),
        label: "this-month",
      },
    },
    {
      id: 3,
      name: "All Time",
      value: { start: "", end: "", label: "all-time" },
    },
    {
      id: 4,
      name: "Custom",
      value: { start: "", end: "", label: "custom-range" },
    },
  ]);

  const [selected, setSelected] = useState("All Time");

  const [transactionTypeFilter, setTransactionTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleClearAllFilters = () => {
    setSelected("All Time");
    setTransactionTypeFilter("");
    setStatusFilter("");
  };

  const removeFilter = (filterToRemove: string) => {
    const setFilterValues: Record<string, any> = {
      start_date: setSelected,
      end_date: setSelected,
      transaction_type: setTransactionTypeFilter,
      status: setStatusFilter,
    };

    setFilters((prev) => {
      if (filterToRemove === "start_date" || filterToRemove === "end_date") {
        // eslint-disable-next-line
        const { start_date: _, end_date: __, ...rest } = prev;
        return rest;
      } else {
        // eslint-disable-next-line
        const { [filterToRemove]: _, ...rest } = prev;
        return rest;
      }
    });

    if (filterToRemove === "start_date" || filterToRemove === "end_date") {
      setSelected("All Time");
    } else {
      setFilterValues[filterToRemove]("");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-1">Transactions</h3>

        <div className="flex items-center gap-x-4">
          <FilterTransactionsPopover
            setFilters={setFilters}
            selected={selected}
            setSelected={setSelected}
            transactionTypeFilter={transactionTypeFilter}
            setTransactionTypeFilter={setTransactionTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilters={dateFilters}
          />

          <Button
            className="gap-x-1"
            onClick={() => setOpenFundWalletModal(true)}
          >
            <IconHandCoins className="stroke-white hidden md:inline-flex" />
            <IconPlus className="stroke-white md:hidden" />
            Buy Units
          </Button>
        </div>
      </div>

      <RenderIf condition={Object.keys(filters)?.length > 0}>
        <div className="flex flex-col md:flex-row flex-wrap justify-between items-end">
          <div className="flex flex-wrap gap-2">
            {Object.keys(filters)?.map((filter, index) => (
              <FilterTag
                key={index}
                title={WALLET_FILTER_KEY_MATCH[filter]}
                value={
                  filter === "transaction_type"
                    ? WALLET_TRANSACTION_TYPE_FILTER_ENUM[filters[filter]]
                    : filter === "status"
                    ? WALLET_TRANSACTION_STATUS_FILTER_ENUM[filters[filter]]
                    : filters[filter]
                }
                onClear={() => removeFilter(filter)}
              />
            ))}

            <Button
              variant="link"
              className="underline underline-offset-1 text-button-primary text-xs"
              onClick={() => {
                setFilters({});
                handleClearAllFilters();
              }}
            >
              Clear all filters
            </Button>
          </div>
        </div>
      </RenderIf>

      <TableCmp
        data={tableData ?? []}
        headers={WALLET_TABLE_HEADERS}
        isLoading={isLoadingWalletTransactions}
        emptyStateTitleText="You have no wallet transactions yet"
      />

      <RenderIf condition={!isLoadingWalletTransactions}>
        <RenderIf condition={tableData ? tableData?.length > 0 : false}>
          <div className="md:hidden grid gap-y-2">
            {walletTransactions?.map((transaction) => (
              <TransactionMobileCard
                key={transaction.transaction_id}
                {...transaction}
              />
            ))}
          </div>
        </RenderIf>

        <RenderIf condition={tableData ? tableData?.length > 0 : false}>
          <PaginationCmp
            onInputPage={(val) => handlePageChange(parseInt(val))}
            currentPage={page?.toString()}
            totalPages={useGetTableTotalPages({
              totalDataCount: walletTransactionsCount?.total ?? 0,
              itemsPerPage: itemsPerPage,
            })}
          />
        </RenderIf>
      </RenderIf>

      <FundWalletModal
        isOpen={openFundWalletModal}
        handleClose={() => setOpenFundWalletModal(false)}
      />
    </>
  );
};
