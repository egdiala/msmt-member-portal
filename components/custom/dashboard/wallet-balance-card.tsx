"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { IconExternalLink, IconMedicalSavings } from "@/components/icons";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { BLUR_VARIANTS } from "@/lib/constants";
import { useGetWalletTransactions } from "@/services/hooks/queries/use-wallet";
import { FetchedWalletTransactionsStatsType } from "@/types/wallet";

export const WalletBalanceCard = () => {
  const { data, isLoading } =
    useGetWalletTransactions<FetchedWalletTransactionsStatsType>({
      component: "count-status",
    });

  return (
    <AnimatePresence mode="popLayout">
      {isLoading ? (
        <motion.div
          key="wallet-card-skeleton-loader"
          layoutId="wallet-card"
          className="order-3 col-span-1 xl:col-span-3"
          variants={BLUR_VARIANTS}
          animate="enter"
          exit="exit"
        >
          <Skeleton className="h-full w-full rounded-2xl" />
        </motion.div>
      ) : (
        <motion.div
          key="wallet-card"
          layoutId="wallet-card"
          className="order-3 pt-4 md:pt-6 px-6 col-span-1 xl:col-span-3 rounded-2xl bg-text-bg-3 flex flex-row md:flex-col justify-between gap-y-2.5 content-start"
          variants={BLUR_VARIANTS}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <div className="grid gap-y-1 place-content-start">
            <h5 className="text-sm text-white">Wallet balance</h5>
            <p className="text-2xl text-white">
              {formatNumberWithCommas(data?.total_balance ?? 0)}
            </p>
            <Button
              asChild
              variant="secondary"
              className="mt-2 w-fit text-button-primary gap-x-1"
            >
              <Link href="/wallet">
                Wallet
                <IconExternalLink className="stroke-button-primary size-4" />
              </Link>
            </Button>
          </div>

          <div className="flex justify-end -mr-6">
            <IconMedicalSavings className="w-30 md:w-48 h-29 md:h-47" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
