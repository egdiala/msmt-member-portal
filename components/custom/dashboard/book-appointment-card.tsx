"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { BLUR_VARIANTS } from "@/lib/constants";
import { useGetServiceProviders } from "@/services/hooks/queries/use-providers";
import { FetchedServiceProvidersCountType } from "@/types/providers";

export const BookAppointmentCard = () => {
  const { data: count, isLoading } =
    useGetServiceProviders<FetchedServiceProvidersCountType>({
      component: "count",
    });

  return (
    <AnimatePresence mode="popLayout">
      {isLoading ? (
        <motion.div
          key="appt-booking-card-skeleton-loader"
          layoutId="appt-booking-card"
          className="order-2 md:order-1 col-span-1 xl:col-span-3"
          variants={BLUR_VARIANTS}
          animate="enter"
          exit="exit"
        >
          <Skeleton className="h-full w-full rounded-2xl" />
        </motion.div>
      ) : (
        <motion.div
          key="appt-booking-card"
          layoutId="appt-booking-card"
          className="w-full p-2.5 flex items-end order-2 md:order-1 col-span-1 xl:col-span-3 bg-no-repeat bg-cover bg-[url(../components/assets/book-appointment.png)] rounded-2xl"
          variants={BLUR_VARIANTS}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <div className="mt-50 w-full bg-white opacity-89 py-5 px-6 grid gap-y-4.5 rounded-xl">
            <div className="text-center">
              <h3 className="text-2xl text-text-bg-1">
                {count?.total}
                {count!.total > 200 ? "+" : ""}
              </h3>
              <p className="text-xs text-text-2 rounded-xl">
                Provider{count!.total > 1 ? "s" : ""} available for you
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/providers">Book an Appointment</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
