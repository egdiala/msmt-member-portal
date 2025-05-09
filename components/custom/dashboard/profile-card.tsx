"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { IconExternalLink, IconLogOut } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { useGetProfile } from "@/services/hooks/queries/use-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutModal } from "./logout-modal";
import { RenderIf } from "@/components/shared";
import { EmptyState } from "@/components/shared/empty-state";

export const ProfileCard = () => {
  const { data, isLoading } = useGetProfile();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const organizationsData = data?.org_data?.map((val) => {
    return {
      id: val?.org_id,
      name: val?.name,
      icon: val?.avatar,
    };
  });

  return (
    <AnimatePresence mode="popLayout">
      {isLoading ? (
        <motion.div
          key="profile-card-skeleton-loader"
          layoutId="profile-card"
          className="col-span-1 xl:col-span-3 h-86"
          variants={blurVariants}
          animate="enter"
          exit="exit"
        >
          <Skeleton className="h-full w-full rounded-2xl" />
        </motion.div>
      ) : (
        <motion.div
          key="profile-card"
          layoutId="profile-card"
          className="order-3 md:order-1 col-span-1 xl:col-span-3 flex flex-col gap-y-3 rounded-2xl bg-white p-4 md:p-6"
          variants={blurVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <div className="grid gap-y-2 content-start">
            <Avatar className="size-25 rounded-2xl">
              <AvatarImage
                src={data?.avatar || "/assets/blank-profile-picture.png"}
                className="object-cover rounded-2xl w-full h-full border border-divider"
              />
              <AvatarFallback className="text-5xl rounded-2xl">
                {data?.first_name[0]}
                {data?.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="grid gap-y-0.5">
              <h2 className="text-text-2 font-semibold">
                {data?.first_name} {data?.last_name}
              </h2>
              <p className="text-text-tertiary text-xs">{data?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-y-1 flex-1">
            <h4 className="text-text-2 text-xs">Your organisation(s)</h4>

            <div className="flex items-center gap-2 flex-wrap">
              <RenderIf condition={!!organizationsData?.length}>
                {organizationsData?.map((organisation) => (
                  <Link
                    key={organisation.id}
                    href={`/providers/organisation/${organisation?.id}?type=org&service_type=payer`}
                    className="cursor-pointer"
                  >
                    <div className="py-1 px-2 flex items-center gap-x-1 border border-grey-400 rounded-sm">
                      <Avatar>
                        <AvatarImage
                          src={
                            organisation?.icon ||
                            "/assets/blank-profile-picture.png"
                          }
                        />
                      </Avatar>
                      <p className="text-xs text-text-2">{organisation.name}</p>
                    </div>
                  </Link>
                ))}
              </RenderIf>

              <RenderIf condition={organizationsData?.length === 0}>
                <div className="w-full flex justify-center items-center">
                  <EmptyState
                    title=""
                    subtitle="Your organisations will appear here"
                    hasIcon
                  />
                </div>
              </RenderIf>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button
              asChild
              variant="secondary"
              className="text-button-primary gap-x-1"
            >
              <Link href="/profile">
                Profile
                <IconExternalLink className="stroke-button-primary" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="text-button-primary hover:text-button-primary"
              onClick={() => setOpenLogoutModal(true)}
            >
              <IconLogOut className="stroke-button-primary" />
              Logout
            </Button>
          </div>

          <LogoutModal
            handleClose={() => setOpenLogoutModal(false)}
            isOpen={openLogoutModal}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const blurVariants = {
  initial: { opacity: 0, filter: "blur(4px)" },
  enter: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
};
