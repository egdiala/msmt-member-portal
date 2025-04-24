"use client";

import { Fragment } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { IconExternalLink } from "@/components/icons";
import { Avatar, AvatarImage, Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { RenderIf } from "@/components/shared";
import { EmptyState } from "@/components/shared/empty-state";
import { useGetFavouriteProviders } from "@/services/hooks/queries/use-providers";
import {
  FetchedFavouriteProviders,
  FetchedServiceProvidersCountType,
} from "@/types/providers";
import { cn } from "@/lib/utils";
import { BLUR_VARIANTS } from "@/lib/constants";

export const FavouriteProvidersCard = () => {
  const { data, isPending } = useGetFavouriteProviders<
    FetchedFavouriteProviders[]
  >({});

  const { data: favProvidersCount } =
    useGetFavouriteProviders<FetchedServiceProvidersCountType>({
      component: "count",
    });

  return (
    <AnimatePresence mode="popLayout">
      {isPending ? (
        <motion.div
          key="favp-card-skeleton-loader"
          layoutId="favp-card"
          className="order-1 col-span-1 xl:col-span-4"
          variants={BLUR_VARIANTS}
          animate="enter"
          exit="exit"
        >
          <Skeleton className="h-full w-full rounded-2xl" />
        </motion.div>
      ) : (
        <motion.div
          key="favp-card"
          layoutId="favp-card"
          className="order-1 md:order-2 col-span-1 xl:col-span-4 content-start flex flex-col justify-between gap-y-4 rounded-2xl bg-white p-4 md:py-6 md:px-6"
          variants={BLUR_VARIANTS}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <h3 className="font-semibold text-sm text-text-2">
            Favourite Providers
          </h3>

          <div
            className={cn(
              "flex md:h-3/4 md:justify-end flex-row md:flex-col gap-y-3 md:gap-y-4",
              favProvidersCount
                ? favProvidersCount?.total === 0
                  ? "justify-center"
                  : "justify-between"
                : ""
            )}
          >
            <div className="flex-col gap-y-1 flex-1 hidden md:flex">
              <RenderIf
                condition={
                  favProvidersCount ? favProvidersCount?.total === 0 : false
                }
              >
                <div className="flex w-full h-full justify-center items-center">
                  <EmptyState
                    hasIcon
                    title="You have no favourite provider yet"
                    subtitle="Favourite providers allows you to quickly access your preferred providers"
                  />
                </div>
              </RenderIf>

              <RenderIf
                condition={
                  favProvidersCount ? favProvidersCount?.total > 0 : false
                }
              >
                {data ? (
                  [...data!.slice(0, 3)]?.map((provider, index) => (
                    <Fragment key={provider?.provider_id}>
                      <div className="py-3 flex justify-between items-center">
                        <div className="flex gap-x-2 items-center">
                          <Avatar className="rounded-lg size-11">
                            <AvatarImage
                              src={
                                provider?.avatar ||
                                "/assets/blank-profile-picture.png"
                              }
                              alt="main"
                              className="object-cover rounded-lg"
                            />
                          </Avatar>

                          <div>
                            <h3 className="font-medium text-sm text-text-1 capitalize">
                              {provider?.name}
                            </h3>
                            <p className="text-text-tertiary text-xs capitalize">
                              {provider?.specialty}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/providers/individual/${provider?.provider_id}?type=provider&service_type=provider`}
                          className="underline text-button-primary text-xs"
                        >
                          View
                        </Link>
                      </div>

                      <RenderIf
                        condition={
                          favProvidersCount
                            ? index < favProvidersCount?.total - 1
                            : false
                        }
                      >
                        <div className="border-t border-divider"></div>
                      </RenderIf>
                    </Fragment>
                  ))
                ) : (
                  <></>
                )}
              </RenderIf>
            </div>

            <div className="md:hidden flex gap-x-1 items-center justify-start pl-3">
              <RenderIf
                condition={
                  favProvidersCount ? favProvidersCount?.total === 0 : false
                }
              >
                <div className="flex w-full h-full justify-center items-center">
                  <EmptyState
                    hasIcon
                    title="You have no favourite provider yet"
                    subtitle="Favourite providers allows you to quickly access your preferred providers"
                  />
                </div>
              </RenderIf>

              <RenderIf
                condition={
                  favProvidersCount ? favProvidersCount?.total > 0 : false
                }
              >
                <div className="flex items-center">
                  {data ? (
                    [...data!.slice(0, 3)]?.map(
                      (provider: FetchedFavouriteProviders) => (
                        <Avatar
                          asChild
                          className="-ml-3 border border-white w-8 h-8"
                          key={provider?.provider_id}
                        >
                          <Link
                            href={`/providers/individual/${provider?.provider_id}?type=provider&service_type=provider`}
                          >
                            <AvatarImage
                              src={
                                provider?.avatar ||
                                "/assets/blank-profile-picture.png"
                              }
                              alt="provider"
                              className="object-cover"
                            />
                          </Link>
                        </Avatar>
                      )
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </RenderIf>

              <RenderIf
                condition={
                  favProvidersCount ? favProvidersCount?.total > 3 : false
                }
              >
                <p className="text-xs text-brand-1 font-medium">
                  +{favProvidersCount ? favProvidersCount?.total - 3 : 0} more
                </p>
              </RenderIf>
            </div>

            <Button
              asChild
              variant="secondary"
              className="text-button-primary gap-x-1 w-fit md:hidden"
            >
              <Link href="/favourite-providers">
                Favourite Providers
                <IconExternalLink className="stroke-button-primary" />
              </Link>
            </Button>
          </div>

          <Button
            asChild
            variant="secondary"
            className="text-button-primary gap-x-1 w-fit hidden md:inline-flex"
          >
            <Link href="/favourite-providers">
              Favourite Providers
              <IconExternalLink className="stroke-button-primary" />
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
