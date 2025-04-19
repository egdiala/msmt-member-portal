"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { PaginationCmp, RenderIf, TableCmp } from "@/components/shared";
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
import { TRANSACTIONS_DATA } from "@/lib/mock";
import { WALLET_TABLE_HEADERS } from "@/lib/constants";
import { useGetWalletTransactions } from "@/services/hooks/queries/use-wallet";
import {
  FetchedWalletTransactionsCountType,
  FetchedWalletTransactionsType,
} from "@/types/wallet";
import { FundWalletModal } from "./fund-wallet-modal";
import { FilterTransactionsPopover } from "./filter-transactions-popover";
import { TransactionMobileCard } from "./transaction-mobile-card";

export const WalletTable = () => {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({});

  const { data: walletTransactions, isLoading: isLoadingWalletTransactions } =
    useGetWalletTransactions<FetchedWalletTransactionsType[]>({
      page: page?.toString(),
      item_per_page: itemsPerPage.toString(),
      ...filters,
    });

  const { data: walletTransactionsCount } =
    useGetWalletTransactions<FetchedWalletTransactionsCountType>({
      component: "count",
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

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-1">Transactions</h3>

        <div className="flex items-center gap-x-4">
          <FilterTransactionsPopover setFilters={setFilters} />

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

      <TableCmp
        data={tableData ?? []}
        headers={WALLET_TABLE_HEADERS}
        isLoading={isLoadingWalletTransactions}
        emptyStateTitleText="You have no wallet transactions yet"
      />

      <RenderIf condition={!isLoadingWalletTransactions}>
        <RenderIf condition={tableData ? tableData?.length > 0 : false}>
          <div className="md:hidden grid gap-y-2">
            {TRANSACTIONS_DATA.map((transaction) => (
              <TransactionMobileCard key={transaction.id} {...transaction} />
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
