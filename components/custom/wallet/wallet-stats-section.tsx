"use client";

import { TransactionStatCard } from "./transaction-stat-card";

export const WalletStatsSection = () => {
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

  return (
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
  );
};
