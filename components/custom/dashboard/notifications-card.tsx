"use client";

import Link from "next/link";
import { RenderIf } from "@/components/shared";
import { IconExternalLink } from "@/components/icons";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { useGetAllNotifications } from "@/services/hooks/queries/use-notifications";
import { AnimatePresence, motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatRelative } from "date-fns";

export const NotificationsCard = () => {
  const { data, isPending } = useGetAllNotifications({
    page: "1",
    status: "0",
    item_per_page: "3",
  });

  return (
    <AnimatePresence mode="popLayout">
      {
        isPending ? (
          <motion.div key="notifications-card-skeleton-loader" layoutId="notifications-card" className="col-span-1 md:col-span-2 xl:col-span-5" variants={blurVariants} animate="enter" exit="exit">
            <Skeleton className="h-full w-full rounded-2xl" />
          </motion.div>
        ) : (
            <motion.div key="notifications-card" layoutId="profile-card" className="col-span-1 md:col-span-2 xl:col-span-5 flex flex-col justify-between gap-y-4 rounded-2xl bg-white py-6 px-4 md:px-6" variants={blurVariants} initial="initial" animate="enter" exit="exit">
              <h3 className="font-semibold text-sm text-text-2">Notifications</h3>
              <RenderIf condition={data?.length !== 0}>
                <ul className="flex flex-col w-full gap-y-2 flex-1">
                  <AnimatePresence>
                  {
                    data?.map((val, index) =>
                        <motion.li initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * index, type: "spring", bounce: 0 }} key={index} className="rounded-sm bg-input-field py-4 px-3 grid gap-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-xs text-text-1 capitalize">
                          {formatRelative(val.createdAt, new Date()).split("at")[0]} • {format(val.createdAt, "p")}
                        </p>
                        <div
                          className={cn(
                            "bg-button-primary size-2 rounded-full",
                          )}
                        ></div>
                      </div>
                      <div className="border-b border-divider"></div>
                      <p className="text-xs text-text-2 overflow-hidden whitespace-nowrap text-ellipsis max-w-[60ch]">
                        {val.body}
                      </p>
                        </motion.li>
                      )
                  }
                  </AnimatePresence>
                </ul>
              </RenderIf>
              <RenderIf condition={data?.length === 0}>
                <div className="flex flex-col w-full justify-center items-center flex-1">
                  <EmptyState
                    hasIcon
                    title="No Notifications"
                    subtitle="New notifications would appear here"
                  />
                </div>
              </RenderIf>

              <Button
                asChild
                variant="secondary"
                className="text-button-primary gap-x-1 w-fit"
              >
                <Link href="/notifications">
                  Notifications
                  <IconExternalLink className="stroke-button-primary" />
                </Link>
              </Button>
            </motion.div>
        )
      }
    </AnimatePresence>
  );
};

const blurVariants = {
	initial: { opacity: 0, filter: 'blur(4px)' },
	enter: { opacity: 1, filter: 'blur(0px)' },
	exit: { opacity: 0, filter: 'blur(4px)' },
}
