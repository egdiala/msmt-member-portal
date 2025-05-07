"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Loader } from "@/components/shared/loader";
import { CancelAppointmentDialog } from "./appointments/cancel-appointments-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "motion/react";
import {
  IconCalendarCheck2,
  IconClock,
  IconExternalLink,
  // IconHeart,
  // IconStarFull,
} from "@/components/icons";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAppointments } from "@/services/hooks/queries/use-appointments";
import { useCancelAppointment } from "@/services/hooks/mutations/use-appointment";
import { formatSessionDate } from "./appointments/details/appointment-details";
import { formatApptTimeShort, isEmpty } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { BLUR_VARIANTS } from "@/lib/constants";
import { RenderIf } from "@/components/shared";

export const UpcomingAppointmentCard = () => {
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const { data, isPending } = useGetAppointments({ status: "1" });
  const { data: live } = useGetAppointments({ status: "2" });
  const { mutate, isPending: isCancelling } = useCancelAppointment(() => {
    setOpenCancelModal(true);
  });
  const mostRecent = !!live?.length ? live?.[0] : data?.[0];

  const buttonCopy = {
    idle: "Cancel",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isCancelling ? "loading" : "idle";
  }, [isPending]);

  return (
    <AnimatePresence mode="popLayout">
      {isPending ? (
        <motion.div
          key="appointment-card-skeleton-loader"
          layoutId="appointment-card"
          className="max-w-full grid gap-y-4 order-1 md:order-2 col-span-1 xl:col-span-4 h-86 rounded-2xl"
          variants={BLUR_VARIANTS}
          animate="enter"
          exit="exit"
        >
          <Skeleton className="h-full w-full rounded-2xl" />
        </motion.div>
      ) : (
        <motion.div
          key="appointment-card"
          layoutId="appointment-card"
          variants={BLUR_VARIANTS}
          initial="initial"
          animate="enter"
          exit="exit"
          className="max-w-full grid gap-y-4 order-1 md:order-2 col-span-1 xl:col-span-4 bg-white rounded-2xl p-3 md:p-6 w-full"
        >
          <h3 className="text-text-2 text-sm font-semibold">
            Upcoming appointment
          </h3>

          {isEmpty(mostRecent) && !data?.length ? (
            <div className="flex flex-col items-center w-full h-full">
              <EmptyState
                hasIcon
                title="You don't have upcoming appointments"
                subtitle="Upcoming appointments will appear here"
              />
            </div>
          ) : (
            <div className="grid gap-y-4">
              <div className="bg-input-field rounded-lg grid gap-y-3 p-3">
                <div className="flex justify-between">
                  <div className="flex gap-x-2 items-start">
                    <Avatar className="h-11 w-11 rounded-full">
                      <AvatarImage
                        src={mostRecent?.provider_data?.avatar}
                        alt={mostRecent?.provider_data?.name}
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback>
                        {mostRecent?.provider_data?.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid gap-y-0.5">
                      <h3 className="text-sm font-medium text-text-1">
                        {mostRecent?.provider_data?.name}
                      </h3>
                      <p className="text-text-2 text-xs capitalize">
                        {mostRecent?.provider_data?.specialty}
                      </p>

                      {/* <div className="flex gap-x-1 items-center">
                        <IconStarFull className="fill-actions-amber size-4" />
                        <p className="text-xs text-text-1">4.5</p>
                      </div> */}
                    </div>
                  </div>
                  {/* <IconHeart className="stroke-button-secondary size-4" /> */}
                </div>

                <div className="border-b border-divider" />

                <div className="grid gap-y-3">
                  <div className="flex gap-x-1 items-center">
                    <IconCalendarCheck2 className="stroke-text-tertiary size-4" />
                    <p className="text-xs text-text-1">
                      {formatSessionDate(mostRecent?.appt_date || "")}
                    </p>
                  </div>
                  <div className="flex gap-x-1 items-center">
                    <IconClock className="stroke-text-tertiary size-4" />
                    <p className="text-xs text-text-1">
                      {formatApptTimeShort(mostRecent?.appt_time || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Placeholder: Show when session is live */}
              {false && (
                <div className="bg-blue-400 flex justify-center items-center gap-x-2 py-2 rounded-lg">
                  <Image
                    src="/starting-stream.gif"
                    alt="stream start"
                    width={24}
                    height={24}
                    unoptimized
                  />
                  <p className="font-medium text-xs text-button-primary">
                    Provider has started the Session.
                    <Link href="/session" className="underline">
                      Join now
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between lg:pt-5">
            <Button
              asChild
              variant="secondary"
              className="text-button-primary gap-x-1"
            >
              <Link href="/appointments">
                All Appointments
                <IconExternalLink className="stroke-button-primary" />
              </Link>
            </Button>

            <RenderIf condition={mostRecent?.status === 1}>
              <motion.div layout className="flex items-center justify-center">
                <Button
                  onClick={() =>
                    mutate({
                      component: "notice",
                      appointment_id: mostRecent?.appointment_id as string,
                    })
                  }
                  variant="outline"
                  className="py-2 px-4 rounded-full w-41"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                      initial={{ opacity: 0, y: -25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 25 }}
                      key={buttonState}
                    >
                      {buttonCopy[buttonState]}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </RenderIf>
            <RenderIf condition={!!live?.length}>
              <Button asChild className="py-2 px-4">
                <Link href="/session">Join Session</Link>
              </Button>
            </RenderIf>

            <CancelAppointmentDialog
              onCancel={() => {}}
              open={openCancelModal}
              onOpenChange={setOpenCancelModal}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
