"use client";

import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { useGetWalletTransactions } from "@/services/hooks/queries/use-wallet";
import { FetchedWalletTransactionsStatsType } from "@/types/wallet";
import { TransactionStatCard } from "./transaction-stat-card";

export const WalletStatsSection = () => {
  const { data: walletTransactionsStats } =
    useGetWalletTransactions<FetchedWalletTransactionsStatsType>({
      component: "count-status",
    });

  const walletStats = [
    {
      id: 1,
      title: "Unit Balance",
      value: new Intl.NumberFormat("en-US").format(
        walletTransactionsStats?.total_balance || 0
      ),
      bg: "bg-grey-400",
    },
    {
      id: 2,
      title: "Total Credit",
      value: formatNumberWithCommas(walletTransactionsStats?.total_credit || 0),
      bg: "bg-green",
    },
    {
      id: 3,
      title: "Total Deduction",
      value: formatNumberWithCommas(walletTransactionsStats?.total_debit || 0),
      bg: "bg-red-light",
      // href: "/wallet/deductions",
    },
  ];

  return (
    <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
      {walletStats.map((stat) => (
        <TransactionStatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          className={stat.bg}
          // href={stat.href}
        />
      ))}
    </div>
  );
};
