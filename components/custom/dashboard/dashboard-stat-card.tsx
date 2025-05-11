import { AnimatePresence, motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { IconCalendarCheck2Dashboard } from "@/components/icons";
import { cn } from "@/lib/utils";
import { BLUR_VARIANTS } from "@/lib/constants";

interface IDashboardStatCard {
  title: string;
  value: number;
  isPending: boolean;
  index: number;
}
export const DashboardStatCard = ({
  title,
  value,
  index,
  isPending,
}: IDashboardStatCard) => {
  return (
    <AnimatePresence mode="popLayout">
      {isPending ? (
        <motion.div
          key={`dashboardstat-card-skeleton-loader-${index}`}
          layoutId={`favp-card-${index}`}
          className="order-1 col-span-1 xl:col-span-4 h-24"
          variants={BLUR_VARIANTS}
          animate="enter"
          exit="exit"
        >
          <Skeleton className="h-full w-full rounded-2xl" />
        </motion.div>
      ) : (
        <motion.div
          key={`favp-card-${index}`}
          layoutId={`favp-card-${index}`}
          className="relative flex flex-col justify-center items-center py-4 md:py-6 gap-y-1 text-center bg-white rounded-lg px-6 overflow-hidden"
          variants={BLUR_VARIANTS}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <h4
            className={cn(
              "text-text-2 text-xs md:text-sm overflow-hidden whitespace-nowrap text-ellipsis",
              index === 0 ? "w-full" : "w-[18ch] md:w-full"
            )}
          >
            {title}
          </h4>
          <p className="text-xl md:text-2xl text-text-bg-1">{value}</p>

          <IconCalendarCheck2Dashboard
            className={cn(
              "absolute -top-1 md:top-2",
              index === 0
                ? "-left-2.5 md:-left-3 lg:left-0"
                : "-left-4.5 lg:left-0"
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
